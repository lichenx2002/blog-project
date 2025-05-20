package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.Gallery;

import java.util.List;

/**
 * <p>
 * 相册表 服务类
 * </p>
 *
 * @author author
 * @since 2025-04-12
 */
public interface IGalleryService extends IService<Gallery> {
  List<Gallery> getAllGalleries();

  List<Gallery> getGalleriesByCategory(String category);

  List<String> getAllCategories();
}