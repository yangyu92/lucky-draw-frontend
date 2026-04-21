# lucky-draw-frontend

年会抽奖系统前端，基于 Vue3 + Vite + Pinia

## 功能特性

- 🎯 抽奖大屏展示
- 👥 人员管理（添加、删除）
- 🎁 奖品管理（增删改查）
- 🏆 中奖记录查看与导出
- 📱 微信扫码签到

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认端口 3000）
npm run dev

# 类型检查
npm run type-check

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

开发服务器启动后访问 http://localhost:3000

API 请求默认代理到 `http://localhost:8080`，可通过环境变量 `VITE_API_URL` 修改：

```bash
VITE_API_URL=http://your-backend:8080 npm run dev
```

## Docker 部署

### 仅前端

```bash
# 构建镜像
docker build -t lucky-draw-frontend .

# 启动容器（映射宿主机 3000 端口）
docker run -d -p 3000:80 --name lucky-draw-fe lucky-draw-frontend
```

启动后访问 http://localhost:3000

### 前后端联合部署（docker-compose）

项目中 `nginx.conf` 将 `/api` 请求代理到 `http://backend:8080`，需要后端容器配合使用。创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    image: your-backend-image  # 替换为实际后端镜像
    ports:
      - "8080:8080"
```

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down
```

### 仅前端但后端在宿主机运行

如果后端直接运行在宿主机上（非 Docker），需要修改 `nginx.conf` 中的代理地址：

```nginx
proxy_pass http://host.docker.internal:8080;
```

然后重新构建镜像即可。

## 常用 Docker 命令

| 操作 | 命令 |
|------|------|
| 查看运行中的容器 | `docker ps` |
| 查看容器日志 | `docker logs lucky-draw-fe` |
| 停止容器 | `docker stop lucky-draw-fe` |
| 删除容器 | `docker rm lucky-draw-fe` |
| 重新构建并启动 | `docker build -t lucky-draw-frontend . && docker run -d -p 3000:80 --name lucky-draw-fe lucky-draw-frontend` |
