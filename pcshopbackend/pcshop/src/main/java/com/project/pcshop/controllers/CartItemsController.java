package com.project.pcshop.controllers;

import com.project.pcshop.dtos.CartItemsDTO;
import com.project.pcshop.models.entities.CartItems;
import com.project.pcshop.responses.ApiMessageResponse;
import com.project.pcshop.responses.CartResponse;
import com.project.pcshop.services.interfaces.ICartItemsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/cart-items")
@RequiredArgsConstructor
public class CartItemsController {

    private final ICartItemsService cartItemService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping
    public ResponseEntity<?> addItem(
            @Valid @RequestBody CartItemsDTO cartItemsDTO,
            BindingResult result
    ) {
       try {
           if (result.hasErrors()) {
               List<String> errorMessages = result.getFieldErrors()
                       .stream().map(FieldError::getDefaultMessage).toList();
               return ResponseEntity.badRequest().body(errorMessages);
           }
           cartItemService.addItemToCart(cartItemsDTO);
           return ResponseEntity.ok("Added to cart");
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
    }


    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        List<CartItems> items = cartItemService.getCartByUser(userId);
        return ResponseEntity.ok(CartResponse.fromCartItems(items, userId));
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity
    ) {
        cartItemService.updateItemQuantity(id, quantity);
        return ResponseEntity.ok(new ApiMessageResponse("Updated quantity successfully"));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeItem(@PathVariable Long id) {
        cartItemService.removeItem(id);
        return ResponseEntity.ok(new ApiMessageResponse("Removed item successfully"));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        cartItemService.clearCart(userId);
        return ResponseEntity.ok(new ApiMessageResponse("Clear cart successfully"));
    }
}
