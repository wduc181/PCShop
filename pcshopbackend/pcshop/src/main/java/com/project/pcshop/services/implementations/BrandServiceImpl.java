package com.project.pcshop.services.implementations;

import com.fasterxml.jackson.core.type.TypeReference;
import com.project.pcshop.common.CacheConst;
import com.project.pcshop.dtos.brand.BrandDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.InvalidParamException;
import com.project.pcshop.entities.Brand;
import com.project.pcshop.repositories.BrandRepository;
import com.project.pcshop.responses.BrandResponse;
import com.project.pcshop.services.interfaces.BrandService;
import com.project.pcshop.services.interfaces.FileStorageService;
import com.project.pcshop.services.interfaces.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;
    private final FileStorageService fileStorageService;
    private final RedisService redisService;

    @Transactional
    @Override
    public BrandResponse createBrand(BrandDTO brandDTO) throws Exception {
        if (brandDTO.getName() != null && brandRepository.existsByName(brandDTO.getName())) {
            throw new InvalidParamException("Brand name already exists.");
        }

        String uniqueFileUrl = fileStorageService.storeImageFile(brandDTO.getLogoUrl(), "brands");
        try {
            Brand brand = Brand.builder()
                    .name(brandDTO.getName())
                    .description(brandDTO.getDescription())
                    .logoUrl(uniqueFileUrl)
                    .build();
            brandRepository.save(brand);
            redisService.delete(CacheConst.BRAND_ALL);
            return BrandResponse.fromBrand(brand);
        } catch (Exception e) {
            fileStorageService.deleteFile(uniqueFileUrl, "brands");
            throw e;
        }
    }

    @Override
    public List<BrandResponse> getAllBrands() {
        List<BrandResponse> cachedData = redisService.get(CacheConst.BRAND_ALL, new TypeReference<>() {});
        if (cachedData != null) {
            return cachedData;
        }
        List<BrandResponse> brandResponses = brandRepository.findAll().stream()
                .map(BrandResponse::fromBrand)
                .toList();
        redisService.setWithTimeout(CacheConst.BRAND_ALL, brandResponses, CacheConst.DEFAULT_TTL, TimeUnit.HOURS);
        return brandResponses;
    }

    @Transactional
    @Override
    public BrandResponse updateBrand(Long id, BrandDTO brandDTO) throws Exception {
        Brand existingBrand = brandRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Brand not found"));

        if (brandDTO.getName() != null && !brandDTO.getName().isBlank()) {
            String newName = brandDTO.getName().trim();
            if (!newName.equals(existingBrand.getName()) && brandRepository.existsByName(newName)) {
                throw new InvalidParamException("Brand name already exists");
            }
            existingBrand.setName(newName);
        }
        if (brandDTO.getDescription() != null) {
            existingBrand.setDescription(brandDTO.getDescription());
        }
        String oldLogoUrl = existingBrand.getLogoUrl();
        String newLogoFileName = null;
        if (brandDTO.getLogoUrl() != null && !brandDTO.getLogoUrl().isEmpty()) {
            newLogoFileName = fileStorageService.storeImageFile(brandDTO.getLogoUrl(), "brands");
            existingBrand.setLogoUrl(newLogoFileName);
        }

        try {
            brandRepository.save(existingBrand);
            if (newLogoFileName != null && oldLogoUrl != null) {
                fileStorageService.deleteFile(oldLogoUrl, "brands");
            }
            redisService.delete(CacheConst.BRAND_ALL);
            return BrandResponse.fromBrand(existingBrand);
        } catch (Exception e) {
            if (newLogoFileName != null) {
                fileStorageService.deleteFile(newLogoFileName, "brands");
            }
            throw e;
        }
    }

    @Transactional
    @Override
    public void deleteBrand(Long id) throws Exception {
        Brand existingBrand = brandRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Brand not found"));

        String logoUrl = existingBrand.getLogoUrl();
        brandRepository.delete(existingBrand);
        if (logoUrl != null) {
            fileStorageService.deleteFile(logoUrl, "brands");
        }
        redisService.delete(CacheConst.BRAND_ALL);
    }
}