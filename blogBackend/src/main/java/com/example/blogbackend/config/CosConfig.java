package com.example.blogbackend.config;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.region.Region;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CosConfig {
    @Value("${cos.secretId}")
    private String secretId;

    @Value("${cos.secretKey}")
    private String secretKey;

    @Value("${cos.region}")
    private String region;

    @Value("${cos.bucketName}")
    private String bucketName;

    @Value("${cos.url}")
    private String url;

    @Bean
    public COSClient cosClient() {
        // 创建 COS 凭证
        COSCredentials cred = new BasicCOSCredentials(secretId, secretKey);
        // 设置 bucket 的区域
        ClientConfig clientConfig = new ClientConfig(new Region(region));
        // 创建 COS 客户端
        return new COSClient(cred, clientConfig);
    }

    // Getter methods
    public String getSecretId() {
        return secretId;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public String getRegion() {
        return region;
    }

    public String getBucketName() {
        return bucketName;
    }

    public String getUrl() {
        return url;
    }
}