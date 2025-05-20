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
 * 留言板
 * </p>
 *
 * @author author
 * @since 2025-05-16
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("bulletinboard")
public class Bulletinboard implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 留言者姓名
     */
    private String name;

    /**
     * 留言者邮箱
     */
    private String email;

    /**
     * 性别
     */
    private String gender;

    /**
     * 留言内容
     */
    private String content;

    /**
     * 留言时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

    /**
     * 留言状态：待审核、已通过、已拒绝
     */
    private String status;

    /**
     * 管理员回复内容
     */
    private String reply;

    /**
     * 回复时间
     */
    private LocalDateTime replyTime;


}
