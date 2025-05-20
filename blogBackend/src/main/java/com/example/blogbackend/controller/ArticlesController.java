package com.example.blogbackend.controller;

import com.example.blogbackend.entity.Articles;
import com.example.blogbackend.service.IArticlesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.blogbackend.dto.ArticleDTO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/articles")
public class ArticlesController {
    private static final Logger logger = LoggerFactory.getLogger(ArticlesController.class);
    private final IArticlesService iarticlesService;

    public ArticlesController(IArticlesService iarticlesService) {
        this.iarticlesService = iarticlesService;
    }

        @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        logger.info("Getting articles with page={}, pageSize={}", page, pageSize);

        Page<Articles> articlesPage = iarticlesService.listWithTags(page, pageSize);

        Map<String, Object> response = new HashMap<>();
        response.put("data", articlesPage.getRecords());
        response.put("total", articlesPage.getTotal());
        response.put("page", page);
        response.put("pageSize", pageSize);

        logger.info("Response data: {}", response);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createArticle(@RequestBody ArticleDTO articleDTO) {
        // 1. 保存文章和标签关联
        Articles article = iarticlesService.saveArticleWithTags(articleDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(article);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Articles> getArticleById(
            @PathVariable Integer id,
            @RequestParam(required = false, defaultValue = "false") boolean like) {
        Articles article = iarticlesService.getById(id);
        if (article == null) {
            return ResponseEntity.notFound().build();
        }

        // 如果需要点赞，增加点赞数
        if (like) {
            article.setLikeCount(article.getLikeCount() + 1);
            iarticlesService.updateById(article);
        }

        return ResponseEntity.ok(article);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(
            @PathVariable Integer id,
            @RequestBody ArticleDTO articleDTO) {
        articleDTO.setId(id);
        boolean success = iarticlesService.updateArticleWithTags(articleDTO);
        if (!success) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Integer id) {
        boolean success = iarticlesService.removeById(id);
        if (!success) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Articles> likeArticle(@PathVariable Integer id) {
        try {
            Integer newLikeCount = iarticlesService.likeArticle(id);
            Articles article = iarticlesService.getById(id);
            return ResponseEntity.ok(article);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}