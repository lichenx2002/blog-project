package com.example.blogbackend.service.impl;

import com.example.blogbackend.entity.Thoughts;
import com.example.blogbackend.mapper.ThoughtsMapper;
import com.example.blogbackend.service.IThoughtsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户思考记录表 服务实现类
 * </p>
 *
 * @author author
 * @since 2025-05-14
 */
@Service
public class ThoughtsServiceImpl extends ServiceImpl<ThoughtsMapper, Thoughts> implements IThoughtsService {

}
