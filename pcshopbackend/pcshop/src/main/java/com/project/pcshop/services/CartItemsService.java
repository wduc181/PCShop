package com.project.pcshop.services;

import com.project.pcshop.dtos.CartItemsDTO;
import com.project.pcshop.models.CartItems;
import com.project.pcshop.models.Product;
import com.project.pcshop.models.User;
import com.project.pcshop.repositories.CartItemsRepository;
import com.project.pcshop.repositories.ProductRepository;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.services.interfaces.ICartItemsService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartItemsService implements ICartItemsService {
    private final CartItemsRepository cartItemsRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public List<CartItems> addItemToCart(CartItemsDTO cartItemsDTO) {
        User user = userRepository.findById(cartItemsDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Product product = productRepository.findById(cartItemsDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        CartItems cartItems = cartItemsRepository.findByUserIdAndProductId(cartItemsDTO.getUserId(), cartItemsDTO.getProductId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + cartItemsDTO.getQuantity());
                    return existing;
                })
                .orElseGet(() -> CartItems.builder()
                        .user(user)
                        .product(product)
                        .quantity(cartItemsDTO.getQuantity())
                        .build());

        cartItemsRepository.save(cartItems);
        return cartItemsRepository.findByUserId(cartItemsDTO.getUserId());
    }

    @Override
    public List<CartItems> updateItemQuantity(Long cartItemId, Integer quantity) {
        CartItems cartItems = cartItemsRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));
        cartItems.setQuantity(quantity);
        cartItemsRepository.save(cartItems);
        return cartItemsRepository.findByUserId(cartItems.getUser().getId());
    }

    @Override
    public List<CartItems> removeItem(Long cartItemId) {
        CartItems cartItems = cartItemsRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));
        Long userId = cartItems.getUser().getId();
        cartItemsRepository.delete(cartItems);
        return cartItemsRepository.findByUserId(userId);
    }

    @Override
    public List<CartItems> clearCart(Long userId) {
        List<CartItems> items = cartItemsRepository.findByUserId(userId);
        cartItemsRepository.deleteAll(items);
        return cartItemsRepository.findByUserId(userId);
    }

    @Override
    public List<CartItems> getCartByUser(Long userId) {
        return cartItemsRepository.findByUserId(userId);
    }
}
