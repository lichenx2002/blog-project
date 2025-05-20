package com.example.blogbackend.controller;

import com.example.blogbackend.utils.CosUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {
  @Autowired
  private CosUtil cosUtil;

  @PostMapping("/upload")
  public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
    try {
      String fileUrl = cosUtil.uploadFile(file);
      Map<String, String> response = new HashMap<>();
      response.put("url", fileUrl);
      return ResponseEntity.ok(response);
    } catch (IOException e) {
      return ResponseEntity.badRequest().body("文件上传失败：" + e.getMessage());
    }
  }

  @DeleteMapping("/delete")
  public ResponseEntity<?> deleteFile(@RequestParam("fileUrl") String fileUrl) {
    try {
      cosUtil.deleteFile(fileUrl);
      return ResponseEntity.ok().body("文件删除成功");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("文件删除失败：" + e.getMessage());
    }
  }
}