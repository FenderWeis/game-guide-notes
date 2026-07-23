# 游戏攻略笔记 - 项目架构文档

## 一、项目概述

### 1.1 项目名称
**游戏攻略笔记** (Game Guide Notes)

### 1.2 产品定位
一个面向各类游戏玩家的攻略分享与游戏百科平台，提供简洁、易用的攻略浏览和发布体验。

### 1.3 目标用户
- **浏览用户**：普通游戏玩家，浏览攻略和游戏百科
- **普通用户**：已登录用户，可点赞、收藏攻略
- **高级用户 (senior)**：可发布攻略、编辑游戏资料
- **管理员 (admin)**：完整管理权限，包括用户管理

### 1.4 核心价值
- 为玩家提供高质量的游戏攻略和基础资料
- 简洁清爽的界面，专注内容阅读体验
- 支持图文混排的攻略发布
- 结构化的游戏百科（角色、装备、地图等）

---

## 二、技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **前端框架** | Next.js | 14.2.x | React全栈框架，App Router模式 |
| **UI样式** | TailwindCSS | 3.4.x | 原子化CSS，快速构建界面 |
| **富文本编辑器** | TipTap | 2.2.x | 可扩展的React富文本编辑器 |
| **图标库** | Lucide React | 1.23.x | 现代图标库 |
| **数据库** | Supabase PostgreSQL | - | 免费500MB，功能强大 |
| **文件存储** | Supabase Storage | - | 免费1GB，用于图片存储 |
| **认证系统** | Supabase Auth | - | 内置认证，支持邮箱登录 |
| **部署平台** | Vercel | - | 与Next.js无缝集成 |

---

## 三、项目文件结构

```
src/
├── app/                          # Next.js App Router (页面路由)
│   ├── admin/                    # 管理后台
│   │   ├── page.tsx              # 管理后台首页（权限检查）
│   │   ├── categories/           # 资料类型管理
│   │   │   └── page.tsx          # 类型列表（增删改）
│   │   ├── games/                # 游戏管理
│   │   │   ├── page.tsx          # 游戏列表
│   │   │   ├── new/              # 新建游戏
│   │   │   │   └── page.tsx
│   │   │   └── [id]/             # 游戏详情管理
│   │   │       ├── page.tsx      # 编辑游戏信息
│   │   │       └── data/         # 游戏资料管理
│   │   │           ├── new/      # 新建资料条目
│   │   │           │   └── page.tsx
│   │   │           └── [dataId]/
│   │   │               └── edit/ # 编辑资料条目
│   │   │                   └── page.tsx
│   │   ├── guides/               # 攻略管理
│   │   │   ├── page.tsx          # 攻略列表
│   │   │   ├── new/              # 新建攻略
│   │   │   │   └── page.tsx
│   │   │   └── [id]/             # 编辑攻略
│   │   │       └── page.tsx
│   │   └── users/                # 用户管理（仅admin）
│   │       └── page.tsx          # 用户列表、角色管理
│   ├── auth/                     # 认证页面
│   │   └── login/                # 登录/注册页面
│   │       └── page.tsx
│   ├── games/                    # 游戏百科前端页面
│   │   ├── page.tsx              # 游戏列表页
│   │   └── [id]/                 # 游戏详情页
│   │       ├── page.tsx          # 游戏介绍
│   │       └── data/             # 游戏资料列表
│   │           ├── page.tsx      # 资料分类展示
│   │           └── [dataId]/     # 资料详情
│   │               └── page.tsx
│   ├── guides/                   # 攻略前端页面
│   │   ├── page.tsx              # 攻略列表页
│   │   └── [id]/                 # 攻略详情页
│   │       └── page.tsx
│   ├── search/                   # 搜索页面
│   │   └── page.tsx
│   ├── layout.tsx                # 根布局（Supabase Provider）
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
├── components/                   # 可复用组件
│   ├── Auth/                     # 认证相关组件
│   │   ├── AuthButton.tsx        # 登录/注册按钮
│   │   └── AuthModal.tsx         # 登录/注册弹窗
│   ├── Game/                     # 游戏相关组件
│   │   ├── GameCard.tsx          # 游戏卡片
│   │   ├── GameDataItemActions.tsx # 资料操作按钮
│   │   └── GameDetailActions.tsx  # 游戏详情操作按钮
│   ├── Layout/                   # 布局组件
│   │   ├── Header.tsx            # 顶部导航栏
│   │   ├── Footer.tsx            # 底部页脚
│   │   └── Layout.tsx            # 主布局容器
│   ├── TableEditor/              # 表格编辑器组件
│   │   └── TableEditor.tsx       # 可视化表格编辑（支持合并单元格）
│   └── UI/                       # 通用UI组件
│       ├── BackButton.tsx        # 返回按钮
│       ├── DeleteButton.tsx      # 删除按钮
│       └── ReloadButton.tsx      # 刷新按钮
├── hooks/                        # 自定义React Hooks
│   └── useUserRole.ts            # 获取用户角色、权限判断
├── lib/                          # 工具函数和库配置
│   └── supabase/                 # Supabase相关配置
│       ├── client.ts             # 客户端Supabase实例创建
│       ├── server.ts             # 服务端Supabase实例创建
│       └── utils.ts              # 工具函数（safeQuery, isNetworkError）
└── types/                        # TypeScript类型定义
    └── index.ts                  # 所有数据模型类型

supabase/                         # Supabase数据库迁移脚本
├── schema.sql                    # 完整数据库表结构
├── init_admin.sql                # 初始化管理员账号
├── migrate_add_modules.sql       # 添加模块功能迁移
├── migrate_add_block_title.sql   # 添加内容块标题迁移
├── migrate_add_sections.sql      # 添加章节迁移
└── migrate_game_data_types.sql   # 添加资料类型迁移

config files:
├── next.config.js                # Next.js配置
├── tailwind.config.js            # TailwindCSS配置
├── postcss.config.js             # PostCSS配置
├── tsconfig.json                 # TypeScript配置
├── package.json                  # 项目依赖
├── .env.local                    # 本地环境变量（git忽略）
├── .env.local.example            # 环境变量模板
└── .gitignore                    # Git忽略配置
```

