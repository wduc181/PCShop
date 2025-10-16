package com.project.pcshop.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDiscountDTO {
    @Min(value = 0, message = "invalid value")
    @Max(value = 100, message = "invalid value")
    private float discount;
}
