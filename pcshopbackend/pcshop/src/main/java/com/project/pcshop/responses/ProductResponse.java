package com.project.pcshop.responses;

import com.project.pcshop.models.entities.Product;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private Float price;
    private Float discount;
    private Integer stockQuantity;
    private String thumbnail;
    private String description;
    private Integer warrantyMonths;
    private Boolean isActive;
    private Boolean isFeatured;
    private String categoryName;
    private String brandName;

    public static ProductResponse fromProduct(Product product) {
        return ProductResponse.builder()
                .id(product.getId().longValue())
                .name(product.getName())
                .price(product.getPrice())
                .discount(product.getDiscount())
                .stockQuantity(product.getStockQuantity())
                .thumbnail(product.getThumbnail())
                .description(product.getDescription())
                .warrantyMonths(product.getWarrantyMonths())
                .isActive(product.getIsActive())
                .isFeatured(product.getIsFeatured())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .build();
    }
}
