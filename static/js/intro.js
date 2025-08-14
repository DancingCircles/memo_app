// NoteFlow 引导页面交互脚本
class IntroController {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 3;
        this.isScrolling = false;
        this.scrollThreshold = 50;
        
        this.init();
    }
    
    init() {
        this.setupScrollListener();
        this.setupProgressIndicator();
        this.setupIntersectionObserver();
        this.animateInitialPage();
        this.setupKeyboardNavigation();
    }
    
    // 设置滚动监听
    setupScrollListener() {
        let scrollTimeout;
        
        window.addEventListener('wheel', (e) => {
            if (this.isScrolling) return;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (Math.abs(e.deltaY) > this.scrollThreshold) {
                    if (e.deltaY > 0 && this.currentPage < this.totalPages) {
                        this.nextPage();
                    } else if (e.deltaY < 0 && this.currentPage > 1) {
                        this.prevPage();
                    }
                }
            }, 50);
        }, { passive: true });
        
        // 触摸设备支持
        let touchStartY = 0;
        let touchEndY = 0;
        
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        window.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            touchEndY = e.changedTouches[0].screenY;
            const deltaY = touchStartY - touchEndY;
            
            if (Math.abs(deltaY) > this.scrollThreshold) {
                if (deltaY > 0 && this.currentPage < this.totalPages) {
                    this.nextPage();
                } else if (deltaY < 0 && this.currentPage > 1) {
                    this.prevPage();
                }
            }
        }, { passive: true });
    }
    
    // 设置进度指示器
    setupProgressIndicator() {
        const dots = document.querySelectorAll('.progress-dot');
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToPage(index + 1);
            });
        });
    }
    
    // 设置交叉观察器用于动画触发
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animatePageContent(entry.target);
                }
            });
        }, observerOptions);
        
        // 观察所有页面
        document.querySelectorAll('.intro-page').forEach(page => {
            observer.observe(page);
        });
    }
    
    // 键盘导航
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isScrolling) return;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    if (this.currentPage < this.totalPages) {
                        this.nextPage();
                    }
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    if (this.currentPage > 1) {
                        this.prevPage();
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToPage(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToPage(this.totalPages);
                    break;
                case 'Enter':
                    if (this.currentPage === this.totalPages) {
                        this.enterApp();
                    }
                    break;
            }
        });
    }
    
    // 下一页
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }
    
    // 上一页
    prevPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }
    
    // 跳转到指定页面
    goToPage(pageNumber) {
        if (pageNumber === this.currentPage || this.isScrolling) return;
        
        this.isScrolling = true;
        this.currentPage = pageNumber;
        
        const targetPage = document.getElementById(`page${pageNumber}`);
        
        // 平滑滚动到目标页面
        targetPage.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // 更新进度指示器
        this.updateProgressIndicator();
        
        // 重置滚动锁定
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }
    
    // 更新进度指示器
    updateProgressIndicator() {
        const dots = document.querySelectorAll('.progress-dot');
        
        dots.forEach((dot, index) => {
            if (index + 1 === this.currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // 动画页面内容
    animatePageContent(page) {
        const pageId = page.id;
        const content = page.querySelector('.intro-content');
        
        // 添加基础动画
        if (content) {
            content.classList.add('animate');
        }
        
        // 页面特定动画
        switch(pageId) {
            case 'page1':
                this.animatePage1(page);
                break;
            case 'page2':
                this.animatePage2(page);
                break;
            case 'page3':
                this.animatePage3(page);
                break;
        }
    }
    
    // 页面1动画
    animatePage1(page) {
        const features = page.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.animationPlayState = 'running';
            }, index * 200);
        });
    }
    
    // 页面2动画
    animatePage2(page) {
        const cards = page.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 150);
        });
    }
    
    // 页面3动画
    animatePage3(page) {
        const principles = page.querySelectorAll('.principle-item');
        const visual = page.querySelector('.visual-element');
        
        principles.forEach((principle, index) => {
            setTimeout(() => {
                principle.classList.add('animate');
            }, index * 200);
        });
        
        if (visual) {
            setTimeout(() => {
                visual.classList.add('animate');
            }, 600);
        }
    }
    
    // 初始页面动画
    animateInitialPage() {
        setTimeout(() => {
            this.animatePageContent(document.getElementById('page1'));
        }, 300);
    }
    
    // 进入主应用
    enterApp() {
        // 添加退出动画
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.95)';
        document.body.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            window.location.href = '/app';
        }, 500);
    }
}

// 全局函数
function enterApp() {
    if (window.introController) {
        window.introController.enterApp();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.introController = new IntroController();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'scale(1)';
        document.body.style.transition = 'all 0.8s ease';
    }, 100);
});

// 防止页面刷新时的闪烁
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
});
