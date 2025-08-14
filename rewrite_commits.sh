#!/bin/bash

# 重写Git提交历史的脚本
git filter-branch --msg-filter '
case "$GIT_COMMIT" in
    a9cbaac*)
        echo "feat: 初始化NoteFlow项目架构"
        ;;
    a8a8219*)
        echo "fix: 修复数据库连接配置"
        ;;
    7e96af6*)
        echo "feat: 实现核心备忘录功能"
        ;;
    6b4a7ff*)
        echo "feat: 添加浮动按钮和交互设计"
        ;;
    802beb6*)
        echo "feat: 完善标签管理系统"
        ;;
    6655d5c*)
        echo "feat: 发布NoteFlow智能笔记流应用"
        ;;
    6c28a00*)
        echo "refactor: 优化项目结构和配置"
        ;;
    *)
        cat
        ;;
esac
' --tag-name-filter cat -- --branches --tags
