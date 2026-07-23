# 游戏攻略笔记

一个面向各类游戏玩家的攻略分享与游戏百科平台。

## 技术栈

- **前端框架**: Next.js 14
- **UI样式**: TailwindCSS 3
- **富文本编辑器**: TipTap
- **数据库**: Supabase PostgreSQL
- **文件存储**: Supabase Storage
- **认证系统**: Supabase Auth
- **部署平台**: Vercel

## 功能特性

### 用户系统
- 用户注册/登录
- 管理员登录

### 攻略浏览
- 首页展示热门攻略、最新攻略
- 攻略列表按游戏/类型分类浏览
- 攻略详情查看（图文混排）
- 搜索功能
- 点赞和收藏功能

### 攻略管理（管理员）
- 发布攻略（富文本编辑器）
- 编辑攻略
- 删除攻略
- 图片上传

### 游戏百科（管理员）
- 游戏列表管理
- 添加/修改/删除游戏
- 游戏资料管理（角色、装备、地图等）

---

## 🚀 完整部署指南

### 第一步：创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com/)，注册账号并登录
2. 点击 **New Project** 创建新项目
3. 填写项目信息：
   - **Project Name**: 游戏攻略笔记
   - **Database Password**: 设置一个安全的密码（记住它！）
   - **Region**: 选择离你最近的区域（如 Asia Pacific (Singapore)）
4. 点击 **Create new project**，等待项目创建完成（约1分钟）

### 第二步：获取 Supabase 密钥

1. 在 Supabase 项目控制台，点击左侧菜单的 **Settings**
2. 点击 **API** 选项卡
3. 复制以下两个值（后面会用到）：
   - **URL** (格式: `https://xxxx.supabase.co`)
   - **anon key** (格式: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 第三步：配置数据库表

1. 在 Supabase 控制台，点击左侧菜单的 **SQL Editor**
2. 点击 **New query**
3. 将 `supabase/schema.sql` 文件中的所有内容复制粘贴到编辑器中
4. 点击 **Run** 执行 SQL
5. 确认所有表创建成功（应该显示 "Success"）

### 第四步：创建存储桶

1. 在 Supabase 控制台，点击左侧菜单的 **Storage**
2. 点击 **New bucket**
3. 填写：
   - **Name**: `images`
   - **Public access**: 勾选（保持公开）
4. 点击 **Create bucket**

5. 设置存储桶公开策略：
   - 点击 `images` 存储桶右侧的 **Settings**
   - 在 **Public access** 部分，点击 **Add policy**
   - 选择 **Allow public access** 模板
   - 点击 **Use this template**
   - 点击 **Save policy**

### 第五步：配置认证

1. 在 Supabase 控制台，点击左侧菜单的 **Authentication**
2. 点击 **Providers** 选项卡
3. 找到 **Email**，确保 **Enable email provider** 已开启
4. 关闭 **Confirm email**（方便测试，生产环境建议开启）

### 第六步：配置本地环境

1. 打开项目目录中的 `.env.local` 文件
2. 将第二步获取的密钥填入：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase anon key
```

### 第七步：安装依赖

**注意：如果遇到 npm 缓存权限问题，请执行以下步骤：**

1. 打开命令提示符（CMD）或 PowerShell（建议以管理员身份运行）
2. 进入项目目录：
```bash
cd d:\Resoult\Wind\development\week2
```

3. 执行安装命令：
```bash
npm install
```

**如果仍然遇到权限问题：**

```bash
# 设置自定义缓存目录（Windows）
npm config set cache "d:\Resoult\Wind\development\week2\.npm-cache" --global

# 然后重新安装
npm install
```

### 第八步：启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 第九步：部署到 Vercel

#### 方式一：使用 GitHub（推荐）

1. 在 GitHub 上创建一个新仓库
2. 将项目代码推送到 GitHub：

```bash
# 初始化 git（如果还没有）
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

3. 访问 [Vercel 官网](https://vercel.com/)，用 GitHub 账号登录
4. 点击 **Add New...** → **Project**
5. 找到你的仓库，点击 **Import**
6. 在 **Environment Variables** 中添加：
   - `NEXT_PUBLIC_SUPABASE_URL` → 你的 Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → 你的 Supabase anon key
7. 点击 **Deploy** 开始部署
8. 部署完成后，Vercel 会生成一个访问链接（如 `https://your-project.vercel.app`）

#### 方式二：使用 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

3. 在项目目录中运行：
```bash
vercel
```

4. 按照提示完成配置，Vercel 会自动部署

### 第十步：测试应用

1. 打开部署后的链接
2. 点击右上角的 **登录** 按钮
3. 注册一个新账号（使用有效的邮箱）
4. 登录后，访问 `/admin` 进入管理后台
5. 添加游戏和攻略测试功能

---

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # 管理后台
│   │   ├── guides/         # 攻略管理
│   │   └── games/          # 游戏管理
│   ├── auth/               # 认证页面
│   ├── guides/             # 攻略页面
│   ├── games/              # 游戏百科页面
│   ├── search/             # 搜索页面
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # 组件
│   ├── Auth/               # 认证组件
│   └── Layout/             # 布局组件
├── lib/                    # 工具函数
│   └── supabase/           # Supabase 客户端
├── types/                  # TypeScript 类型定义
└── styles/                 # 样式文件
```

## 常见问题

### Q: 访问页面时显示 "加载失败"？
A: 请检查：
1. Supabase URL 和 anon key 是否正确配置
2. 数据库表是否已创建
3. RLS 策略是否已启用

### Q: 无法上传图片？
A: 请检查：
1. `images` 存储桶是否已创建
2. 存储桶的公开访问策略是否已设置

### Q: 注册/登录失败？
A: 请检查：
1. Supabase Auth 的 Email provider 是否已启用
2. 如果开启了邮箱验证，需要在邮箱中点击验证链接

### Q: npm install 失败？
A: 尝试使用管理员权限运行命令，或设置自定义缓存目录：
```bash
npm config set cache "d:\Resoult\Wind\development\week2\.npm-cache" --global
npm install
```

## 项目文档

- **README.md**: 项目简介、部署指南
- **ARCHITECTURE.md**: 项目架构、模块详解、扩展开发指南
- **PRD.md**: 产品需求文档

## License

MIT