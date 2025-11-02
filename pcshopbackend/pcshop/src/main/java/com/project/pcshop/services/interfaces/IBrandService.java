package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.BrandDTO;
import com.project.pcshop.models.entities.Brand;

import java.util.List;

public interface IBrandService {
    Brand createBrand(BrandDTO brandDTO, String logoFileName);
    List<Brand> getAllBrands();
    Brand getBrandById(Long id);
    Brand updateBrand(Long id, BrandDTO brandDTO, String logoFileName);
    void deleteBrand(Long id);
}
