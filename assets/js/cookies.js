document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    // Проверка выбора
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    // Кнопка "Принять" теперь просто закрывает баннер
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.classList.remove('show');
        console.log("Согласие получено, но сбор данных не ведется.");
    });

    // Кнопка "Отклонить"
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'false');
        cookieBanner.classList.remove('show');
    });
});

// Мы удалили вызов счетчиков внутри этой функции
function loadAnalytics() {
    // Здесь пусто. Никакого кода Яндекс.Метрики или Google Analytics.
}