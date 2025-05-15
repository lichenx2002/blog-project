package com.example.blogbackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Value("${server.port:8000}")
    private String serverPort;

    public String storeFile(MultipartFile file) throws IOException {
        // 创建上传目录
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // 生成文件名
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + extension;

        // 保存文件
        Path targetLocation = Paths.get(uploadPath).resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation);

        // 返回完整的URL，注意这里不要加 /uploads/，因为 WebConfig 已经配置了映射
        return "http://localhost:" + serverPort + "/uploads/" + fileName;
    }
}