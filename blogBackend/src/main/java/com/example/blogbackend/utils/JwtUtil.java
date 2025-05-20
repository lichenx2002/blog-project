package com.example.blogbackend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

import java.security.Key;
import java.util.Date;

public class JwtUtil {
    // 使用 Base64 编码的密钥（至少32字节）
    private static final String SECRET = "c2VjcmV0X2tleV9mb3JfanNvbndlYnRva2VuX2F0X2xlYXN0XzMyX2J5dGVz";
    private static final Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET));

    public static String generateToken(Integer adminId, String username) {
        return Jwts.builder()
                .setSubject(username)
                .claim("adminId", adminId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1天
                .signWith(key)
                .compact();
    }

    public static Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token已过期", e);
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("Token格式不支持", e);
        } catch (MalformedJwtException e) {
            throw new RuntimeException("Token格式错误", e);
        } catch (SignatureException e) {
            throw new RuntimeException("Token签名无效", e);
        } catch (Exception e) {
            throw new RuntimeException("Token解析失败", e);
        }
    }
}