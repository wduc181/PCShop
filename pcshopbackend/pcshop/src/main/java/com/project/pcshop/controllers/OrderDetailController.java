package com.project.pcshop.controllers;

import com.project.pcshop.models.entities.OrderDetail;
import com.project.pcshop.responses.OrderDetailResponse;
import com.project.pcshop.services.interfaces.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order-details")
@RequiredArgsConstructor
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getDetailsByOrder(@PathVariable Long orderId) {
        try {
            List<OrderDetail> details = orderDetailService.getOrderDetailsByOrder(orderId);
            return ResponseEntity.ok(
                    details.stream().map(OrderDetailResponse::fromOrderDetail).toList()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