---

## 四、核心模块详解

### 4.1 认证系统 (Auth)

**文件位置**: `src/components/Auth/`

**工作原理**:
- 使用 Supabase Auth 的邮箱/密码认证方式
- `AuthModal` 组件处理登录和注册逻辑
- 登录后自动在 `users` 表创建用户记录（角色默认为 `user`）
- 认证状态通过 `useUser()` hook 获取

**关键组件**:
- `AuthButton`: 显示登录/注册按钮，点击弹出 `AuthModal`
- `AuthModal`: 包含登录和注册表单，支持切换模式

### 4.2 用户权限系统

**文件位置**: `src/hooks/useUserRole.ts`

**权限等级**:
| 角色 | 权限描述 |
|------|----------|
| `null` | 游客，仅可浏览内容 |
| `user` | 普通用户，可点赞、收藏攻略 |
| `senior` | 高级用户，可发布攻略、编辑游戏资料 |
| `admin` | 管理员，完整权限，包括用户管理 |

**核心函数**:
- `useUserRole()`: 获取当前用户角色和加载状态
- `useCurrentUser()`: 获取完整用户信息
- `hasPermission(role, requiredRoles)`: 权限判断辅助函数

**数据库层面**:
- `users` 表包含 `role` 字段
- Supabase RLS 策略控制数据访问权限

### 4.3 攻略管理系统

**文件位置**: `src/app/admin/guides/`

**功能**:
- 攻略列表展示（分页）
- 新建攻略（富文本编辑器）
- 编辑攻略
- 删除攻略

**编辑器特性**:
- 使用 TipTap 富文本编辑器
- 支持粗体、斜体、标题、列表、链接
- 支持图片上传（自动上传到 Supabase Storage）

### 4.4 游戏百科系统

**文件位置**: `src/app/admin/games/`

**数据结构层级**:
```
游戏 (Game)
├── 资料类型 (Category)
│   └── 资料条目 (GameData)
│       └── 模块 (Module)
│           └── 内容块 (ContentBlock)
│               ├── 文字类型
│               ├── 表格类型
│               └── 图片类型
```

**核心组件**:
- `TableEditor`: 可视化表格编辑器，支持添加/删除行列、合并/拆分单元格

### 4.5 搜索系统

**文件位置**: `src/app/search/page.tsx`

**搜索范围**:
- 攻略标题和内容
- 游戏名称
- 资料条目标题

---

## 五、数据库结构

### 5.1 核心数据表

**users（用户表）**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键（Supabase Auth用户ID） |
| email | VARCHAR | 邮箱 |
| role | VARCHAR | 角色：`user` / `senior` / `admin` |
| created_at | TIMESTAMP | 创建时间 |

**games（游戏表）**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR | 游戏名称 |
| cover | VARCHAR | 游戏封面图URL |
| description | TEXT | 游戏简介 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**categories（资料类型表）**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR | 类型名称（如角色、装备、地图） |

**game_data（游戏资料条目表）**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| game_id | UUID | 关联游戏ID |
| category_id | UUID | 关联类型ID |
| title | VARCHAR | 资料标题 |
| content | TEXT | 资料内容（表格为HTML） |
| image | VARCHAR | 配图URL |
| created_at | TIMESTAMP | 创建时间 |

**game_data_modules（资料模块表）**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| game_data_id | UUID | 关联资料条目ID |
| title | VARCHAR | 模块标题 |
| sort_order | INT | 排序顺序 |

**game_data_content_blocks（内容块表）**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| game_data_id | UUID | 关联资料条目ID |
| module_id | UUID | 关联模块ID |
| title | VARCHAR | 内容块标题 |
| content | TEXT | 内容（文字或表格HTML） |
| image | VARCHAR | 图片URL |
| content_type | VARCHAR | 类型：`text` / `table` / `image` |
| sort_order | INT | 排序顺序 |

