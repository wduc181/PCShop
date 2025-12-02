package com.project.pcshop.controllers;

import com.project.pcshop.common.ApiResponse;
import com.project.pcshop.responses.OrderDetailResponse;
import com.project.pcshop.services.interfaces.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ApiResponse<?>> getDetailsByOrder(
            @PathVariable("orderId") Long orderId
    ) throws Exception {
        List<OrderDetailResponse> details = orderDetailService.getOrderDetailsByOrder(orderId);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Get Order detail of order with id = " + orderId)
                .responseObject(details)
                .build()
        );
    }
}
