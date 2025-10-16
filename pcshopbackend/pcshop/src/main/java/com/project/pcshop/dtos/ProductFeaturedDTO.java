package com.project.pcshop.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductFeaturedDTO {
    @Min(value = 0, message = "invalid value")
    @Max(value = 1, message = "invalid value")
    private Integer isFeatured;
}