**guides（攻略表）**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | VARCHAR | 攻略标题 |
| content | TEXT | 攻略内容（富文本HTML） |
| game_id | UUID | 关联游戏ID |
| category_id | UUID | 关联攻略类型ID |
| author_id | UUID | 作者ID |
| likes | INT | 点赞数 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**likes（点赞表）**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户ID |
| guide_id | UUID | 攻略ID |
| created_at | TIMESTAMP | 创建时间 |

**favorites（收藏表）**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户ID |
| guide_id | UUID | 攻略ID |
| created_at | TIMESTAMP | 创建时间 |

### 5.2 RLS 策略（Row Level Security）

**重要说明**: Supabase 默认启用 RLS，需要配置策略才能访问数据。

**策略示例**:
- `games` 表：所有用户可读取，仅管理员可写入
- `game_data` 表：所有用户可读取，senior和admin可写入，仅admin可删除
- `users` 表：用户可读取自己的记录，仅admin可更新/删除

---

## 六、Supabase 配置

### 6.1 环境变量

| 变量名 | 说明 |
|--------|------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase项目URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase匿名密钥 |

### 6.2 存储配置

**存储桶名称**: `images`
**访问权限**: 公开访问（Public）
**用途**: 存储游戏封面、攻略配图、资料图片

### 6.3 认证配置

**启用方式**: Email/Password
**邮箱验证**: 生产环境建议开启

---

## 七、部署指南

### 7.1 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 7.2 生产构建

```bash
npm run build
```

### 7.3 Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署完成后，将 Vercel 域名添加到 Supabase 认证重定向 URL

### 7.4 初始化管理员

执行 `supabase/init_admin.sql` 脚本创建第一个管理员账号：

```sql
-- 将指定用户升级为管理员
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## 八、常见问题与解决方案

### 8.1 构建错误

**问题**: `Dynamic server usage: Route /games couldn't be rendered statically`
**原因**: 页面使用了 `cookies`，无法静态生成
**解决方案**: 添加 `export const dynamic = 'force-dynamic'` 到页面顶部

### 8.2 认证错误

**问题**: `Failed to fetch` / `ERR_PROXY_CONNECTION_FAILED`
**原因**: 网络代理问题，Supabase 服务器在海外
**解决方案**: 检查网络代理配置，或使用 VPN

### 8.3 按钮点击触发表单提交

**问题**: 点击按钮后页面跳转
**原因**: 按钮缺少 `type="button"` 属性，默认为 `type="submit"`
**解决方案**: 添加 `type="button"` 属性

### 8.4 表格编辑问题

**问题**: 表格内容无法保存
**原因**: 内容块条件判断跳过了空内容的表格
**解决方案**: 确保条件包含 `block.contentType !== 'table'`

### 8.5 权限问题

**问题**: 用户无法执行操作
**原因**: RLS 策略配置不正确或用户角色未设置
**解决方案**: 检查 Supabase RLS 策略，确保用户角色正确

---

## 九、代码规范与约定

### 9.1 文件命名
- 使用 kebab-case（小写字母，连字符分隔）
- 页面文件统一命名为 `page.tsx`

### 9.2 组件命名
- 使用 PascalCase
- 组件文件与组件名称一致

### 9.3 类型定义
- 所有数据模型定义在 `src/types/index.ts`
- 使用 `export interface` 导出类型

### 9.4 错误处理
- 使用 `safeQuery` 封装 Supabase 查询
- 网络错误使用 `isNetworkError` 判断
- 用户操作需显示成功/失败提示

### 9.5 按钮规范
- 表单内的非提交按钮必须添加 `type="button"`
- 按钮需有明确的禁用状态和加载状态

---

## 十、扩展开发指南

### 10.1 添加新页面

1. 在 `src/app/` 下创建新目录
2. 创建 `page.tsx` 文件
3. 如果需要服务端数据，使用 `createServerClient()`
4. 如果需要认证，使用 `useUser()` 和 `useUserRole()`

### 10.2 添加新组件

1. 在 `src/components/` 下创建新目录
2. 创建组件文件，使用 PascalCase 命名
3. 添加适当的 props 类型定义

### 10.3 添加新数据库表

1. 在 `supabase/` 目录创建迁移脚本
2. 在 `src/types/index.ts` 添加类型定义
3. 在 Supabase SQL Editor 执行脚本

### 10.4 添加新权限

1. 在 `src/types/index.ts` 更新角色类型
2. 更新 `useUserRole.ts` 中的权限判断逻辑
3. 更新数据库 `users` 表的 role 字段约束
4. 更新 Supabase RLS 策略

---

## 十一、项目维护

### 11.1 日志管理
- 生产环境禁用 `console.log`
- 错误信息使用 `console.error`
- 网络错误自动过滤（见 `Layout.tsx`）

### 11.2 性能优化
- 使用 Next.js 的 ISR/SSR 优化页面加载
- 图片使用 Supabase Storage 的 CDN
- 启用 Next.js 压缩

### 11.3 安全维护
- 定期更新依赖版本
- 检查 Supabase RLS 策略
- 监控异常登录行为

---

## 十二、联系方式

如有问题或需要帮助，请联系项目维护者。

---

*文档版本: 1.0*
*最后更新: 2026-07-22*
