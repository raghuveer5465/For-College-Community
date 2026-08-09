window.addEventListener('scroll', () => {
    const landingBar = document.querySelector('.landing_bar');
    if (window.scrollY > 50) {
        landingBar.classList.add('scrolled');
    } else {
        landingBar.classList.remove('scrolled');
    }
});
const modal = document.getElementById("signupModal");
const registerBtn = document.getElementById("Register-btn");
const closeBtn = document.getElementById("closeModalBtn");
const overlay = document.getElementById("modalOverlay");
const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");
registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "block";
    document.body.classList.add("modal-open");
});
function closeModal() {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        message.style.color = "#f87171";
        message.innerHTML = "Passwords do not match";
        return;
    }

    message.style.color = "#4ade80";
    message.innerHTML = "Account Created Successfully!";
    signupForm.reset();
});
// LOGIN Page
const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("Login-btn");
const closeLoginBtn = document.getElementById("closeLoginModalBtn");
const loginOverlay = document.getElementById("loginModalOverlay");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const switchToRegister = document.getElementById("switchToRegister");

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "block";
    document.body.classList.add("modal-open");
});

function closeLoginModal() {
    loginModal.style.display = "none";
    document.body.classList.remove("modal-open");
}

closeLoginBtn.addEventListener("click", closeLoginModal);
loginOverlay.addEventListener("click", closeLoginModal);

switchToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    closeLoginModal();
    modal.style.display = "block";
    document.body.classList.add("modal-open");
});

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    loginMessage.style.color = "#4ade80";
    loginMessage.innerHTML = "Logging in...";
    
    setTimeout(() => {
        loginForm.reset();
        loginMessage.innerHTML = "";
        closeLoginModal();
    }, 1500);
});
const switchToLogin = document.getElementById("switchToLogin");

switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
    loginModal.style.display = "block";
    document.body.classList.add("modal-open");
});
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navLinks = document.getElementById("navLinks");

hamburgerBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburgerBtn.classList.toggle("active");
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
});
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburgerBtn.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
    });
});
document.getElementById("Login-btn-mobile").addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "block";
    document.body.classList.add("modal-open");
});
document.getElementById("Register-btn-mobile").addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "block";
    document.body.classList.add("modal-open");
});