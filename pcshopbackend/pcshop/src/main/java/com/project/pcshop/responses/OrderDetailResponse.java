package com.project.pcshop.responses;

import com.project.pcshop.models.OrderDetail;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailResponse {
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private Float price;
    private Integer quantity;
    private Float totalPrice;

    public static OrderDetailResponse fromOrderDetail(OrderDetail detail) {
        return OrderDetailResponse.builder()
                .id(detail.getId())
                .orderId(detail.getOrder().getId())
                .productId(detail.getProduct().getId())
                .productName(detail.getProductName())
                .price(detail.getPrice())
                .quantity(detail.getQuantity())
                .totalPrice(detail.getTotalPrice())
                .build();
    }
}
