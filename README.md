# 📝 NoteFlow - 智能笔记流

一个现代化的笔记管理系统，采用 Go + Gin + GORM + MySQL 技术栈构建，具有德国瑞士设计风格的简洁界面。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Go Version](https://img.shields.io/badge/go-1.21+-00ADD8.svg)
![MySQL](https://img.shields.io/badge/mysql-8.0+-4479A1.svg)

## ✨ 功能特性

### 🎯 核心功能
- **📝 备忘录管理**：创建、编辑、删除备忘录
- **✅ 智能状态切换**：点击复选框快速完成任务
- **🏷️ 标签系统**：自定义标签分类管理
- **🔍 智能搜索**：实时搜索备忘录内容
- **📅 日历视图**：日历和网格双视图模式
- **🎨 主题切换**：浅色/深色主题自由切换

### 🎨 用户体验
- **🎯 德国瑞士设计风格**：简洁、现代、专业
- **📱 响应式设计**：完美适配桌面和移动设备
- **⚡ 流畅动画**：平滑的过渡效果和交互反馈
- **🚀 快速操作**：浮动按钮集成多种功能
- **💾 数据持久化**：MySQL数据库安全存储

### 🛠️ 高级功能
- **🏷️ 标签管理**：动态添加/删除标签
- **⚙️ 个性化设置**：主题、视图偏好保存
- **📊 统计面板**：备忘录完成情况统计
- **⌨️ 快捷键支持**：提高操作效率
- **🔄 实时同步**：数据实时更新

## 🚀 快速开始

### 环境要求
- Go 1.21+
- MySQL 8.0+
- 现代浏览器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/DancingCircles/noteflow.git
cd noteflow
```

2. **安装依赖**
```bash
go mod tidy
```

3. **数据库配置**
```bash
# 创建数据库
mysql -u root -p < database.sql

# 或手动创建
mysql -u root -p
CREATE DATABASE IF NOT EXISTS noteflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. **配置数据库连接**
编辑 `config/database.go` 文件，修改数据库连接信息：
```go
// 默认配置
Host: "localhost"
Port: "3306"
User: "root"
Password: "123456"
DBName: "noteflow"
```

5. **启动应用**
```bash
# 开发模式启动
go run main.go

# 或编译后启动
go build -o noteflow
./noteflow
```

6. **访问应用**
打开浏览器访问：http://localhost:8080

## 🚀 生产环境部署

1. **环境变量配置**
```bash
export DB_HOST=your-db-host
export DB_PORT=3306
export DB_USER=your-db-user
export DB_PASSWORD=your-db-password
export DB_NAME=memo_app
export GIN_MODE=release
```

2. **使用 systemd 管理服务**
```ini
# /etc/systemd/system/memo-app.service
[Unit]
Description=Memo App Service
After=network.target

[Service]
Type=simple
User=memo
WorkingDirectory=/opt/memo_app
ExecStart=/opt/memo_app/memo_app
Restart=always
RestartSec=5
Environment=GIN_MODE=release

[Install]
WantedBy=multi-user.target
```

## 🔧 开发指南

### 开发环境设置

1. **安装开发工具**
```bash
# 安装 Air (热重载)
go install github.com/cosmtrek/air@latest

# 安装 golangci-lint (代码检查)
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

2. **使用热重载开发**
```bash
# 创建 .air.toml 配置文件
air init

# 启动热重载
air
```

### 代码规范

- **Go 代码**：遵循官方 Go 代码规范
- **JavaScript**：使用 ES6+ 语法
- **CSS**：BEM 命名规范
- **提交信息**：使用约定式提交格式

### 测试

```bash
# 运行单元测试
go test ./...

# 运行测试并生成覆盖率报告
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## 📁 项目结构

```
memo_app/
├── config/
│   └── database.go          # 数据库配置
├── controllers/
│   └── memo_controller.go   # 控制器逻辑
├── models/
│   └── memo.go             # 数据模型
├── static/
│   ├── css/
│   │   └── style.css       # 样式文件
│   └── js/
│       └── app.js          # 前端逻辑
├── templates/
│   └── index.html          # 主页模板
├── database.sql            # 数据库初始化脚本
├── go.mod                  # Go模块配置
├── go.sum                  # 依赖校验文件
├── main.go                 # 应用入口
└── README.md               # 项目说明
```

## 🎮 使用指南

### 基础操作
1. **新建备忘录**：点击右下角浮动按钮 → 选择"新建备忘录"
2. **完成任务**：点击备忘录左上角的星形收藏按钮旁的复选框
3. **编辑备忘录**：点击备忘录上的"编辑"按钮
4. **删除备忘录**：点击"删除"按钮并确认

### 高级功能
1. **标签管理**：浮动按钮 → "管理标签" → 添加/删除自定义标签
2. **主题切换**：点击右上角主题按钮或通过设置面板
3. **视图切换**：工具栏中选择网格视图或日历视图
4. **搜索过滤**：使用搜索框或侧边栏标签过滤

### 快捷键
- `Ctrl + N`：新建备忘录
- `Ctrl + F`：搜索
- `Ctrl + S`：保存（编辑状态下）
- `Delete`：删除选中项
- `Escape`：关闭模态框/侧边栏

## 🔧 API 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/` | 主页 |
| GET | `/api/memos` | 获取所有备忘录 |
| POST | `/api/memos` | 创建新备忘录 |
| PUT | `/api/memos/:id` | 更新备忘录 |
| DELETE | `/api/memos/:id` | 删除备忘录 |

### 请求示例

**创建备忘录**
```json
POST /api/memos
{
  "title": "会议准备",
  "content": "准备下周的项目评审会议材料",
  "tag": "工作",
  "priority": 2,
  "due_date": "2024-01-15T10:00:00Z",
  "color": "#FF5722"
}
```

**响应示例**
```json
{
  "id": 1,
  "title": "会议准备",
  "content": "准备下周的项目评审会议材料",
  "tag": "工作",
  "priority": 2,
  "status": "pending",
  "due_date": "2024-01-15T10:00:00Z",
  "color": "#FF5722",
  "created_at": "2024-01-10T09:00:00Z",
  "updated_at": "2024-01-10T09:00:00Z"
}
```

## 🏗️ 技术架构

### 后端架构
- **Web框架**：Gin - 高性能的Go HTTP Web框架
- **ORM框架**：GORM - 功能丰富的Go ORM库
- **数据库**：MySQL 8.0+ - 可靠的关系型数据库
- **配置管理**：基于环境变量的配置系统

### 前端架构
- **原生JavaScript**：无框架依赖，轻量高效
- **CSS3**：现代CSS特性，支持动画和响应式
- **模块化设计**：功能模块化，易于维护扩展

### 目录结构详解
```
memo_app/
├── config/           # 配置文件目录
│   └── database.go   # 数据库连接配置
├── controllers/      # 控制器目录
│   └── memo_controller.go  # 备忘录业务逻辑控制器
├── models/          # 数据模型目录
│   └── memo.go      # 备忘录数据模型和数据库操作
├── static/          # 静态资源目录
│   ├── css/         # 样式文件
│   │   └── style.css    # 主样式文件（德国瑞士设计风格）
│   └── js/          # JavaScript文件
│       └── app.js       # 前端主逻辑文件
├── templates/       # HTML模板目录
│   └── index.html   # 主页面模板
├── database.sql     # 数据库初始化SQL脚本
├── go.mod          # Go模块依赖管理
├── go.sum          # 依赖版本锁定文件
├── main.go         # 应用程序入口点
└── README.md       # 项目说明文档
```

## 🗄️ 数据库结构

### memos 表结构
| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| id | UINT | PRIMARY KEY, AUTO_INCREMENT | 主键，自增ID |
| created_at | DATETIME | NOT NULL | 记录创建时间 |
| updated_at | DATETIME | NOT NULL | 记录更新时间 |
| deleted_at | DATETIME | NULL, INDEX | 软删除时间戳 |
| title | VARCHAR(255) | NOT NULL | 备忘录标题（必填） |
| content | TEXT | NULL | 备忘录详细内容 |
| priority | INT | DEFAULT 0 | 优先级（0=低，1=中，2=高） |
| due_date | DATETIME | NULL | 截止日期 |
| status | VARCHAR(20) | DEFAULT 'pending' | 状态（pending/completed） |
| color | VARCHAR(7) | DEFAULT '#FFFFFF' | 颜色标记（十六进制） |

### 索引设计
- **主键索引**：`PRIMARY KEY (id)`
- **软删除索引**：`INDEX idx_deleted_at (deleted_at)`
- **状态索引**：`INDEX idx_status (status)`
- **截止日期索引**：`INDEX idx_due_date (due_date)`

## 🎨 设计理念

本应用采用**德国瑞士设计风格**，追求：
- **简洁性**：去除多余元素，专注核心功能
- **功能性**：每个设计元素都有其存在意义
- **一致性**：统一的视觉语言和交互模式
- **可用性**：直观的操作流程和清晰的视觉层次

## 📱 响应式设计

- **桌面端**：完整功能体验，侧边栏和多列布局
- **平板端**：自适应布局，优化触控交互
- **手机端**：简化界面，底部导航，单列显示

## 🔄 版本更新

### v3.0 - 2024-01-10 (最新)
- ✨ **全新浮动按钮设计**：集成新建、标签管理、设置功能
- 🏷️ **完整标签管理系统**：动态添加/删除标签
- ⚙️ **个性化设置面板**：主题、视图偏好配置
- 🗑️ **界面优化**：移除收藏夹，简化侧边栏
- 🎨 **视觉改进**：优化暗色主题，提升可读性

### v2.1 - 2024-01-08
- ✅ **智能状态切换**：点击完成，视觉反馈优化
- 🗑️ **改进删除确认**：自定义确认对话框
- 🎯 **极简通知系统**：绿色完成图标反馈

### v2.0 - 2024-01-05
- 🗄️ **MySQL集成**：数据持久化存储
- 🌐 **中文支持**：UTF-8字符集配置
- 🎨 **界面简化**：移除复杂分类功能

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](LICENSE) 文件。

## 🙋‍♂️ 支持

如果您遇到问题或有建议，请：
- 🐛 提交 [Issue](https://github.com/DancingCircles/memo_app/issues)
- 💬 参与 [Discussions](https://github.com/DancingCircles/memo_app/discussions)

## 🌟 致谢

感谢所有为这个项目做出贡献的开发者！

---

**⭐ 如果这个项目对您有帮助，请给它一个星标！**