package com.project.pcshop.services;

import com.project.pcshop.components.SecurityUtil;
import com.project.pcshop.dtos.CartItemsDTO;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.models.entities.CartItems;
import com.project.pcshop.models.entities.Product;
import com.project.pcshop.models.entities.User;
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
    private final SecurityUtil securityUtil;

    @Override
    public void addItemToCart(CartItemsDTO cartItemsDTO) {
        User user = userRepository.findById(cartItemsDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Product product = productRepository.findById(cartItemsDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        if (!securityUtil.currentUserIsValid(user.getId())) {
            throw new PermissionDenyException("You don't have permission to add an item to another user's cart");
        }

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
    }

    @Override
    public List<CartItems> getCartByUser(Long userId) {
        if (!securityUtil.currentUserIsValid(userId)) {
            throw new PermissionDenyException("You don't have permission to view an item from another user's cart");
        }
        return cartItemsRepository.findByUserId(userId);
    }

    @Override
    public void updateItemQuantity(Long cartItemId, Integer quantity) {
        CartItems cartItems = cartItemsRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));
        cartItems.setQuantity(quantity);
        cartItemsRepository.save(cartItems);
    }

    @Override
    public void removeItem(Long cartItemId) {
        CartItems cartItems = cartItemsRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));
        cartItemsRepository.delete(cartItems);
    }

    @Override
    public void clearCart(Long userId) {
        List<CartItems> items = cartItemsRepository.findByUserId(userId);
        cartItemsRepository.deleteAll(items);
    }
}
