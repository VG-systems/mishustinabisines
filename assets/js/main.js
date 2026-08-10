document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. УПРАВЛЕНИЕ ТЕМОЙ
    // ==========================================
    const themeBtn = document.getElementById('themeToggle');
    const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeBtn) themeBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // ==========================================
    // 2. АНИМАЦИЯ ПРИ СКРОЛЛЕ
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // ==========================================
    // 3. МОБИЛЬНОЕ МЕНЮ
    // ==========================================
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenuLinks = document.querySelectorAll('#mobileMenu a');

    if (burgerBtn && mobileMenu) {
        const toggleMenu = (isOpen) => {
            mobileMenu.classList.toggle('is-open', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };
        burgerBtn.addEventListener('click', () => toggleMenu(true));
        if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
        mobileMenuLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    }

    // ==========================================
    // 4. КНОПКА "НАВЕРХ"
    // ==========================================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.scrollY > 400);
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 5. STYLISH MODAL (LIGHTBOX)
    // ==========================================
    const modal = document.getElementById('mediaModal');
    const modalContainer = document.getElementById('modalContainer');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.querySelector('.modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    // Находим все картинки и видео, которые хотим открывать
    // Добавляем класс 'zoomable' к основным картинкам кейсов для подсветки курсора
    const images = document.querySelectorAll('.case-hero-img, .project-img, .pdf-grid-2 img, .pdf-grid-3 img, .gallery-2-col img');
    const videos = document.querySelectorAll('video');

    function openModal(content, captionText) {
        modalContainer.innerHTML = ''; // Очистка
        modalContainer.appendChild(content);
        modalCaption.textContent = captionText || '';
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        // Останавливаем видео при закрытии
        const video = modalContainer.querySelector('video');
        if (video) video.pause();
        setTimeout(() => { modalContainer.innerHTML = ''; }, 400);
    }

    // Обработка кликов по КАРТИНКАМ
    images.forEach(img => {
        img.classList.add('zoomable'); // Добавляем курсор лупы
        img.addEventListener('click', (e) => {
            e.preventDefault(); // Если картинка внутри ссылки
            const clone = img.cloneNode();
            clone.style = ""; // Сбрасываем стили сетки
            clone.className = ""; // Сбрасываем классы
            openModal(clone, img.alt);
        });
    });

    // Обработка кликов по ВИДЕО
    videos.forEach(video => {
        const container = video.closest('.video-container');
        if (container) container.classList.add('zoomable');
        
        video.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Создаем новый элемент видео для модалки
            const videoClone = document.createElement('video');
            videoClone.controls = true;
            videoClone.autoplay = true;
            videoClone.playsInline = true;
            videoClone.muted = false; // В модалке включаем звук
            videoClone.style.width = "100%";
            
            // Копируем все источники (sources) из оригинального видео
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                const newSource = document.createElement('source');
                newSource.src = source.src;
                newSource.type = source.type;
                videoClone.appendChild(newSource);
            });

            openModal(videoClone, "Видео-презентация");
        });
    });

    // Закрытие
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
});


// ==========================================
    // 6. PWA INITIALIZATION
    // ==========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('PWA ServiceWorker registered: ', registration.scope);
                })
                .catch(err => {
                    console.log('PWA ServiceWorker registration failed: ', err);
                });
        });
    }