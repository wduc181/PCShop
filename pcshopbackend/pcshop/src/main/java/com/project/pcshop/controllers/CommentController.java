package com.project.pcshop.controllers;

import com.project.pcshop.dtos.CommentDTO;
import com.project.pcshop.dtos.UpdateCommentDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.models.Comment;
import com.project.pcshop.models.User;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.responses.CommentResponse;
import com.project.pcshop.services.interfaces.ICommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final ICommentService commentService;
    private final UserRepository userRepository;

    private Long resolveCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        String phone = auth.getName();
        if (phone == null) return null;
        return userRepository.findByPhoneNumber(phone).map(User::getId).orElse(null);
    }

    private boolean currentUserIsAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if (ga != null) {
                String r = ga.getAuthority();
                if (r != null && r.trim().equalsIgnoreCase("ROLE_ADMIN")) return true;
            }
        }
        return false;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createComment(@Valid @RequestBody CommentDTO dto) {
        try {
            Long currentUserId = resolveCurrentUserId();
            if (currentUserId == null) return ResponseEntity.status(401).body("Unauthorized");
            // enforce current user as comment owner
            dto.setUserId(currentUserId);
            Comment c = commentService.createComment(dto);
            return ResponseEntity.ok(CommentResponse.fromComment(c));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
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
        try {
            Sort s = Sort.by("createdAt");
            if ("asc".equalsIgnoreCase(sort)) s = s.ascending(); else s = s.descending();
            Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, s);
            Page<Comment> data = commentService.getRootCommentsByProduct(productId, pageable);
            Page<CommentResponse> res = data.map(CommentResponse::fromComment);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<?> getReplies(
            @PathVariable Long commentId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort
    ) {
        try {
            Sort s = Sort.by("createdAt");
            if ("desc".equalsIgnoreCase(sort)) s = s.descending(); else s = s.ascending();
            Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, s);
            Page<Comment> data = commentService.getReplies(commentId, pageable);
            Page<CommentResponse> res = data.map(CommentResponse::fromComment);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentDTO body
    ) {
        try {
            Long currentUserId = resolveCurrentUserId();
            if (currentUserId == null) return ResponseEntity.status(401).body("Unauthorized");
            boolean isAdmin = currentUserIsAdmin();
            Comment c = commentService.updateComment(commentId, currentUserId, body.getContent(), isAdmin);
            return ResponseEntity.ok(CommentResponse.fromComment(c));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            Long currentUserId = resolveCurrentUserId();
            if (currentUserId == null) return ResponseEntity.status(401).body("Unauthorized");
            boolean isAdmin = currentUserIsAdmin();
            commentService.deleteComment(commentId, currentUserId, isAdmin);
            return ResponseEntity.ok("Comment deleted successfully");
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
