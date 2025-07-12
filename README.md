# 代码编辑器演示（Code Editor Demo）

这是一个基于 React + Monaco Editor 的多文件、多目录结构代码编辑器演示项目。支持文件夹嵌套、文件内容编辑、主题切换、文件搜索等功能，适合用作在线代码演示、教学或二次开发。

## 特性

- 🗂️ 支持多级文件夹与文件树结构自动识别与渲染
- 📝 集成 Monaco Editor，体验媲美 VSCode 的代码编辑
- 🌗 支持明暗主题切换
- 🔍 支持文件名与内容搜索
- 🏷️ 支持多标签页浏览与编辑
- 🔒 支持只读与可编辑模式切换
- ⚡ 基于 React + TypeScript + TailwindCSS 构建，易于扩展

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. 安装依赖

```bash
pnpm install
# 或
npm install
# 或
yarn install
```

### 3. 启动开发环境

```bash
pnpm dev
# 或
npm run dev
# 或
yarn dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看效果。

## 目录结构

```
├── src/
│   ├── App.tsx                # 入口组件，文件树构建逻辑
│   ├── components/
│   │   ├── CodeEditor.tsx     # 编辑器主界面
│   │   ├── FileExplorer.tsx   # 文件/文件夹树组件
│   │   └── StatusBar.tsx      # 状态栏（可选）
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
└── ...
```

## 如何自定义文件结构

只需在 `src/App.tsx` 的 `fileMap` 中添加或修改文件路径和内容，支持多级目录（如 `src/utils/helper.ts`），会自动渲染为树状结构。

## 贡献

欢迎提 Issue 或 PR 参与贡献！

1. Fork 本仓库
2. 新建分支进行开发
3. 提交 PR 并描述你的更改

## License

MIT 