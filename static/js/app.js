// DOM元素
const addMemoBtn = document.getElementById('addMemoBtn');
const memoModal = document.getElementById('memoModal');
const memoForm = document.getElementById('memoForm');
const cancelBtn = document.getElementById('cancelBtn');
const memoContainer = document.getElementById('memoContainer');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');

// 新增DOM元素
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const themeToggle = document.getElementById('themeToggle');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mainContent = document.querySelector('.main-content');
const viewMode = document.getElementById('viewMode');

const calendarView = document.getElementById('calendarView');

// 统计元素
const totalMemos = document.getElementById('totalMemos');
const pendingMemos = document.getElementById('pendingMemos');
const completedMemos = document.getElementById('completedMemos');
const completionRate = document.getElementById('completionRate');
const progressFill = document.getElementById('progressFill');

// 浮动按钮
const mainFab = document.getElementById('mainFab');
const fabMenu = document.getElementById('fabMenu');
const shortcutsHint = document.getElementById('shortcutsHint');

// 标签管理
const tagManagementModal = document.getElementById('tagManagementModal');
const newTagInput = document.getElementById('newTagInput');
const addNewTagBtn = document.getElementById('addNewTagBtn');
const closeTagModalBtn = document.getElementById('closeTagModalBtn');
const tagsGrid = document.getElementById('tagsGrid');

// 设置
const settingsModal = document.getElementById('settingsModal');
const themeSelect = document.getElementById('themeSelect');
const defaultViewSelect = document.getElementById('defaultViewSelect');
const autoSave = document.getElementById('autoSave');
const notifications = document.getElementById('notifications');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');

// 模态框
const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// 状态变量
let currentFilter = 'all';
let currentSort = 'date';
let currentView = 'grid';
let currentTheme = 'light';
let memos = [];
let editingMemoId = null;
let deletingMemoId = null;
let searchTerm = '';
let availableTags = ['工作', '生活', '学习', '重要', '紧急', '娱乐', '健康', '购物'];



// 事件委托：将事件监听器添加到容器而不是每个元素
memoContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('status-checkbox')) {
        const card = target.closest('.memo-card');
        if (card) {
            toggleMemoStatus(card.dataset.id);
        }
    } else if (target.classList.contains('edit-btn')) {
        const card = target.closest('.memo-card');
        if (card) {
            openModal(card.dataset);
        }
    } else if (target.classList.contains('delete-btn')) {
        const card = target.closest('.memo-card');
        if (card) {
            showDeleteConfirmation(card.dataset.id);
        }
    } else if (target.classList.contains('undo-btn')) {
        const card = target.closest('.memo-card');
        if (card) {
            undoMemoCompletion(card.dataset.id);
        }
    }
});



// 基础事件监听器
addMemoBtn.addEventListener('click', () => openModal());
cancelBtn.addEventListener('click', () => closeModal());
memoForm.addEventListener('submit', handleSubmit);
sortSelect.addEventListener('change', handleSort);

// 搜索功能
searchInput.addEventListener('input', handleSearch);
searchBtn.addEventListener('click', () => searchInput.focus());

// 主题切换
themeToggle.addEventListener('click', toggleTheme);

// 侧边栏控制
sidebarToggle.addEventListener('click', toggleSidebar);
closeSidebar.addEventListener('click', closeSidebarPanel);
sidebarOverlay.addEventListener('click', closeSidebarPanel);

// 视图模式切换
viewMode.addEventListener('change', handleViewChange);

// 批量操作功能已移除

// 浮动按钮
mainFab.addEventListener('click', toggleFabMenu);
document.getElementById('newMemo')?.addEventListener('click', () => {
    toggleFabMenu();
    openModal();
});
document.getElementById('manageTagsBtn')?.addEventListener('click', () => {
    toggleFabMenu();
    openTagManagementModal();
});
document.getElementById('settingsBtn')?.addEventListener('click', () => {
    toggleFabMenu();
    openSettingsModal();
});

// 标签管理
addNewTagBtn.addEventListener('click', addNewTag);
closeTagModalBtn.addEventListener('click', closeTagManagementModal);
newTagInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewTag();
    }
});

// 设置
saveSettingsBtn.addEventListener('click', saveSettings);
cancelSettingsBtn.addEventListener('click', closeSettingsModal);

// 删除确认模态框事件监听器
cancelDeleteBtn.addEventListener('click', () => closeDeleteModal());
confirmDeleteBtn.addEventListener('click', () => confirmDelete());

// 过滤器按钮
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderMemos();
    });
});

// 键盘快捷键
document.addEventListener('keydown', handleKeyboard);

// 点击外部关闭侧边栏逻辑已移到覆盖层处理

