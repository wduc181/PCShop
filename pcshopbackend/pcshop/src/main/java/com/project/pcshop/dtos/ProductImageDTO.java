package com.project.pcshop.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDTO {
    @JsonProperty("product_id")
    @Min(value = 1, message = "Product ID must be > 0.")
    private Long productId;


    @JsonProperty("image_url")
    @Size(min = 5, max = 300, message = "Image file name.")
    private String imageUrl;
}
