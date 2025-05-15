package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.Gallery;
import com.example.blogbackend.mapper.GalleryMapper;
import com.example.blogbackend.service.IGalleryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 相册表 服务实现类
 * </p>
 *
 * @author author
 * @since 2025-04-12
 */
@Service
public class GalleryServiceImpl extends ServiceImpl<GalleryMapper, Gallery> implements IGalleryService {

  @Override
  public List<Gallery> getAllGalleries() {
    return list();
  }

  @Override
  public List<Gallery> getGalleriesByCategory(String category) {
    LambdaQueryWrapper<Gallery> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(Gallery::getCategory, category);
    return list(queryWrapper);
  }

  @Override
  public List<String> getAllCategories() {
    LambdaQueryWrapper<Gallery> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.select(Gallery::getCategory).groupBy(Gallery::getCategory);
    return list(queryWrapper).stream()
        .map(Gallery::getCategory)
        .collect(Collectors.toList());
  }
}