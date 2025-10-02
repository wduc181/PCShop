package com.project.pcshop.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrandDTO {
    @NotBlank(message = "Brand's name can't be blank.")
    @Size(max = 100, message = "Max length of brand's name is 100.")
    private String name;

    private String description;

    @JsonProperty("logo_url")
    @NotNull(message = "Brand's logo is required.")
    private MultipartFile logoUrl;
}
