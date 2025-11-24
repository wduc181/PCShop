package com.project.pcshop.dtos.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    @NotBlank(message = "Product's name is required")
    private String name;

    @Min(value = 0, message = "Price must be >= 0")
    private float price;

    private float discount;

    @JsonProperty("stock_quantity")
    @Min(value = 0, message = "Stock quantity must be >= 0")
    private int stockQuantity;

    @Length(max = 300, message = "Invalid thumbnail's length")
    private String thumbnail;

    private String description;

    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty("brand_id")
    private Long brandId;
}
