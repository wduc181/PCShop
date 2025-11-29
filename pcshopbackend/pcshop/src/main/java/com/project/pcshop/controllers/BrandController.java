package com.project.pcshop.controllers;

import com.project.pcshop.common.ApiResponse;
import com.project.pcshop.dtos.brand.BrandDTO;
import com.project.pcshop.responses.BrandResponse;
import com.project.pcshop.services.interfaces.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/brands")
@RequiredArgsConstructor
public class BrandController {
    private final BrandService brandService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<BrandResponse>> createBrand(
            @Valid @ModelAttribute BrandDTO brandDTO
    ) throws Exception {
        BrandResponse brandResponse = brandService.createBrand(brandDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<BrandResponse>builder()
                .status(HttpStatus.CREATED)
                .message("Brand created successfully")
                .responseObject(brandResponse)
                .build()
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAllBrands() {
        List<BrandResponse> brandResponses = brandService.getAllBrands();

        return ResponseEntity.ok().body(ApiResponse.<List<BrandResponse>>builder()
                .status(HttpStatus.OK)
                .message("Got brands list successfully")
                .responseObject(brandResponses)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<BrandResponse>> updateBrand(
            @PathVariable Long id,
            @Valid @ModelAttribute BrandDTO brandDTO
    ) throws Exception {
        BrandResponse brandResponse = brandService.updateBrand(id, brandDTO);

        return ResponseEntity.ok().body(ApiResponse.<BrandResponse>builder()
                .status(HttpStatus.OK)
                .message("Updated brand successfully")
                .responseObject(brandResponse)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) throws Exception {
        brandService.deleteBrand(id);

        return ResponseEntity.ok().body(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .message("Deleted brand successfully")
                .responseObject(null)
                .build()
        );
    }
}