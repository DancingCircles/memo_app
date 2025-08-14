(function(){
    const enterBtn = document.getElementById('enterApp');
    const skipBtn = document.getElementById('skipIntro');
    const dots = document.getElementById('paginationDots');
    const panels = Array.from(document.querySelectorAll('.panel'));
    const progressBar = document.getElementById('progressBar');
    // 移除定制图形与胶囊交互，保留核心进入逻辑

    function enterApp() {
        try { localStorage.setItem('hasSeenIntro', '1'); } catch(e) {}
        window.location.replace('/');
    }

    function onKeydown(e){
        if (e.key === 'Enter') {
            enterApp();
        }
    }

    function setupRevealOnScroll() {
        const reveals = Array.from(document.querySelectorAll('.panel .title, .panel .subtitle, .feature-card, .enter-btn'));
        reveals.forEach(el => el.classList.add('reveal'));
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { threshold: 0.15 });
        reveals.forEach(el => io.observe(el));
    }

    // 文本丝滑滚动动画：分词上浮与交错延迟
    function splitLines() {
        const splitTargets = document.querySelectorAll('.anim-split');
        splitTargets.forEach(el => {
            if (el.dataset.split === '1') return;
            el.dataset.split = '1';
            const text = el.textContent.trim();
            el.textContent = '';
            const words = text.split(/\s+/);
            words.forEach((word, wi) => {
                const line = document.createElement('span');
                line.className = 'split-line';
                const wordSpan = document.createElement('span');
                wordSpan.className = 'split-word';
                wordSpan.style.transitionDelay = `${wi * 40}ms`;
                wordSpan.textContent = (wi < words.length - 1) ? word + ' ' : word;
                line.appendChild(wordSpan);
                el.appendChild(line);
            });
        });
    }

    function revealOnScroll() {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    // anim-fadeup
                    if (target.classList.contains('anim-fadeup')) {
                        const delay = parseFloat(target.dataset.delay || '0');
                        target.style.transitionDelay = `${Math.max(0, delay)}s`;
                        target.classList.add('show');
                    }
                    // anim-stagger
                    if (target.classList.contains('anim-stagger')) {
                        target.classList.add('show');
                    }
                    // anim-split
                    if (target.classList.contains('anim-split')) {
                        target.querySelectorAll('.split-word').forEach(w => {
                            w.classList.add('show');
                        });
                    }
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.anim-fadeup, .anim-stagger, .anim-split').forEach(el => io.observe(el));
    }

    function updateDots() {
        const scrollTop = document.querySelector('.intro').scrollTop;
        const viewport = window.innerHeight;
        let activeIndex = 0;
        panels.forEach((panel, idx) => {
            const top = panel.offsetTop;
            if (scrollTop + viewport/2 >= top) activeIndex = idx;
        });
        Array.from(dots.children).forEach((li, i) => li.classList.toggle('active', i === activeIndex));
    }

    function onScroll() {
        const container = document.querySelector('.intro');
        const max = container.scrollHeight - container.clientHeight;
        const pct = max > 0 ? (container.scrollTop / max) * 100 : 0;
        if (progressBar) progressBar.style.width = pct + '%';
        updateDots();
        // 跑马线速度轻微受滚动影响，增强动势
        const track = document.querySelector('.marquee .track');
        if (track) {
            const base = container.scrollTop * 0.03; // 略增强联动
            track.style.transform = `translateX(${-base}%)`;
        }
    }

    function onDotClick(e) {
        const target = e.target;
        if (target.tagName === 'LI' && target.dataset.target) {
            const idx = parseInt(target.dataset.target, 10);
            const container = document.querySelector('.intro');
            const panel = panels[idx];
            if (panel) container.scrollTo({ top: panel.offsetTop, behavior: 'smooth' });
        }
    }

    enterBtn && enterBtn.addEventListener('click', enterApp);
    skipBtn && skipBtn.addEventListener('click', enterApp);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('DOMContentLoaded', () => {
        setupRevealOnScroll();
        splitLines();
        revealOnScroll();
        const container = document.querySelector('.intro');
        container && container.addEventListener('scroll', onScroll, { passive: true });
        dots && dots.addEventListener('click', onDotClick);
        onScroll();
        // 进入按钮保留
    });
})();

