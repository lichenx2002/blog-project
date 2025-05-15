package com.example.blogbackend.utils;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtHelper {
  private static final long tokenExpiration = 24 * 60 * 60 * 1000; // 24小时
  private static final String tokenSignKey = "123456"; // 签名密钥

  public String createToken(Long userId) {
    String token = Jwts.builder()
        .setSubject("USER-" + userId)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + tokenExpiration))
        .signWith(SignatureAlgorithm.HS512, tokenSignKey)
        .compressWith(CompressionCodecs.GZIP)
        .compact();
    return token;
  }

  public Long getUserId(String token) {
    try {
      if (token == null)
        return null;
      Jws<Claims> claimsJws = Jwts.parser().setSigningKey(tokenSignKey).parseClaimsJws(token);
      Claims claims = claimsJws.getBody();
      String subject = claims.getSubject();
      return Long.parseLong(subject.split("-")[1]);
    } catch (Exception e) {
      return null;
    }
  }

  public boolean isExpiration(String token) {
    try {
      boolean isExpire = Jwts.parser()
          .setSigningKey(tokenSignKey)
          .parseClaimsJws(token)
          .getBody()
          .getExpiration()
          .before(new Date());
      return isExpire;
    } catch (Exception e) {
      return true;
    }
  }
}