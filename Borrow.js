window.addEventListener('DOMContentLoaded', async () => {
  const signupForm = document.getElementById('signupForm');
  const signupMessage = document.getElementById('message');
  const signupModal = document.getElementById('signupModal');

  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  const loginModal = document.getElementById('loginModal');

  // Helper functions for modals
  window.openLogin = () => {
    if (signupModal) signupModal.style.display = 'none';
    if (loginModal) loginModal.style.display = 'block';
    document.body.classList.add('modal-open');
  };

  window.openSignup = () => {
    if (loginModal) loginModal.style.display = 'none';
    if (signupModal) signupModal.style.display = 'block';
    document.body.classList.add('modal-open');
  };

  const closeAllModals = () => {
    if (loginModal) loginModal.style.display = 'none';
    if (signupModal) signupModal.style.display = 'none';
    document.body.classList.remove('modal-open');
  };

  // 1. Session state check
  let currentUser = null;
  if (window.supabase) {
    const { data: { session } } = await window.supabase.auth.getSession();
    if (session?.user) {
      currentUser = session.user;
      updateNavForLoggedInUser(currentUser);
    }
  }

  // 2. Global Click Listener for Modals & Protected Features
  document.addEventListener('click', (e) => {
    // Protected Links ("Learn More" / Feature cards)
    const learnMoreTrigger = e.target.closest('.protected-feature');
    if (learnMoreTrigger) {
      e.preventDefault();
      if (!currentUser) {
        openLogin();
        if (loginMessage) {
          loginMessage.innerText = 'Please login to access dashboard features!';
          loginMessage.style.color = '#ef4444';
        }
      } else {
        window.location.href = 'dashboard.html';
      }
      return;
    }

    // Modal Triggers
    if (e.target.matches('#Login-btn')) {
      e.preventDefault();
      openLogin();
      return;
    }

    if (e.target.matches('#Register-btn')) {
      e.preventDefault();
      openSignup();
      return;
    }

    if (e.target.matches('#switchToLogin')) {
      e.preventDefault();
      openLogin();
      return;
    }

    if (e.target.matches('#switchToRegister')) {
      e.preventDefault();
      openSignup();
      return;
    }

    if (e.target.closest('.close-btn')) {
      e.preventDefault();
      closeAllModals();
      return;
    }

    if (e.target === loginModal || e.target === signupModal) {
      closeAllModals();
    }
  });

  // 3. Sign Up Handler
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullNameInput = signupForm.querySelector('input[placeholder="Full Name"]');
      const emailInput = signupForm.querySelector('input[placeholder="Email ID"]');
      const studentIdInput = signupForm.querySelector('input[placeholder="Student ID"]');
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirmPassword');

      const fullName = fullNameInput ? fullNameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const studentId = studentIdInput ? studentIdInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';
      const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

      if (password !== confirmPassword) {
        if (signupMessage) {
          signupMessage.innerText = 'Passwords do not match!';
          signupMessage.style.color = 'red';
        }
        return;
      }

      if (signupMessage) {
        signupMessage.innerText = 'Creating account...';
        signupMessage.style.color = '#333';
      }

      const { data, error } = await window.supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            student_id: studentId,
          },
        },
      });

      if (error) {
        if (signupMessage) {
          signupMessage.innerText = 'Error: ' + error.message;
          signupMessage.style.color = 'red';
        }
      } else {
        if (signupMessage) {
          signupMessage.innerText = 'Registration successful! Check your email for confirmation.';
          signupMessage.style.color = 'green';
        }
        signupForm.reset();

        setTimeout(() => {
          closeAllModals();
          if (signupMessage) signupMessage.innerText = '';
        }, 2000);
      }
    });
  }

  // 4. Login Handler
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = loginForm.querySelector('input[placeholder="Registered Email ID"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (loginMessage) {
        loginMessage.innerText = 'Logging in...';
        loginMessage.style.color = '#333';
      }

      const { data, error } = await window.supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        if (loginMessage) {
          loginMessage.innerText = 'Error: ' + error.message;
          loginMessage.style.color = 'red';
        }
      } else {
        if (loginMessage) {
          loginMessage.innerText = 'Login successful! Redirecting...';
          loginMessage.style.color = 'green';
        }

        setTimeout(() => {
          closeAllModals();
          loginForm.reset();
          window.location.href = 'dashboard.html';
        }, 800);
      }
    });
  }
});

// Helper function to update Navbar
function updateNavForLoggedInUser(user) {
  const fullName = user?.user_metadata?.full_name || 'Student';
  const navAuth = document.querySelector('.nav-auth');
  if (navAuth) {
    navAuth.innerHTML = `
      <a href="dashboard.html" style="color: #6d28d9; margin-right: 8px;">Dashboard</a>
      <span style="color: #121212; font-size: 14px; margin-right: 10px;">Hi, ${fullName}</span>
      <a href="#" class="logout-btn" style="color: #fff; padding: 6px 12px; background: #ef4444; border-radius: 8px; font-size: 14px;">Logout</a>
    `;
  }

  document.querySelectorAll('.logout-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await window.supabase.auth.signOut();
      window.location.reload();
    });
  });
}
