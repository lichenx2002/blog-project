package com.example.blogbackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.example.blogbackend.mapper")
@SpringBootApplication
public class BlogBackendApplication {

    public static void main(String[] args) {
        try {
            // 尝试加载 .env 文件
            Dotenv dotenv = Dotenv.configure()
                    .directory(".")
                    .ignoreIfMissing() // 如果文件不存在则忽略
                    .load();

            // 设置环境变量
            dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        } catch (Exception e) {
            // 如果加载失败，使用默认值
            System.out.println("Warning: .env file not found, using default values");
        }

        SpringApplication.run(BlogBackendApplication.class, args);
    }

}
