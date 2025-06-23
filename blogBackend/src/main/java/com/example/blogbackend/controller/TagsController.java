package com.example.blogbackend.controller;

import com.example.blogbackend.entity.Articles;
import com.example.blogbackend.entity.Tags;
import com.example.blogbackend.service.ITagsService;
import com.example.blogbackend.dto.TagWithCountDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 标签表 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-04-12
 */
@RestController
@RequestMapping("/tags")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class TagsController {

    private final ITagsService tagsService;

    public TagsController(ITagsService tagsService) {
        this.tagsService = tagsService;
    }

    @GetMapping("/list")
    public List<Tags> listTags() {
        return tagsService.list();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tags> getTagById(@PathVariable Integer id) {
        Tags tag = tagsService.getById(id);
        if (tag == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tag);
    }

    @GetMapping("/{id}/articles")
    public ResponseEntity<List<Articles>> getArticlesByTagId(@PathVariable Integer id) {
        List<Articles> articles = tagsService.getArticlesByTagId(id);
        return ResponseEntity.ok(articles);
    }

    @PostMapping
    public ResponseEntity<?> createTag(@RequestBody Tags tag) {
        if (tag == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "请求体不能为空"));
        }

        if (tag.getName() == null || tag.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "标签名称不能为空"));
        }

        if (tag.getColor() == null || tag.getColor().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "标签颜色不能为空"));
        }

        // 检查标签名是否已存在
        if (tagsService.lambdaQuery().eq(Tags::getName, tag.getName()).exists()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "标签名称已存在"));
        }

        try {
            // 生成 slug
            tag.generateSlug();
            tagsService.save(tag);
            return ResponseEntity.ok(tag);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "保存标签失败: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTag(@PathVariable Integer id, @RequestBody Tags tag) {
        tag.setId(id);
        boolean success = tagsService.updateById(tag);
        if (!success) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTag(@PathVariable Integer id) {
        // 检查标签是否存在
        Tags tag = tagsService.getById(id);
        if (tag == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "标签不存在"));
        }

        // 检查标签是否被使用
        List<Articles> articles = tagsService.getArticlesByTagId(id);
        if (!articles.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "该标签正在被使用，无法删除"));
        }

        try {
            boolean success = tagsService.removeById(id);
            if (!success) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Bad Request",
                        "message", "删除标签失败"));
            }
            return ResponseEntity.ok(Map.of(
                    "message", "删除成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "删除标签失败: " + e.getMessage()));
        }
    }

    @GetMapping("/withCount")
    public List<TagWithCountDTO> getTagsWithCount() {
        return tagsService.getAllTagsWithCount();
    }
}