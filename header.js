// Shared header functionality for all pages
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburgerBtn.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
});

// Scroll effect for landing bar
window.addEventListener('scroll', () => {
    const landingBar = document.querySelector('.landing_bar');
    if (landingBar) {
        if (window.scrollY > 50) {
            landingBar.classList.add('scrolled');
        } else {
            landingBar.classList.remove('scrolled');
        }
    }
});