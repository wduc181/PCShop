package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.brand.BrandDTO;
import com.project.pcshop.responses.BrandResponse;

import java.util.List;

public interface BrandService {
    BrandResponse createBrand(BrandDTO brandDTO) throws Exception;
    List<BrandResponse> getAllBrands();
    BrandResponse updateBrand(Long id, BrandDTO brandDTO) throws Exception;
    void deleteBrand(Long id) throws Exception;
}
