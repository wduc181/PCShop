package com.project.pcshop.dtos.authentication;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticateRegisterDTO {
    @JsonProperty("fullname")
    @Size(max = 100, message = "Max length is 100.")
    private String fullname;

    @JsonProperty("phone_number")
    @NotBlank(message = "Phone number can't be empty.")
    @Size(min = 5, max = 15, message = "Invalid phone number's length.")
    private String phoneNumber;

    private String address;

    @NotBlank(message = "Password is required.")
    private String password;

    @JsonProperty("confirm_password")
    private String confirmPassword;

    @NotBlank(message = "Email is required.")
    @Size(max = 150, message = "Invalid email's length.")
    private String email;

    @JsonProperty("date_of_birth")
    private LocalDate dateOfBirth;

    @JsonProperty("role_id")
    private Long roleId;
}
