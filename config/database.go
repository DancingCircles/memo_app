package config

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

// DatabaseConfig 数据库配置
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

// InitDatabase 初始化数据库连接
func InitDatabase() {
	config := DatabaseConfig{
		Host:     "localhost",
		Port:     "3306",
		User:     "root",
		Password: "123456",
		DBName:   "memo_app",
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&collation=utf8mb4_unicode_ci&readTimeout=30s&writeTimeout=30s",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.DBName,
	)

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully!")
}

// GetDB 获取数据库实例
func GetDB() *gorm.DB {
	return DB
}
