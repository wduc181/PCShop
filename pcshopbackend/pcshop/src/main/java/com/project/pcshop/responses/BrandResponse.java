package com.project.pcshop.responses;

import com.project.pcshop.models.Brand;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandResponse {
    private String name;
    private String description;
    private String logoUrl;

    // Convert từ Brand entity sang BrandResponse DTO
    public static BrandResponse fromBrand(Brand brand) {
        return BrandResponse.builder()
                .name(brand.getName())
                .description(brand.getDescription())
                .logoUrl(brand.getLogoUrl())
                .build();
    }
}
