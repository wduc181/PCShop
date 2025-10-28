package com.project.pcshop.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    @JsonProperty("product_id")
    @NotNull(message = "Product's ID can't be null")
    private Long productId;

    @JsonProperty("user_id")
    @NotNull(message = "You must login to comment")
    private Long userId;

    @JsonProperty("root_comment_id")
    private Long rootCommentId;

    @NotBlank(message = "invalid comment")
    @Size(max = 5000, message = "comment is too long")
    private String content;
}
