package com.project.pcshop.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCommentDTO {
    @NotBlank(message = "invalid comment")
    @Size(max = 5000, message = "comment is too long")
    private String content;
}
