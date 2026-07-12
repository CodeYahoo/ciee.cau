# 北斗智农 · 农机监控平台

面向演示的响应式智能农机监控 Web 应用。内置 20 台新疆示范农场仿真拖拉机，支持总览、车辆管理、轨迹回放与告警处理。

## 本地运行

```bash
pnpm install
pnpm dev
```

演示账号：`admin`，密码：`123456`。

## 高德地图

复制 `.env.example` 为 `.env.local`，填入：

```text
VITE_AMAP_KEY=高德 Web 端 Key
VITE_AMAP_SECURITY_CODE=安全密钥
```

未配置时自动使用可交互的课程演示地图，全部业务功能仍可使用。

## 扩展真实北斗数据

数据类型与 `TractorDataService` 接口位于 `src/types.ts`，当前仿真实现在 `src/data/mockService.ts`。后续可增加 HTTP 或 WebSocket 服务实现，并在 `src/App.tsx` 中替换实例。
