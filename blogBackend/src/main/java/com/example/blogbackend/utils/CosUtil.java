package com.example.blogbackend.utils;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.model.ObjectMetadata;
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.model.PutObjectResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Component
public class CosUtil {
  @Autowired
  private COSClient cosClient;

  @Value("${cos.bucketName}")
  private String bucketName;

  @Value("${cos.url}")
  private String url;

  /**
   * 上传文件到 COS
   * 
   * @param file 文件
   * @return 文件访问路径
   */
  public String uploadFile(MultipartFile file) throws IOException {
    // 生成文件名
    String originalFilename = file.getOriginalFilename();
    String fileName = UUID.randomUUID().toString() +
        originalFilename.substring(originalFilename.lastIndexOf("."));

    // 设置文件元数据
    ObjectMetadata metadata = new ObjectMetadata();
    metadata.setContentType(file.getContentType());
    metadata.setContentLength(file.getSize());

    // 创建上传请求
    PutObjectRequest putObjectRequest = new PutObjectRequest(
        bucketName,
        fileName,
        file.getInputStream(),
        metadata);

    // 上传文件
    PutObjectResult putObjectResult = cosClient.putObject(putObjectRequest);

    // 返回文件访问路径
    return url + "/" + fileName;
  }

  /**
   * 删除 COS 中的文件
   * 
   * @param fileUrl 文件访问路径
   */
  public void deleteFile(String fileUrl) {
    // 从文件 URL 中提取文件名
    String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    cosClient.deleteObject(bucketName, fileName);
  }
}