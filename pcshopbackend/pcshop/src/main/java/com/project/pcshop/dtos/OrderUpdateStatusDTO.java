package com.project.pcshop.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.pcshop.models.enums.OrderStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateStatusDTO {
    private OrderStatus status;
}