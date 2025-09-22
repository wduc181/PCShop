package com.project.pcshop.responses;

import com.project.pcshop.models.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private float price;
    private float subtotal;

    public static CartItemResponse fromCartItem(CartItem item) {
        float price = item.getProduct().getPrice();
        float subtotal = price * item.getQuantity();
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getQuantity(),
                price,
                subtotal
        );
    }
}
