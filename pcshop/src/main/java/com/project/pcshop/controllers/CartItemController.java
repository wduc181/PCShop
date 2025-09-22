package com.project.pcshop.controllers;

import com.project.pcshop.dtos.CartItemDTO;
import com.project.pcshop.models.CartItem;
import com.project.pcshop.responses.CartResponse;
import com.project.pcshop.services.interfaces.ICartItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/cart-items")
@RequiredArgsConstructor
public class CartItemController {

    private final ICartItemService cartItemService;

    @PostMapping
    public ResponseEntity<?> addItem(
            @Valid @RequestBody CartItemDTO cartItemDTO,
            BindingResult result
    ) {
       try {
           if (result.hasErrors()) {
               List<String> errorMessages = result.getFieldErrors()
                       .stream().map(FieldError::getDefaultMessage).toList();
               return ResponseEntity.badRequest().body(errorMessages);
           }
           List<CartItem> items = cartItemService.addItemToCart(cartItemDTO);
           return ResponseEntity.ok("Added to cart");
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity
    ) {
        List<CartItem> items = cartItemService.updateItemQuantity(id, quantity);
        Long userId = items.isEmpty() ? null : items.getFirst().getUser().getId();
        return ResponseEntity.ok("Updated item's quantity");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeItem(@PathVariable Long id) {
        List<CartItem> items = cartItemService.removeItem(id);
        Long userId = items.isEmpty() ? null : id;
        return ResponseEntity.ok("Removed item successfully");
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        List<CartItem> items = cartItemService.clearCart(userId);
        return ResponseEntity.ok("Clear cart successfully");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        List<CartItem> items = cartItemService.getCartByUser(userId);
        return ResponseEntity.ok(CartResponse.fromCartItems(items, userId));
    }
}
