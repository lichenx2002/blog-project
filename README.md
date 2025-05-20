# Blog Project

A full-stack blog application built with Next.js and Spring Boot.

## Project Structure

- `blogFrontend/`: Next.js frontend application
- `blogBackend/`: Spring Boot backend application

## Frontend (Next.js)

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Getting Started

```bash
cd blogFrontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Backend (Spring Boot)

### Prerequisites

- Java 17 or later
- Maven 3.x or later

### Getting Started

```bash
cd blogBackend
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

## Features

- User authentication
- Blog post creation and management
- Markdown support
- Responsive design
- RESTful API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# 博客系统部署指南

这是一个基于Docker的博客系统部署方案，包含Spring Boot后端和Next.js前端，并提供Portainer图形化管理界面。

## 系统要求

- Docker和Docker Compose
- 腾讯云服务器 (Linux系统)
- 至少2GB内存
- 端口: 3000 (前端), 8080 (后端), 9000 (Portainer)

## 快速部署

1. 克隆代码库到服务器

```bash
git clone <repository-url>
cd <repository-directory>
```

2. 构建后端项目

```bash
cd blogBackend
./mvnw clean package -DskipTests
cd ..
```

3. 启动所有服务

```bash
docker-compose up -d
```

4. 访问应用

- 博客前端: http://服务器IP:3000
- Portainer管理界面: http://服务器IP:9000

## Portainer使用说明

Portainer是一个轻量级的Docker图形化管理工具，提供以下功能：

- 容器管理 - 启动、停止、删除容器
- 图形化监控 - 查看容器资源使用情况
- 镜像管理 - 管理Docker镜像
- 日志查看 - 方便地查看应用日志

首次访问Portainer时，您需要创建管理员账户。

## 维护与更新

更新应用程序:

```bash
# 拉取最新代码
git pull

# 重新构建后端
cd blogBackend
./mvnw clean package -DskipTests
cd ..

# 重新构建并启动容器
docker-compose up -d --build
```

## 常见问题

- **无法访问应用**: 确保防火墙已开放3000、8080和9000端口
- **容器启动失败**: 检查docker-compose日志 `docker-compose logs`
- **存储问题**: 确保服务器有足够的磁盘空间 