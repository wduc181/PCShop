package com.project.pcshop.repositories;

import com.project.pcshop.models.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemsRepository extends JpaRepository<CartItems, Long> {
    Optional<CartItems> findByUserIdAndProductId(Long userId, Long productId);
    List<CartItems> findByUserId(Long userId);
}
