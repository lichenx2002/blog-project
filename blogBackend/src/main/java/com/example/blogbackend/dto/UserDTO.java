package com.example.blogbackend.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String username;
    private String password;
    private String phone;
    private String loginType;
}
