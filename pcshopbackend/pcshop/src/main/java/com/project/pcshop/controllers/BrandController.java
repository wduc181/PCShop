package com.project.pcshop.controllers;

import com.project.pcshop.dtos.BrandDTO;
import com.project.pcshop.models.Brand;
import com.project.pcshop.responses.BrandResponse;
import com.project.pcshop.services.interfaces.IBrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("${api.prefix}/brands")
@RequiredArgsConstructor
public class BrandController {  
    private final IBrandService brandService;

    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    private String storeLogoImage(MultipartFile file) throws IOException {
        if (!isImageFile(file) || file.getOriginalFilename() == null) {
            throw new IOException("Invalid image format.");
        }

        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String uniqueFilename = UUID.randomUUID() + "_" + filename;

        Path uploadDir = Paths.get("uploads/brands");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        Path destination = uploadDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        return uniqueFilename;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createBrand(@Valid @ModelAttribute BrandDTO brandDTO) {
        try {
            if (brandDTO.getName() == null || brandDTO.getName().isEmpty()) {
                return ResponseEntity.badRequest().body("Brand name is required.");
            }
            if (brandDTO.getLogoUrl() == null) {
                return ResponseEntity.badRequest().body("Brand logo is required.");
            }

            MultipartFile logo = brandDTO.getLogoUrl();
            if (!isImageFile(logo)) {
                return ResponseEntity.badRequest().body("Invalid logo, must be an image file.");
            }
            if (logo.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                        .body("File is too large! Maximum size is 10MB.");
            }

            String storedFileName = storeLogoImage(logo);
            Brand savedBrand = brandService.createBrand(brandDTO, storedFileName);
            BrandResponse brandResponse = BrandResponse.fromBrand(savedBrand);
            return ResponseEntity.ok(brandResponse);
        } catch (Exception e) {
            return  ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<List<BrandResponse>> getAllBrands() {
        List<Brand> allBrands = brandService.getAllBrands();
        List<BrandResponse> brandResponses = allBrands.stream()
                .map(BrandResponse::fromBrand)
                .toList();
        return ResponseEntity.ok(brandResponses);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBrand(@PathVariable Long id,
                                         @ModelAttribute BrandDTO brandDTO) {
        try {
            String storedFileName = null;
            if (brandDTO.getLogoUrl() != null) {
                MultipartFile logo = brandDTO.getLogoUrl();
                if (!isImageFile(logo)) {
                    return ResponseEntity.badRequest().body("Invalid logo, must be an image file.");
                }
                if (logo.getSize() > 10 * 1024 * 1024) {
                    return ResponseEntity.badRequest().body("File is too large! Maximum size is 10MB.");
                }
                storedFileName = storeLogoImage(logo);
            }

            Brand updatedBrand = brandService.updateBrand(id, brandDTO, storedFileName);
            BrandResponse brandResponse = BrandResponse.fromBrand(updatedBrand);
            return ResponseEntity.ok(brandResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok("Deleted brand successfully.");
    }
}
