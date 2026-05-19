# 🌲 兽予心晴 - 心灵疗愈森林

> 你的心理健康伴侣，在温暖陪伴中梳理情绪。

一个面向移动端体验的情绪疗愈 Web 应用。  
通过情绪打卡、陪伴式对话、呼吸练习和心理知识内容，帮助用户在日常中获得稳定、轻量的心理支持。

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [Roadmap](#roadmap)
- [截图区](#截图区)
- [部署说明](#部署说明)
- [版本记录](#版本记录)
- [待办清单](#待办清单)
- [常见问题](#常见问题)
- [许可证](#许可证)

## 功能特性

- 🌿 **情绪记录**：每日情绪打卡，观察长期波动趋势
- 💬 **陪伴对话**：与森林守护动物聊天，获得情绪支持
- 🧘 **呼吸练习**：内置 4-7-8 节奏呼吸，帮助放松
- 📚 **心理知识**：提供轻阅读心理科普与应对技巧
- 🌳 **成长可视化**：森林视图展示情绪与成长轨迹

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 开发与构建工具 |
| Tailwind CSS | 样式系统 |
| Zustand | 状态管理 |
| Framer Motion | 动画与交互 |

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 本地运行

```bash
# 1) 安装依赖
npm install

# 2) 启动开发环境
npm run dev

# 3) 打包生产版本
npm run build

# 4) 本地预览生产包（可选）
npm run preview
```

运行后在终端查看 Vite 输出地址（通常是 `http://localhost:5173`）。

## 项目结构

```text
森林/
├── src/
│   ├── components/    # 通用 UI 组件
│   ├── pages/         # 页面级组件
│   ├── store/         # 状态管理
│   ├── types/         # TypeScript 类型定义
│   └── utils/         # 工具函数
├── public/            # 静态资源（如有）
├── index.html
├── package.json
└── README.md
```

## Roadmap

### 阶段 0：工程与协作基线（已完成）

- [x] 统一 Node 版本约束（可追踪并可复现）
- [x] 完善 `.gitignore`（覆盖产物、缓存与敏感文件）
- [x] 提供 `.env.example`，新增环境变量有注释说明
- [x] 新成员拉取后可完成安装并成功启动

### 阶段 1：Supabase 项目与数据模型（迁移文件已就绪）

- [ ] 创建 Supabase 项目并完成基础配置
- [ ] 执行迁移脚本，核心表结构可用
- [ ] 配置并验证 RLS 策略（越权访问被拦截）
- [ ] 配置 Storage bucket 与读写策略
- [ ] 完成一轮数据层联调（含典型查询与写入）

### 阶段 2：前端接入 Supabase（已完成）

- [x] 安装 Supabase SDK 并通过构建
- [x] 完成 `src/lib/supabase.ts` 客户端初始化
- [x] 环境变量接线完成且无密钥硬编码
- [x] 本地可发起基础查询并返回结果

### 阶段 3：按模块替换 Mock（进行中）

- [ ] 工坊模块替换 Mock（列表/详情/创建）
- [ ] Talk 模块替换 Mock（会话列表/消息发送/历史读取）
- [ ] 市集模块替换 Mock（商品/筛选/详情）
- [ ] 发布模块替换 Mock（创建发布流）
- [ ] 清理或隔离遗留 Mock 入口
- [ ] 关键流程端到端联调通过

#### 阶段 3：7 天可执行计划

**Day 1：准备与盘点**
- [ ] 梳理工坊/Talk/市集/发布四个模块的 Mock 入口清单
- [ ] 标注每个接口对应的数据表、字段与权限要求
- [ ] 建立替换顺序与风险清单（高风险接口优先验证）

**Day 2：工坊模块替换**
- [ ] 完成工坊列表 `select` 替换与分页联调
- [ ] 完成工坊详情读取与错误兜底
- [ ] 完成工坊创建 `insert` 与成功/失败反馈

**Day 3：Talk 模块替换**
- [ ] 完成会话列表读取与排序规则对齐
- [ ] 完成消息发送 `insert` 与输入校验
- [ ] 完成历史消息读取与滚动加载验证

**Day 4：市集模块替换**
- [ ] 完成商品列表读取与筛选参数映射
- [ ] 完成商品详情读取与缺省字段处理
- [ ] 完成市集模块空态/失败态联调

**Day 5：发布模块替换**
- [ ] 完成发布创建流（表单 -> 写入 -> 跳转）
- [ ] 完成图片上传链路（Storage）联调
- [ ] 完成发布记录回读与状态展示

**Day 6：清理与回归**
- [ ] 清理遗留 Mock 代码或移动到明确隔离目录
- [ ] 统一数据请求错误处理与日志输出
- [ ] 进行跨模块回归（工坊 -> Talk -> 市集 -> 发布）

**Day 7：验收与收口**
- [ ] 执行阶段 3 验收清单并逐项勾选
- [ ] 修复回归问题并补充缺失边界处理
- [ ] 输出阶段总结（完成项、风险项、下阶段输入）

#### 阶段 3：每日提交模板（commit + 验收命令）

> 可直接复制使用；`<scope>` 可替换为 `workshop` / `talk` / `market` / `publish`。

**Day 1（准备与盘点）**
- 建议 commit：
  - `chore(plan): inventory mock endpoints and supabase mapping`
- 建议验收命令：
```bash
npm run dev
npm run build
```

**Day 2（工坊模块）**
- 建议 commit：
  - `feat(workshop): replace mock list/detail/create with supabase queries`
- 建议验收命令：
```bash
npm run dev
npm run build
# 手工验收：工坊列表/详情/创建流程
```

**Day 3（Talk 模块）**
- 建议 commit：
  - `feat(talk): migrate sessions and messages from mock to supabase`
- 建议验收命令：
```bash
npm run dev
npm run build
# 手工验收：会话列表、发送消息、历史加载
```

**Day 4（市集模块）**
- 建议 commit：
  - `feat(market): connect product list/filter/detail to supabase`
- 建议验收命令：
```bash
npm run dev
npm run build
# 手工验收：商品列表、筛选、详情与空态
```

**Day 5（发布模块）**
- 建议 commit：
  - `feat(publish): replace mock publish flow and wire storage upload`
- 建议验收命令：
```bash
npm run dev
npm run build
# 手工验收：发布创建、图片上传、发布后回读
```

**Day 6（清理与回归）**
- 建议 commit：
  - `refactor(data): remove legacy mock entries and unify error handling`
- 建议验收命令：
```bash
npm run dev
npm run build
# 手工回归：工坊 -> Talk -> 市集 -> 发布 全链路
```

**Day 7（验收与收口）**
- 建议 commit：
  - `chore(release): finalize phase-3 acceptance checklist and fixes`
- 建议验收命令：
```bash
npm run build
npm run preview
# 手工验收：按阶段 3 清单逐项确认并记录结果
```

### 阶段 4：体验与质量

- [ ] 统一加载态、空态、失败态设计与实现
- [ ] 增加 Toast / 结果反馈与失败重试
- [ ] 完成关键页面可访问性优化（语义化与键盘可达）
- [ ] 制定图片策略（尺寸限制、压缩、兜底图）
- [ ] 补充常见错误场景的提示文案与恢复路径

### 阶段 5：构建与上线

- [ ] 完成预发环境部署与回归验证
- [ ] 配置托管环境变量并完成校验
- [ ] 建立可选 CI（构建 + 基础检查）
- [ ] 配置 Supabase 监控与错误定位链路
- [ ] 准备上线回滚方案与发布检查清单

## 截图区

> 当前为占位路径，请将实际截图放到 `docs/screenshots/` 目录。

### 首页

![首页](./docs/screenshots/home.png)

### 对话页

![对话页](./docs/screenshots/chat.png)

### 森林页

![森林页](./docs/screenshots/forest.png)

### 学习页

![学习页](./docs/screenshots/learn.png)

## 部署说明

该项目为标准前端静态构建产物（`dist/`），可部署到任意静态托管服务。

### 方案 A：Vercel

1. 导入 Git 仓库
2. Framework Preset 选择 `Vite`
3. Build Command：`npm run build`
4. Output Directory：`dist`
5. 点击 Deploy

### 方案 B：Netlify

1. 新建站点并连接仓库
2. Build command：`npm run build`
3. Publish directory：`dist`
4. 部署完成后获取访问链接

### 方案 C：GitHub Pages

可使用 GitHub Actions 自动构建并发布 `dist/` 到 Pages 分支。  
若需要，我可以为你补一份可直接使用的工作流文件。

## 版本记录

### v0.3.1 - 2026-03-24

- 将 `Roadmap` 升级为可勾选进度表（按阶段 3-5 条）
- 细化阶段 1-5 的执行项，便于日常推进与追踪

### v0.3.0 - 2026-03-24

- 新增 `Roadmap` 小节，按阶段给出目标与验收标准
- 将 Supabase 接入流程拆分为 0-5 阶段，便于迭代追踪

### v0.2.0 - 2026-03-24

- 完善 README：新增截图区、部署说明、版本记录、待办清单、FAQ
- 修正本地预览说明为 Vite 常用端口和命令
- 补充环境要求和项目目录说明

### v0.1.0 - 2026-03-24

- 初始化项目结构
- 完成核心页面与基础交互

## 待办清单

- [ ] 接入真实 AI 对话接口，替换模拟回复
- [ ] 增加数据持久化（本地存储/后端 API）
- [ ] 优化移动端可访问性（键盘操作、ARIA 标签）
- [ ] 补充单元测试与关键交互测试
- [ ] 增加夜间模式和主题切换
- [ ] 补充错误边界与异常提示
- [ ] 将截图占位图替换为真实 UI 截图

## 常见问题

### Q1：为什么启动后地址不是 3000？

Vite 默认端口通常为 `5173`。如果占用会自动切换到下一个可用端口，以终端输出为准。

### Q2：截图为什么显示不出来？

README 中截图路径是占位路径，请在项目内创建 `docs/screenshots/` 并放入同名图片。

### Q3：可以直接用于生产环境吗？

当前更适合作为原型与迭代基础。上线前建议补充鉴权、安全策略、日志和测试。

## 许可证

MIT
