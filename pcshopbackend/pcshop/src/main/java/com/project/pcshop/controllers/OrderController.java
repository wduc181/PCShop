package com.project.pcshop.controllers;

import com.project.pcshop.common.ApiResponse;
import com.project.pcshop.dtos.order.OrderCreateDTO;
import com.project.pcshop.dtos.order.OrderUpdateInfoDTO;
import com.project.pcshop.dtos.order.OrderUpdateStatusDTO;
import com.project.pcshop.responses.OrderResponse;
import com.project.pcshop.services.interfaces.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/from-cart/{userId}")
    public ResponseEntity<ApiResponse<?>> createOrderFromCart(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody OrderCreateDTO orderCreateDTO
    ) throws Exception {
        OrderResponse orderResponse = orderService.createOrderFromCart(userId, orderCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .status(HttpStatus.CREATED)
                .message("Create order successfully")
                .responseObject(orderResponse)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<ApiResponse<?>> getAllOrders() {
        List<OrderResponse> orderResponses = orderService.getAllOrders();
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Get all orders successfully")
                .responseObject(orderResponses)
                .build()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws Exception {
        Page<OrderResponse> orderResponses = orderService.getOrdersByUser(userId, page, size);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Get all orders successfully")
                .responseObject(orderResponses)
                .build()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse<?>> getOrderWithDetails(
            @PathVariable("id") Long id
    ) throws Exception {
        OrderResponse orderResponse = orderService.getOrderWithDetails(id);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Get order successfully")
                .responseObject(orderResponse)
                .build()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateOrderInfo(
            @PathVariable Long id,
            @Valid @RequestBody OrderUpdateInfoDTO orderUpdateInfoDTO
    ) throws Exception {
        OrderResponse orderResponse = orderService.updateOrderInfo(id, orderUpdateInfoDTO);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Update order successfully")
                .responseObject(orderResponse)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderUpdateStatusDTO orderUpdateStatusDTO
    )  throws Exception {
        OrderResponse orderResponse = orderService.updateOrderStatus(id, orderUpdateStatusDTO);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Update order successfully")
                .responseObject(orderResponse)
                .build()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable("id") Long id
    ) throws Exception {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Cancel order successfully")
                .responseObject(null)
                .build()
        );
    }
}