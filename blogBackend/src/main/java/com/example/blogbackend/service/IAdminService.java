package com.example.blogbackend.service;
import com.example.blogbackend.entity.Admin;

public interface IAdminService {
    Admin findByUsername(String username);
}
