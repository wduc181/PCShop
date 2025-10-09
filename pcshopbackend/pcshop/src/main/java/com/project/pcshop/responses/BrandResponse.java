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
    private Long id;
    private String name;
    private String description;
    private String logoUrl;

    // Convert từ Brand entity sang BrandResponse DTO
    public static BrandResponse fromBrand(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .logoUrl(brand.getLogoUrl())
                .build();
    }
}
