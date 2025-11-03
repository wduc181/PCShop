package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.CartItemsDTO;
import com.project.pcshop.models.entities.CartItems;

import java.util.List;

public interface ICartItemsService {
    void addItemToCart(CartItemsDTO cartItemsDTO);
    List<CartItems> getCartByUser(Long userId);
    void updateItemQuantity(Long cartItemId, Integer quantity);
    void removeItem(Long cartItemId);
    void clearCart(Long userId);
}
