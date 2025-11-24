package com.project.pcshop.dtos.order;

import com.project.pcshop.models.enums.OrderStatus;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateStatusDTO {
    private OrderStatus status;
}