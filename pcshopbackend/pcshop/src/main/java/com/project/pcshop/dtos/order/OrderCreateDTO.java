package com.project.pcshop.dtos.order;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.pcshop.entities.enums.OrderStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateDTO {
    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("full_name")
    private String fullName;

    @Size(max = 150, message = "Email is too long")
    private String email;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("shipping_address")
    @Size(max = 200, message = "Max length is 200")
    private String shippingAddress;

    @Size(max = 500, message = "Your note is too long")
    private String note;

    private OrderStatus status;

    @JsonProperty("total_price")
    @NotNull(message = "Price can't be null")
    @Min(value = 0, message = "invalid price")
    private float totalPrice;

    @JsonProperty("payment_method")
    @Size(max = 100, message = "invalid length")
    private String paymentMethod;

    @JsonProperty("shipping_method")
    @Size(max = 100, message = "invalid length")
    private String shippingMethod;
}