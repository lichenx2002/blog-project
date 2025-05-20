package com.example.blogbackend.service.impl;

import com.example.blogbackend.entity.Admin;
import com.example.blogbackend.mapper.AdminMapper;
import com.example.blogbackend.service.IAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements IAdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public Admin findByUsername(String username) {
        return adminMapper.findByUsername(username);
    }
}