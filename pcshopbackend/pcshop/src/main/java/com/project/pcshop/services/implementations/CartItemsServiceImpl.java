package com.project.pcshop.services.implementations;

import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.responses.CartResponse;
import com.project.pcshop.security.components.SecurityUtil;
import com.project.pcshop.dtos.cartItem.CartItemsDTO;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.entities.CartItems;
import com.project.pcshop.entities.Product;
import com.project.pcshop.entities.User;
import com.project.pcshop.repositories.CartItemsRepository;
import com.project.pcshop.repositories.ProductRepository;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.services.interfaces.CartItemsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartItemsServiceImpl implements CartItemsService {
    private final CartItemsRepository cartItemsRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SecurityUtil securityUtil;

    @Transactional
    @Override
    public void addItemToCart(CartItemsDTO cartItemsDTO) throws Exception {
        User user = userRepository.findById(cartItemsDTO.getUserId())
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        Product product = productRepository.findById(cartItemsDTO.getProductId())
                .orElseThrow(() -> new DataNotFoundException("Product not found"));

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
    public CartResponse getCartByUser(Long userId) throws Exception {
        if (!securityUtil.currentUserIsValid(userId)) {
            throw new PermissionDenyException("You don't have permission to view an item from another user's cart");
        }
        return CartResponse.fromCartItems(cartItemsRepository.findByUserId(userId), userId);
    }

    @Override
    public void updateItemQuantity(Long cartItemId, Integer quantity) throws Exception {
        CartItems cartItems = cartItemsRepository.findById(cartItemId)
                .orElseThrow(() -> new DataNotFoundException("Cart item not found"));

        cartItems.setQuantity(quantity);
        cartItemsRepository.save(cartItems);
    }

    @Override
    public void removeItem(Long cartItemId) throws Exception {
        CartItems cartItems = cartItemsRepository.findById(cartItemId)
                .orElseThrow(() -> new DataNotFoundException("Cart item not found"));
        cartItemsRepository.delete(cartItems);
    }

    @Override
    public void clearCart(Long userId) throws Exception {
        if (!securityUtil.currentUserIsValid(userId)) {
            throw new PermissionDenyException("You don't have permission to clear items from another user's cart");
        }
        List<CartItems> items = cartItemsRepository.findByUserId(userId);
        cartItemsRepository.deleteAll(items);
    }
}
