FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/blogBackend-0.0.1-SNAPSHOT.jar app.jar

# 创建上传目录
RUN mkdir -p /app/uploads
VOLUME /app/uploads

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"] 