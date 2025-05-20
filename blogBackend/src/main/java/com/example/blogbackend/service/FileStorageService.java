package com.example.blogbackend.service;

import com.example.blogbackend.config.CosConfig;
import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.exception.CosClientException;
import com.qcloud.cos.model.ObjectMetadata;
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.region.Region;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Value("${server.port:8000}")
    private String serverPort;

    @Value("${file.upload.type:local}") // local 或 cos
    private String uploadType;

    @Autowired
    private CosConfig cosConfig;

    public String storeFile(MultipartFile file) throws IOException {
        if ("cos".equalsIgnoreCase(uploadType)) {
            return storeFileToCos(file);
        } else {
            return storeFileToLocal(file);
        }
    }

    // 本地存储
    private String storeFileToLocal(MultipartFile file) throws IOException {
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + extension;

        Path targetLocation = Paths.get(uploadPath).resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation);

        return "http://localhost:" + serverPort + "/uploads/" + fileName;
    }

    // 腾讯云 COS 存储
    private String storeFileToCos(MultipartFile file) throws IOException {
        COSCredentials cred = new BasicCOSCredentials(cosConfig.getSecretId(), cosConfig.getSecretKey());
        ClientConfig clientConfig = new ClientConfig(new Region(cosConfig.getRegion()));
        COSClient cosClient = new COSClient(cred, clientConfig);

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String key = "images/" + UUID.randomUUID().toString() + extension;

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            PutObjectRequest putObjectRequest = new PutObjectRequest(
                    cosConfig.getBucketName(),
                    key,
                    file.getInputStream(),
                    metadata);

            cosClient.putObject(putObjectRequest);

            // 生成访问URL
            String url = String.format("https://%s.cos.%s.myqcloud.com/%s",
                    cosConfig.getBucketName(),
                    cosConfig.getRegion(),
                    key);

            // 打印URL用于调试
            logger.info("File uploaded to COS. URL: {}", url);

            return url;
        } catch (CosClientException e) {
            logger.error("Failed to upload file to COS", e);
            throw new IOException("Failed to upload file to COS", e);
        } finally {
            cosClient.shutdown();
        }
    }
}