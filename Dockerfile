FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# 如果 node 镜像拉取超时，可以先在本地 npm run build，然后用以下命令构建：
# docker build -f Dockerfile.nginx -t lucky-draw-frontend .
