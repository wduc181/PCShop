package com.project.pcshop.dtos.user;

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
public class UserUpdateDTO {
    @JsonProperty("fullname")
    @Size(max = 100, message = "Max length is 100.")
    private String fullname;

    private String address;

    @NotBlank(message = "Email is required.")
    @Size(max = 150, message = "Invalid email's length.")
    private String email;

    @JsonProperty("date_of_birth")
    private LocalDate dateOfBirth;
}
