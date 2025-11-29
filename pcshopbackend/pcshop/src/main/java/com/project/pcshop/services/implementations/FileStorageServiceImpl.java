package com.project.pcshop.services.implementations;

import com.project.pcshop.exceptions.InvalidParamException;
import com.project.pcshop.services.interfaces.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    @Value("${app.upload.root-dir}")
    private String uploadRootDir;

    @Override
    public String storeImageFile(MultipartFile file, String subFolder) throws Exception {
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        if (!isImageFile(file) || fileName.contains("..")) {
            throw new InvalidParamException("Invalid file format. File must be image");
        }

        String uniqueFileName = UUID.randomUUID() + "_" + fileName;

        Path uploadPath = Paths.get(uploadRootDir, subFolder);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path destination = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        return uniqueFileName;
    }

    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    @Override
    public void deleteFile(String fileName, String subFolder) {
        if (fileName == null || fileName.isEmpty()) {
            return;
        }
        try {
            Path rootPath = Paths.get(uploadRootDir);
            Path filePath = rootPath.resolve(subFolder).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Warning: Cannot delete file: " + fileName + ". Error: " + e.getMessage());
        }
    }
}