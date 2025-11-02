package com.project.pcshop.controllers;

import com.project.pcshop.dtos.CommentDTO;
import com.project.pcshop.dtos.CommentUpdateDTO;
import com.project.pcshop.models.entities.Comment;
import com.project.pcshop.responses.ApiMessageResponse;
import com.project.pcshop.responses.CommentResponse;
import com.project.pcshop.services.interfaces.ICommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final ICommentService commentService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createComment(
            @Valid @RequestBody CommentDTO commentDTO,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream().map(FieldError::getDefaultMessage).toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Comment newComment = commentService.createComment(commentDTO);
            CommentResponse commentResponse = CommentResponse.fromComment(newComment);
            return ResponseEntity.ok(commentResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getRootCommentsByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sort
    ) {
        Page<Comment> comments = commentService.getRootCommentsByProduct(productId, page, size, sort);
        Page<CommentResponse> commentResponses = comments.map(CommentResponse::fromComment);
        return ResponseEntity.ok(commentResponses);
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<?> getReplies(
            @PathVariable Long commentId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort
    ) {
        Page<Comment> replies = commentService.getReplies(commentId, page, size, sort);
        Page<CommentResponse> replyResponse = replies.map(CommentResponse::fromComment);
        return ResponseEntity.ok(replyResponse);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentUpdateDTO body
    ) {
        try {
            Comment existingComment = commentService.updateComment(commentId, body.getContent());
            CommentResponse commentResponse = CommentResponse.fromComment(existingComment);
            return ResponseEntity.ok(commentResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok(new ApiMessageResponse("Comment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
