package com.project.pcshop.controllers;

import com.project.pcshop.common.ApiResponse;
import com.project.pcshop.dtos.cartItem.CartItemsDTO;
import com.project.pcshop.responses.CartResponse;
import com.project.pcshop.services.interfaces.CartItemsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/cart-items")
@RequiredArgsConstructor
public class CartItemsController {
    private final CartItemsService cartItemService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("")
    public ResponseEntity<ApiResponse<?>> addItem(
            @Valid @RequestBody CartItemsDTO cartItemsDTO
    ) throws Exception {
       cartItemService.addItemToCart(cartItemsDTO);
       return ResponseEntity.ok().body(ApiResponse.builder()
               .status(HttpStatus.OK)
               .message("Item added successfully")
               .responseObject(null)
               .build()
       );
    }


    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<?>> getCart(
            @PathVariable("userId") Long userId
    ) throws Exception {
        CartResponse cartResponse = cartItemService.getCartByUser(userId);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Get cart items successfully")
                .responseObject(cartResponse)
                .build()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateQuantity(
            @PathVariable("id") Long id,
            @RequestParam Integer quantity
    ) throws Exception {
        cartItemService.updateItemQuantity(id, quantity);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Update item quantity successfully")
                .responseObject(null)
                .build()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> removeItem(
            @PathVariable("id") Long id
    ) throws Exception {
        cartItemService.removeItem(id);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Removed item from cart successfully")
                .responseObject(null)
                .build()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<?>> clearCart(
            @PathVariable("userId") Long userId
    ) throws Exception {
        cartItemService.clearCart(userId);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Cleared cart successfully")
                .responseObject(null)
                .build()
        );
    }
}