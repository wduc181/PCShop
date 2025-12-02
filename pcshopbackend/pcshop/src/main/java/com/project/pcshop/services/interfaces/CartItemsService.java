package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.cartItem.CartItemsDTO;
import com.project.pcshop.responses.CartResponse;

public interface CartItemsService {
    void addItemToCart(CartItemsDTO cartItemsDTO) throws Exception;
    CartResponse getCartByUser(Long userId) throws Exception;
    void updateItemQuantity(Long cartItemId, Integer quantity) throws Exception;
    void removeItem(Long cartItemId) throws Exception;
    void clearCart(Long userId) throws  Exception;
}
