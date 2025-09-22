package com.project.pcshop.services;

import com.project.pcshop.dtos.CartItemDTO;
import com.project.pcshop.models.CartItem;
import com.project.pcshop.models.Product;
import com.project.pcshop.models.User;
import com.project.pcshop.repositories.CartItemRepository;
import com.project.pcshop.repositories.ProductRepository;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.services.interfaces.ICartItemService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartItemService implements ICartItemService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public List<CartItem> addItemToCart(CartItemDTO cartItemDTO) {
        User user = userRepository.findById(cartItemDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Product product = productRepository.findById(cartItemDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(cartItemDTO.getUserId(), cartItemDTO.getProductId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + cartItemDTO.getQuantity());
                    return existing;
                })
                .orElseGet(() -> CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(cartItemDTO.getQuantity())
                        .build());

        cartItemRepository.save(cartItem);
        return cartItemRepository.findByUserId(cartItemDTO.getUserId());
    }

    @Override
    public List<CartItem> updateItemQuantity(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));
        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return cartItemRepository.findByUserId(cartItem.getUser().getId());
    }

    @Override
    public List<CartItem> removeItem(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));
        Long userId = cartItem.getUser().getId();
        cartItemRepository.delete(cartItem);
        return cartItemRepository.findByUserId(userId);
    }

    @Override
    public List<CartItem> clearCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        cartItemRepository.deleteAll(items);
        return cartItemRepository.findByUserId(userId);
    }

    @Override
    public List<CartItem> getCartByUser(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }
}
