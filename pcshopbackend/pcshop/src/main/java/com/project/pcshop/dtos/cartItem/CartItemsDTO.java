package com.project.pcshop.dtos.cartItem;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemsDTO {
    @JsonProperty("user_id")
    @NotNull(message = "User ID is required")
    private Long userId;

    @JsonProperty("product_id")
    @NotNull(message = "Product ID is required")
    private Long productId;

    @Min(value = 1, message = "Invalid quantity")
    private Integer quantity;
}
