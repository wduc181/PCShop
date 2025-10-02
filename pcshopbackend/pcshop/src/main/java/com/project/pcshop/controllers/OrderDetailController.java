package com.project.pcshop.controllers;

import com.project.pcshop.models.OrderDetail;
import com.project.pcshop.responses.OrderDetailResponse;
import com.project.pcshop.services.interfaces.IOrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order-details")
@RequiredArgsConstructor
public class OrderDetailController {

    private final IOrderDetailService orderDetailService;

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

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailById(@PathVariable Long id) {
        try {
            OrderDetail detail = orderDetailService.getOrderDetailById(id);
            return ResponseEntity.ok(OrderDetailResponse.fromOrderDetail(detail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDetail(@PathVariable Long id) {
        try {
            orderDetailService.deleteOrderDetail(id);
            return ResponseEntity.ok("OrderDetail deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
