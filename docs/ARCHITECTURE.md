# 项目重构与文件结构说明

本次重构的目标是让 Taro + React H5 代码更容易理解、扩展和替换为真实后端。下面列出了核心目录和各自的职责。

## 目录指南

- `src/utils/taro.tsx`
  - 统一导出常用的 Taro 组件（View/Text/Image/ScrollView/Button），解决 React/Vue 双类型导致的类型提示冲突。
  - 之后在页面或组件里直接引入这些包装好的组件，无需再写 `as any`。

- `src/hooks/useAsyncRequest.ts`
  - 包装异步请求的通用 Hook，提供 `loading`、`error`、`data`、`refresh` 四个字段。
  - 页面只关注展示逻辑；未来接入真实接口时可以复用。

- `src/constants/home.ts`
  - 首页筛选项与分类映射表，UI 文案与内部分类 key 解耦。
  - 如需新增分类或性别入口，修改这里即可。

- `src/services/api.ts`
  - 集中管理模拟接口，并在函数上补充了用途注释，方便替换为真实 HTTP 调用。
  - 所有延迟都通过 `delay` 模拟，若切换到真实接口可直接移除。

- `src/services/geminiService.ts`
  - 对 Gemini 生成接口的轻量封装，保持 UI 调用签名稳定，日后迁移到服务端只需更换实现。

- `src/pages/home/`
  - `index.tsx`：页面主组件，拆分为 `HeroBanner` / `FilterPanel` / `HairstyleGrid` 三个部分，逻辑与渲染分离。
  - `index.config.ts`：Taro 页面配置（导航栏标题、背景色等）。每个页面建议同样放置一个 config 文件，方便独立调整页面级设置。

- `src/components/ui.tsx`
  - 常用按钮、标签、分段控件与导航栏的轻量实现，集中控制配色与圆角风格。

## 扩展建议

1. **接入真实接口**：在 `api.ts` 中替换对应方法的实现即可，`useAsyncRequest` 会自动接管 loading/error 状态。
2. **新增页面或版块**：直接使用 `src/utils/taro.tsx` 导出的组件和 Tailwind 工具类，保持样式一致。为新页面新增 `index.config.ts`，让样式和配置就近维护。
3. **复用布局**：将常用区块拆成独立小组件（如本次的 `HeroBanner`、`FilterPanel`），避免单文件过大。

希望这些改动能帮助你快速理解项目结构并自信地做二次开发。
