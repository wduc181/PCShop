package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.CartItemDTO;
import com.project.pcshop.models.CartItem;

import java.util.List;

public interface ICartItemService {
    List<CartItem> addItemToCart(CartItemDTO cartItemDTO);
    List<CartItem> updateItemQuantity(Long cartItemId, Integer quantity);
    List<CartItem> removeItem(Long cartItemId);
    List<CartItem> clearCart(Long userId);
    List<CartItem> getCartByUser(Long userId);
}
