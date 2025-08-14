package controllers

import (
	"net/http"
	"noteflow/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MemoController struct {
	store *models.Store
}

// NewMemoController 创建新的控制器实例
func NewMemoController() *MemoController {
	return &MemoController{
		store: models.NewStore(),
	}
}

// CreateMemo 创建新的备忘录
func (c *MemoController) CreateMemo(ctx *gin.Context) {
	var memo models.Memo
	if err := ctx.ShouldBindJSON(&memo); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 验证数据
	if err := memo.Validate(); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.store.Create(&memo); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, memo)
}

// GetMemos 获取所有备忘录
func (c *MemoController) GetMemos(ctx *gin.Context) {
	memos := c.store.GetAll()
	ctx.JSON(http.StatusOK, memos)
}

// UpdateMemo 更新备忘录
func (c *MemoController) UpdateMemo(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "无效的ID"})
		return
	}

	// 先获取原始备忘录
	existingMemo, exists := c.store.GetByID(uint(id))
	if !exists {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "备忘录不存在"})
		return
	}

	var memo models.Memo
	if err := ctx.ShouldBindJSON(&memo); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 验证数据
	if err := memo.Validate(); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	memo.ID = uint(id)
	memo.CreatedAt = existingMemo.CreatedAt // 保持原始创建时间
	if err := c.store.Update(&memo); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 重新获取更新后的备忘录以返回完整数据
	updatedMemo, _ := c.store.GetByID(uint(id))
	ctx.JSON(http.StatusOK, updatedMemo)
}

// DeleteMemo 删除备忘录
func (c *MemoController) DeleteMemo(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "无效的ID"})
		return
	}

	if err := c.store.Delete(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}
