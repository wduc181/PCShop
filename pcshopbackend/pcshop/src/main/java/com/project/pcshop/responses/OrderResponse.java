package com.project.pcshop.responses;

import com.project.pcshop.models.Order;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String shippingAddress;
    private String note;
    private Float totalPrice;
    private String paymentMethod;
    private String shippingMethod;
    private String trackingNumber;
    private LocalDateTime orderDate;
    private String status;
    private String paymentStatus;

    private List<OrderDetailResponse> details;

    public static OrderResponse fromOrder(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .fullName(order.getFullName())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .shippingAddress(order.getShippingAddress())
                .note(order.getNote())
                .totalPrice(order.getTotalPrice())
                .paymentMethod(order.getPaymentMethod())
                .shippingMethod(order.getShippingMethod())
                .trackingNumber(order.getTrackingNumber())
                .orderDate(order.getOrderDate())
                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .build();
    }

    public static OrderResponse fromOrderWithDetails(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .fullName(order.getFullName())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .shippingAddress(order.getShippingAddress())
                .note(order.getNote())
                .totalPrice(order.getTotalPrice())
                .paymentMethod(order.getPaymentMethod())
                .shippingMethod(order.getShippingMethod())
                .trackingNumber(order.getTrackingNumber())
                .orderDate(order.getOrderDate())
                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .details(order.getOrderDetails().stream()
                        .map(OrderDetailResponse::fromOrderDetail)
                        .toList())
                .build();
    }
}
