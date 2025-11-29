package com.project.pcshop.controllers;

import com.project.pcshop.common.ApiResponse;
import com.project.pcshop.dtos.comment.CommentDTO;
import com.project.pcshop.dtos.comment.CommentUpdateDTO;
import com.project.pcshop.responses.CommentResponse;
import com.project.pcshop.services.interfaces.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("")
    public ResponseEntity<ApiResponse<?>> createComment(
            @Valid @RequestBody CommentDTO commentDTO
    ) throws Exception {
        CommentResponse newCommentResponse = commentService.createComment(commentDTO);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Comment created successfully")
                .responseObject(newCommentResponse)
                .build()
        );
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<?>> getRootCommentsByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sort
    ) throws Exception {
        Page<CommentResponse> commentResponses = commentService.getRootCommentsByProduct(productId, page, size, sort);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Got root comments by product with id = " + productId)
                .responseObject(commentResponses)
                .build()
        );
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<ApiResponse<?>> getReplies(
            @PathVariable Long commentId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort
    ) throws Exception {
        Page<CommentResponse> repliesResponse = commentService.getReplies(commentId, page, size, sort);

        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Got replies of comment with id = " + commentId)
                .responseObject(repliesResponse)
                .build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<?>> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentUpdateDTO body
    ) throws Exception {
        CommentResponse commentResponse = commentService.updateComment(commentId, body.getContent());
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Updated comment successfully")
                .responseObject(commentResponse)
                .build()
        );
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<?>> deleteComment(
            @PathVariable Long commentId
    ) throws Exception {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Deleted comment successfully")
                .responseObject(null)
                .build()
        );
    }
}
