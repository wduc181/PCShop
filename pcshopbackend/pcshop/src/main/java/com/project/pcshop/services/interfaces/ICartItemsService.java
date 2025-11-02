package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.CartItemsDTO;
import com.project.pcshop.models.entities.CartItems;

import java.util.List;

public interface ICartItemsService {
    List<CartItems> addItemToCart(CartItemsDTO cartItemsDTO);
    List<CartItems> updateItemQuantity(Long cartItemId, Integer quantity);
    List<CartItems> removeItem(Long cartItemId);
    List<CartItems> clearCart(Long userId);
    List<CartItems> getCartByUser(Long userId);
}
