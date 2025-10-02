package com.project.pcshop.responses;

import com.project.pcshop.models.CartItems;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
    private Long userId;
    private List<CartItemsResponse> items;
    private float totalPrice;

    public static CartResponse fromCartItems(List<CartItems> cartItems, Long userId) {
        List<CartItemsResponse> responses = cartItems.stream()
                .map(CartItemsResponse::fromCartItem)
                .toList();

        float total = (float) responses.stream()
                .mapToDouble(CartItemsResponse::getSubtotal)
                .sum();

        return new CartResponse(userId, responses, total);
    }
}
