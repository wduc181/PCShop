package com.project.pcshop.responses;

import com.project.pcshop.models.entities.Comment;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    private Long id;
    private Long productId;
    private Long userId;
    private String userName;
    private Long rootCommentId;
    private String content;
    private boolean edited;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentResponse fromComment(Comment c) {
        return CommentResponse.builder()
                .id(c.getId())
                .productId(c.getProduct() != null ? c.getProduct().getId() : null)
                .userId(c.getUser() != null ? c.getUser().getId() : null)
                .userName(c.getUser() != null ? c.getUser().getFullName() : null)
                .rootCommentId(c.getRootComment() != null ? c.getRootComment().getId() : null)
                .content(c.getContent())
                .edited(c.isEdited())
                .active(c.isActive())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
