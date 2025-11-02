package com.project.pcshop.services;

import com.project.pcshop.dtos.BrandDTO;
import com.project.pcshop.models.entities.Brand;
import com.project.pcshop.repositories.BrandRepository;
import com.project.pcshop.services.interfaces.IBrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService implements IBrandService {

    private final BrandRepository brandRepository;

    @Override
    public Brand createBrand(BrandDTO brandDTO, String logoFileName) {
        if (brandDTO.getName() != null && brandRepository.existsByName(brandDTO.getName())) {
            throw new RuntimeException("Brand name already exists.");
        }

        Brand brand = Brand.builder()
                .name(brandDTO.getName())
                .description(brandDTO.getDescription())
                .logoUrl(logoFileName)
                .build();

        return brandRepository.save(brand);
    }

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Brand getBrandById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));
    }

    @Override
    public Brand updateBrand(Long id, BrandDTO brandDTO, String logoFileName) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));

        if (brandDTO.getName() != null && !brandDTO.getName().isBlank()) {
            String newName = brandDTO.getName().trim();
            if (!newName.equals(brand.getName()) && brandRepository.existsByName(newName)) {
                throw new RuntimeException("Another brand with this name already exists.");
            }
            brand.setName(newName);
        }

        // description
        if (brandDTO.getDescription() != null) {
            brand.setDescription(brandDTO.getDescription());
        }

        if (logoFileName != null) {
            brand.setLogoUrl(logoFileName);
        }
        return brandRepository.save(brand);
    }

    @Override
    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));
        brandRepository.delete(brand);
    }
}
