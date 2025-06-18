async function loadHeader() {
  const header = document.createElement('header');

  try {
    const response = await fetch('../partials/header.html');
    if (!response.ok) throw new Error(`Загрузка заголовка завершилась неудачей (${response.status})`);
    const htmlContent = await response.text();
    header.innerHTML = htmlContent;
    document.body.insertBefore(header, document.body.firstChild);

    loadHeaderStyles();
    setupLoginForm();
    updateHeaderCounters();
    updateAuthUI();
  } catch (err) {
    console.error("Ошибка загрузки заголовка:", err.message);
  }
}

async function loadHeaderStyles() {
  if (!document.getElementById('header-styles')) {
    const style = document.createElement('style');
    style.id = 'header-styles';
    style.textContent = await fetch('../css/header.css').then(r => r.text());
    document.head.appendChild(style);
  }
}

function setupLoginForm() {
  document.querySelector('.auth-footer a')?.addEventListener('click', function(e) {
    e.preventDefault();
    router.navigate('/registration');
  });

  const loginBtn = document.querySelector('.btn-primary');
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }
}

function updateHeaderCounters() {
  const state = JSON.parse(localStorage.getItem('futureAutoState')) || { 
    cart: [], 
    favorites: [] 
  };
  
  const cartIcon = document.getElementById('cart-icon');
  const favIcon = document.getElementById('favorites-icon');
  
  if (cartIcon) {
    if (state.cart.length > 0) {
      cartIcon.setAttribute('data-count', state.cart.length);
    } else {
      cartIcon.removeAttribute('data-count');
    }
  }
  
  if (favIcon) {
    if (state.favorites.length > 0) {
      favIcon.setAttribute('data-count', state.favorites.length);
    } else {
      favIcon.removeAttribute('data-count');
    }
  }
}

window.updateAuthUI = function() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  
  const state = JSON.parse(localStorage.getItem('futureAutoState')) || { user: null };
  const loginForm = modal.querySelector('#loginForm');
  const logoutSection = modal.querySelector('#logoutSection');
  const userIcon = document.getElementById('user-icon');
  
  if (state.user?.isAdmin) {
    const nav = document.querySelector('nav');
    const existingAdminBtn = document.querySelector('.admin-btn');
    if (!existingAdminBtn && nav) {
      const adminLink = document.createElement('a');
      adminLink.href = '#admin';
      adminLink.className = 'admin-btn';
      adminLink.textContent = 'ПАНЕЛЬ';
      nav.appendChild(adminLink);
    }
  } else {
    const adminBtn = document.querySelector('.admin-btn');
    if (adminBtn) {
      adminBtn.remove();
    }
  }
  
  if (state.user) {
    const formElements = loginForm.querySelectorAll('.form-group, .form-options, .btn-primary, .auth-footer');
    formElements.forEach(el => {
      if (el) el.style.display = 'none';
    });
    
    if (logoutSection) logoutSection.style.display = 'block';
    
    const authHeader = modal.querySelector('.auth-header h2');
    const userName = modal.querySelector('.user-name');
    const userEmail = modal.querySelector('.user-email');
    const joinDate = modal.querySelector('.user-join-date span');
    
    if (authHeader) authHeader.textContent = `Мой профиль`;
    if (userName) userName.textContent = state.user.name || state.user.email.split('@')[0];
    if (userEmail) userEmail.textContent = state.user.email;
    if (joinDate) joinDate.textContent = state.user.joinDate || new Date().toLocaleDateString();
    
    if (userIcon) {
      userIcon.classList.add('active');
      userIcon.className = 'fas fa-user-check';
    }
  } else {
    const formElements = loginForm.querySelectorAll('.form-group, .form-options, .btn-primary, .auth-footer');
    formElements.forEach(el => {
      if (el) el.style.display = '';
    });
    
    if (logoutSection) logoutSection.style.display = 'none';
    if (loginForm) loginForm.reset();
    
    const authHeader = modal.querySelector('.auth-header h2');
    if (authHeader) authHeader.textContent = 'Авторизация';
    
    if (userIcon) {
      userIcon.classList.remove('active');
      userIcon.className = 'fas fa-user';
    }
  }
};

window.openLoginModal = function() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateAuthUI();
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.handleLogin = function(e) {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  if (!emailInput || !passwordInput) return;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!email || !password) {
    showNotification('Пожалуйста, заполните все поля', 'error');
    return;
  }
  
  let state = JSON.parse(localStorage.getItem('futureAutoState')) || {
    user: null,
    cart: [],
    favorites: [],
    adminUsers: [
      { email: 'admin@futureauto.com', password: 'admin123' }
    ]
  };
  
  // Проверка на администратора
  const adminUser = state.adminUsers.find(u => u.email === email && u.password === password);
  
  if (adminUser) {
    state.user = { 
      email,
      name: 'Администратор',
      isAdmin: true,
      joinDate: new Date().toLocaleDateString()
    };
    localStorage.setItem('futureAutoState', JSON.stringify(state));
    
    closeModal('loginModal');
    updateAuthUI();
    showNotification('Вы вошли как администратор');
    return;
  }
  
  // Обычный пользователь
  state.user = { 
    email,
    name: email.split('@')[0],
    joinDate: new Date().toLocaleDateString()
  };
  
  localStorage.setItem('futureAutoState', JSON.stringify(state));
  
  closeModal('loginModal');
  updateAuthUI();
  showNotification(`Добро пожаловать, ${state.user.name}!`);
};

window.logout = function() {
  const state = JSON.parse(localStorage.getItem('futureAutoState')) || {};
  state.user = null;
  localStorage.setItem('futureAutoState', JSON.stringify(state));
  
  closeModal('loginModal');
  updateAuthUI();
  showNotification('Вы успешно вышли из системы');
};

function showNotification(message, type = 'success') {
  // Здесь можно реализовать красивые уведомления
  alert(message);
}

document.addEventListener('DOMContentLoaded', loadHeader);