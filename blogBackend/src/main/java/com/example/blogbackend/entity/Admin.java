package com.example.blogbackend.entity;

public class Admin {
    private Integer id;
    private String username;
    private String password;
    private java.sql.Timestamp lastLogin;
    private java.sql.Timestamp createdAt;

    // getter 和 setter
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public java.sql.Timestamp getLastLogin() { return lastLogin; }
    public void setLastLogin(java.sql.Timestamp lastLogin) { this.lastLogin = lastLogin; }
    public java.sql.Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.sql.Timestamp createdAt) { this.createdAt = createdAt; }
}