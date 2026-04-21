# lucky-draw-frontend

年会抽奖系统前端，基于 Vue3 + Vite + Pinia

## 功能特性

- 🎯 抽奖大屏展示
- 👥 人员管理（添加、删除）
- 🎁 奖品管理（增删改查）
- 🏆 中奖记录查看与导出
- 📱 微信扫码签到

## 安装运行

```bash
npm install
npm run dev
npm run build
```

## Docker部署

```bash
docker build -t lucky-draw-frontend .
docker run -d -p 3000:80 lucky-draw-frontend
```
