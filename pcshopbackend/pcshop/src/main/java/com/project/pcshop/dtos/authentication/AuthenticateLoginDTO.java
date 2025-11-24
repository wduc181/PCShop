package com.project.pcshop.dtos.authentication;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticateLoginDTO {
    @JsonProperty("phone_number")
    @NotBlank(message = "Invalid phone number.")
    private String phoneNumber;

    @NotBlank(message = "Password is required.")
    private String password;
}
