package com.project.pcshop.responses;

import com.project.pcshop.models.entities.ProductImage;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageResponse {
    private Long id;
    private Long productId;
    private String imageUrl;

    public static ProductImageResponse fromProductImage(ProductImage productImage) {
        return ProductImageResponse.builder()
                .id(productImage.getId())
                .productId(productImage.getProduct().getId())
                .imageUrl(productImage.getImageUrl())
                .build();
    }
}
