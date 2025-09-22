package com.project.pcshop.responses;

import com.project.pcshop.models.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
    private Long userId;
    private List<CartItemResponse> items;
    private float totalPrice;

    public static CartResponse fromCartItems(List<CartItem> cartItems, Long userId) {
        List<CartItemResponse> responses = cartItems.stream()
                .map(CartItemResponse::fromCartItem)
                .toList();

        float total = (float) responses.stream()
                .mapToDouble(CartItemResponse::getSubtotal)
                .sum();

        return new CartResponse(userId, responses, total);
    }
}
