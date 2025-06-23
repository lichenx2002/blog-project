package com.example.blogbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 允许的域名
        config.addAllowedOriginPattern("http://localhost:3000");
        config.addAllowedOriginPattern("http://localhost:5173");
        config.addAllowedOriginPattern("http://124.222.96.94:3000");
        config.addAllowedOriginPattern("http://124.222.96.94");
        config.addAllowedOriginPattern("https://www.gfbzsblog.site");
        config.addAllowedOriginPattern("https://gfbzsblog.site");

        // 允许的请求方法
        config.addAllowedMethod("*");

        // 允许的请求头
        config.addAllowedHeader("*");

        // 允许携带认证信息
        config.setAllowCredentials(true);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}