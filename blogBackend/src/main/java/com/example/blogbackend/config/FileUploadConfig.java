// src/main/java/com/example/blogbackend/config/FileUploadConfig.java
package com.example.blogbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

@Configuration
public class FileUploadConfig {
    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Value("${file.upload.type:local}")  // 新增：上传类型，local 或 cos
    private String uploadType;

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

    public String getUploadPath() {
        return uploadPath;
    }

    public String getUploadType() {
        return uploadType;
    }
}