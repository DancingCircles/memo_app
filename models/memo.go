package models

import (
	"fmt"
	"noteflow/config"
	"strings"
	"time"

	"gorm.io/gorm"
)

// Memo 备忘录模型
type Memo struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	Title     string         `json:"title" gorm:"not null"`
	Content   string         `json:"content"`
	Priority  int            `json:"priority" gorm:"default:0"`
	DueDate   *time.Time     `json:"due_date"`
	Status    string         `json:"status" gorm:"default:pending"`
	Color     string         `json:"color" gorm:"default:#FFFFFF"`
}

// Store 数据库存储
type Store struct {
	db *gorm.DB
}

// NewStore 创建新的存储实例
func NewStore() *Store {
	return &Store{
		db: config.GetDB(),
	}
}

// Create 创建新的备忘录
func (s *Store) Create(memo *Memo) error {
	if memo.Status == "" {
		memo.Status = "pending"
	}
	if memo.Color == "" {
		memo.Color = "#FFFFFF"
	}
	return s.db.Create(memo).Error
}

// GetAll 获取所有备忘录
func (s *Store) GetAll() []*Memo {
	var memos []*Memo
	s.db.Find(&memos)
	return memos
}

// GetByID 通过ID获取备忘录
func (s *Store) GetByID(id uint) (*Memo, bool) {
	var memo Memo
	err := s.db.First(&memo, id).Error
	if err != nil {
		return nil, false
	}
	return &memo, true
}

// Update 更新备忘录
func (s *Store) Update(memo *Memo) error {
	// 只更新指定字段，不更新created_at
	return s.db.Model(memo).Select("title", "content", "priority", "due_date", "status", "color", "updated_at").Updates(memo).Error
}

// Delete 删除备忘录
func (s *Store) Delete(id uint) error {
	result := s.db.Delete(&Memo{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("备忘录不存在")
	}
	return nil
}

// 添加数据验证
func (m *Memo) Validate() error {
	if strings.TrimSpace(m.Title) == "" {
		return fmt.Errorf("标题不能为空")
	}
	if m.Priority < 0 || m.Priority > 2 {
		return fmt.Errorf("优先级必须在0-2之间")
	}
	return nil
}
