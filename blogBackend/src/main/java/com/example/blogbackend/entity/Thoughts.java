package com.example.blogbackend.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 用户思考记录表
 * </p>
 *
 * @author author
 * @since 2025-05-14
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("thoughts")
public class Thoughts implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 思考内容
     */
    private String content;

    /**
     * 记录时心情
     */
    private String mood;

    /**
     * 记录地点
     */
    private String location;

    /**
     * 标签数组["灵感","技术"]
     */
    private String tags;

    private LocalDateTime createdAt;

    private String weather;

    private String device;

}
