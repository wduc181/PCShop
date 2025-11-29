package com.project.pcshop.services.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeImageFile(MultipartFile file, String subFolder) throws Exception;
    void deleteFile(String fileName, String subFolder);
}