// API 函数
async function fetchMemos() {
    try {
        const response = await fetch('/api/memos');
        const data = await response.json();
        // 统一字段名映射
        memos = data.map(memo => ({
            id: memo.id,
            title: memo.title,
            content: memo.content,
            priority: memo.priority,
            dueDate: memo.due_date,
            color: memo.color,
            status: memo.status
        }));
        renderMemos();
    } catch (error) {
        console.error('获取备忘录失败:', error);
    }
}

async function createMemo(memoData) {
    try {
        const response = await fetch('/api/memos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memoData),
        });
        const newMemo = await response.json();
        memos.push(newMemo);
        renderMemos();
    } catch (error) {
        console.error('创建备忘录失败:', error);
    }
}

async function updateMemo(id, memoData) {
    try {
        const response = await fetch(`/api/memos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memoData),
        });
        const updatedMemo = await response.json();
        memos = memos.map(memo => memo.id === parseInt(id) ? {
            id: updatedMemo.id,
            title: updatedMemo.title,
            content: updatedMemo.content,
            priority: updatedMemo.priority,
            dueDate: updatedMemo.due_date,
            color: updatedMemo.color,
            status: updatedMemo.status
        } : memo);
        renderMemos();
    } catch (error) {
        console.error('更新备忘录失败:', error);
    }
}

async function deleteMemo(id) {
    try {
        await fetch(`/api/memos/${id}`, {
            method: 'DELETE',
        });
        memos = memos.filter(memo => memo.id !== parseInt(id));
        renderMemos();
        // 删除成功不显示提示，操作结果已经很明显
    } catch (error) {
        console.error('删除备忘录失败:', error);
        // 保留错误提示，其他操作不显示通知
        showNotification('×', 'error');
    }
}

// 显示删除确认模态框
function showDeleteConfirmation(id) {
    deletingMemoId = id;
    deleteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭删除确认模态框
function closeDeleteModal() {
    deleteModal.classList.remove('active');
    document.body.style.overflow = '';
    deletingMemoId = null;
}

// 确认删除
function confirmDelete() {
    if (deletingMemoId) {
        deleteMemo(deletingMemoId);
        closeDeleteModal();
    }
}

// UI 函数
function openModal(memo = null) {
    memoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (memo) {
        editingMemoId = memo.id;
        document.getElementById('modalTitle').textContent = '编辑备忘录';
        document.getElementById('title').value = memo.title;
        document.getElementById('content').value = memo.content;
        document.getElementById('priority').value = memo.priority;
        document.getElementById('dueDate').value = memo.dueDate ? memo.dueDate.split('T')[0] : '';
        document.getElementById('color').value = memo.color;
        document.getElementById('tags').value = memo.tag || '';
    } else {
        editingMemoId = null;
        document.getElementById('modalTitle').textContent = '新建备忘录';
        memoForm.reset();
        document.getElementById('color').value = '#FF0000';
    }
}

function closeModal() {
    memoModal.classList.remove('active');
    document.body.style.overflow = '';
    memoForm.reset();
    editingMemoId = null;
}

async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(memoForm);
    
    // 验证必填字段
    const title = formData.get('title').trim();
    if (!title) {
        alert('请输入标题');
        return;
    }
    
    const memoData = {
        title: title,
        content: formData.get('content'),
        priority: parseInt(formData.get('priority')),
        due_date: formData.get('dueDate') ? formData.get('dueDate') + 'T00:00:00Z' : null,
        color: formData.get('color'),
        tag: formData.get('tags'),
        status: 'pending'
    };

    try {
        if (editingMemoId) {
            await updateMemo(editingMemoId, memoData);
        } else {
            await createMemo(memoData);
        }
        closeModal();
    } catch (error) {
        alert('操作失败，请重试');
    }
}

function handleSort() {
    currentSort = sortSelect.value;
    renderMemos();
}

function toggleMemoStatus(id) {
    const memo = memos.find(m => m.id === parseInt(id));
    if (memo) {
        const updatedMemo = { ...memo };
        const newStatus = memo.status === 'completed' ? 'pending' : 'completed';
        updatedMemo.status = newStatus;

        // 添加视觉反馈
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            card.style.transition = 'all 0.3s ease';
            // 不显示任何通知，保持界面简洁
        }

        updateMemo(id, updatedMemo);
    }
}

// 撤回已完成的备忘录
function undoMemoCompletion(id) {
    const memo = memos.find(m => m.id === parseInt(id));
    if (memo && memo.status === 'completed') {
        const updatedMemo = { ...memo };
        updatedMemo.status = 'pending';
        updateMemo(id, updatedMemo);
        // 撤回操作不显示提示，保持界面简洁
    }
}

function renderMemos() {
    let filteredMemos = [...memos]; // 创建数组副本以避免修改原始数据

    // 搜索过滤
    if (searchTerm) {
        filteredMemos = filteredMemos.filter(memo => 
            memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            memo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (memo.tag && memo.tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    // 状态过滤
    if (currentFilter !== 'all') {
        if (currentFilter === 'overdue') {
            filteredMemos = filteredMemos.filter(memo => 
                memo.status === 'pending' && 
                memo.dueDate && 
                new Date(memo.dueDate) < new Date()
            );
        } else {
            filteredMemos = filteredMemos.filter(memo => memo.status === currentFilter);
        }
    }

    // 排序
    filteredMemos.sort((a, b) => {
        if (currentSort === 'date') {
            return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
        } else if (currentSort === 'priority') {
            return (b.priority || 0) - (a.priority || 0);
        } else if (currentSort === 'title') {
            return (a.title || '').localeCompare(b.title || '');
        }
        return 0;
    });

    // 更新统计
    updateStats();

    // 根据视图模式渲染
    if (currentView === 'calendar') {
        renderCalendarView();
        return;
    }

    // 设置容器类
    const container = memoContainer.parentElement;
    container.className = `memo-container`;

    // 渲染备忘录
    memoContainer.innerHTML = filteredMemos.map(memo => {
        const isOverdue = memo.status === 'pending' && memo.dueDate && new Date(memo.dueDate) < new Date();
        return `
        <div class="memo-card ${memo.status === 'completed' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}"
             style="border-left-color: ${memo.color || '#FF0000'}"
             data-id="${memo.id}"
             data-title="${memo.title || ''}"
             data-content="${memo.content || ''}"
             data-priority="${memo.priority || 0}"
             data-due-date="${memo.dueDate || ''}"
             data-color="${memo.color || '#FF0000'}">
            <div class="memo-status">
                <input type="checkbox"
                       class="status-checkbox"
                       ${memo.status === 'completed' ? 'checked' : ''}
                       title="标记完成">

            </div>
            <div class="memo-favorite">
                <button class="favorite-btn ${memo.favorite ? 'active' : ''}">⭐</button>
            </div>
            <h3>${memo.title || 'Untitled'}</h3>
            <p>${memo.content || ''}</p>
            ${memo.tag ? `<div class="memo-tags">
                <span class="tag">${memo.tag}</span>
            </div>` : ''}
            <div class="memo-meta">
                <span>优先级: ${['低', '中', '高'][memo.priority] || '低'}</span>
                <span>截止: ${memo.dueDate ? new Date(memo.dueDate).toLocaleDateString() : '无'}</span>
            </div>
            <div class="memo-actions">
                ${memo.status === 'completed' ?
                    '<button class="undo-btn">撤回</button>' :
                    '<button class="edit-btn">编辑</button>'
                }
                <button class="delete-btn">删除</button>
            </div>
        </div>
    `}).join('');
}

// 初始化
fetchMemos();

// 添加加载状态和错误提示
function showLoading() {
    memoContainer.innerHTML = '<div class="loading">加载中...</div>';
}

function showError(message) {
    memoContainer.innerHTML = `<div class="error">错误: ${message}</div>`;
}

// 通知系统
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // 自动隐藏 - 缩短显示时间
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 1200);
}

// === 新增功能函数 ===

// 搜索功能
function handleSearch(e) {
    searchTerm = e.target.value.trim();
    renderMemos();
}

// 主题切换
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', currentTheme);
}

// 侧边栏控制
function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
}

function closeSidebarPanel() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
}

// 视图模式切换
function handleViewChange(e) {
    currentView = e.target.value;
    if (currentView === 'calendar') {
        memoContainer.style.display = 'none';
        calendarView.style.display = 'block';
        renderCalendarView();
    } else {
        memoContainer.style.display = 'grid';
        calendarView.style.display = 'none';
        renderMemos();
    }
}

// 批量操作功能已移除

// 浮动按钮控制
function toggleFabMenu() {
    mainFab.classList.toggle('active');
    fabMenu.classList.toggle('active');
}

// 标签管理功能
function openTagManagementModal() {
    tagManagementModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderTagsGrid();
}

function closeTagManagementModal() {
    tagManagementModal.classList.remove('active');
    document.body.style.overflow = '';
    newTagInput.value = '';
}

function addNewTag() {
    const tagName = newTagInput.value.trim();
    if (!tagName) {
        alert('请输入标签名称');
        return;
    }
    
    if (availableTags.includes(tagName)) {
        alert('该标签已存在');
        return;
    }
    
    if (tagName.length > 10) {
        alert('标签名称不能超过10个字符');
        return;
    }
    
    availableTags.push(tagName);
    updateTagSelect();
    renderTagsGrid();
    newTagInput.value = '';
}

function removeTag(tagName) {
    if (confirm(`确定要删除标签"${tagName}"吗？`)) {
        availableTags = availableTags.filter(tag => tag !== tagName);
        updateTagSelect();
        renderTagsGrid();
    }
}

function renderTagsGrid() {
    if (!tagsGrid) return;
    
    tagsGrid.innerHTML = availableTags.map(tag => `
        <div class="tag-management-item">
            <span class="tag-name">${tag}</span>
            <button class="delete-tag-btn" onclick="removeTag('${tag}')">删除</button>
        </div>
    `).join('');
}

function updateTagSelect() {
    const tagSelect = document.getElementById('tags');
    if (!tagSelect) return;
    
    tagSelect.innerHTML = `
        <option value="">选择标签</option>
        ${availableTags.map(tag => `<option value="${tag}">${tag}</option>`).join('')}
    `;
}

// 设置功能
function openSettingsModal() {
    settingsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // 加载当前设置
    themeSelect.value = currentTheme;
    defaultViewSelect.value = currentView;
}

function closeSettingsModal() {
    settingsModal.classList.remove('active');
    document.body.style.overflow = '';
}

function saveSettings() {
    // 保存主题设置
    const newTheme = themeSelect.value;
    if (newTheme !== currentTheme) {
        currentTheme = newTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', currentTheme);
    }
    
    // 保存默认视图设置
    const newView = defaultViewSelect.value;
    if (newView !== currentView) {
        currentView = newView;
        viewMode.value = currentView;
        handleViewChange({ target: { value: currentView } });
        localStorage.setItem('defaultView', currentView);
    }
    
    closeSettingsModal();
}

// 统计更新
function updateStats() {
    const total = memos.length;
    const pending = memos.filter(m => m.status === 'pending').length;
    const completed = memos.filter(m => m.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    if (totalMemos) totalMemos.textContent = total;
    if (pendingMemos) pendingMemos.textContent = pending;
    if (completedMemos) completedMemos.textContent = completed;
    if (completionRate) completionRate.textContent = `${rate}%`;
    if (progressFill) progressFill.style.width = `${rate}%`;
}

// 日历视图
function renderCalendarView() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // 更新月份显示
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${year}年${month + 1}月`;
    }
    
    // 生成日历网格
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();
    
    let calendarHTML = '';
    
    // 添加星期标题
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    weekdays.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // 添加空白天数
    for (let i = 0; i < startDate; i++) {
        calendarHTML += '<div class="calendar-day other-month"></div>';
    }
    
    // 添加月份天数
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const isToday = date.toDateString() === now.toDateString();
        
        // 找到这一天的备忘录
        const dayMemos = memos.filter(memo => 
            memo.dueDate && memo.dueDate.startsWith(dateStr)
        );
        
        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="calendar-day-number">${day}</div>
                ${dayMemos.slice(0, 3).map(memo => 
                    `<div class="calendar-memo" style="background: ${memo.color}">${memo.title}</div>`
                ).join('')}
                ${dayMemos.length > 3 ? `<div class="calendar-more">+${dayMemos.length - 3}</div>` : ''}
            </div>
        `;
    }
    
    calendarGrid.innerHTML = calendarHTML;
}

// 键盘快捷键
function handleKeyboard(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'n':
                e.preventDefault();
                openModal();
                break;
            case 'f':
                e.preventDefault();
                searchInput.focus();
                break;
            case 's':
                e.preventDefault();
                if (memoModal.classList.contains('active')) {
                    memoForm.dispatchEvent(new Event('submit'));
                }
                break;
            case '?':
                e.preventDefault();
                toggleShortcutsHint();
                break;
        }
    }
    
    if (e.key === 'Escape') {
        // 关闭所有模态框
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
        
        // 批量选择功能已移除
        
        // 关闭侧边栏
        if (sidebar.classList.contains('active')) {
            closeSidebarPanel();
        }
    }
}

function toggleShortcutsHint() {
    shortcutsHint.classList.toggle('show');
    setTimeout(() => {
        shortcutsHint.classList.remove('show');
    }, 5000);
}

// 标签和设置功能已简化

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateStats();
    updateTagSelect();
    
    // 加载保存的默认视图
    const savedView = localStorage.getItem('defaultView');
    if (savedView && savedView !== currentView) {
        currentView = savedView;
        viewMode.value = currentView;
        handleViewChange({ target: { value: currentView } });
    }
});

// 批量选择功能已移除

