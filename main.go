package main

import (
	"noteflow/config"
	"noteflow/controllers"
	"noteflow/models"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化数据库连接
	config.InitDatabase()

	// 自动迁移数据库表
	config.GetDB().AutoMigrate(&models.Memo{})

	// 创建Gin实例
	r := gin.Default()

	// 设置静态文件目录
	r.Static("/static", "./static")
	r.LoadHTMLGlob("templates/*")

	// 创建控制器实例
	memoController := controllers.NewMemoController()

	// 定义路由
	// 引导页面路由
	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "intro.html", gin.H{})
	})

	// 主应用路由
	r.GET("/app", func(c *gin.Context) {
		c.HTML(200, "index.html", gin.H{})
	})

	// API路由
	api := r.Group("/api")
	{
		api.POST("/memos", memoController.CreateMemo)
		api.GET("/memos", memoController.GetMemos)
		api.PUT("/memos/:id", memoController.UpdateMemo)
		api.DELETE("/memos/:id", memoController.DeleteMemo)
	}

	// 启动服务器
	r.Run(":8080")
}
