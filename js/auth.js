// Constantes
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  APP_DATA: 'appData'
};

// Configuración inicial
const INITIAL_APP_DATA = {
  users: [
    {
      id: 1,
      name: "Admin",
      email: "admin@fisica.com",
      password: "admin123",
      role: USER_ROLES.ADMIN,
      lastLogin: null,
      completedExercises: [],
      scores: []
    }
  ],
  exercises: {
    facil: [],
    intermedio: [],
    dificil: []
  },
  activity: {
    exerciseSubmissions: [],
    dailyLogins: {}
  }
};

// Estado de la aplicación
let appData = JSON.parse(localStorage.getItem(STORAGE_KEYS.APP_DATA)) || INITIAL_APP_DATA;
let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;

// Función para guardar datos
function saveAppData() {
  localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(appData));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
}

// Función para mostrar mensajes
function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}

// Función de login mejorada
function login(email, password) {
  try {
    if (!email || !password) {
      showMessage('login-message', 'Email y contraseña son requeridos', 'error');
      return false;
    }

    const cleanEmail = email.toString().toLowerCase().trim();
    const cleanPassword = password.toString().trim();

    const user = appData.users.find(u => 
      u.email.toString().toLowerCase().trim() === cleanEmail && 
      u.password.toString().trim() === cleanPassword
    );

    if (!user) {
      showMessage('login-message', 'Credenciales incorrectas', 'error');
      return false;
    }

    // Actualizar usuario
    currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Actualizar último login
    user.lastLogin = new Date().toISOString();
    const today = new Date().toISOString().split('T')[0];
    appData.activity.dailyLogins[today] = (appData.activity.dailyLogins[today] || 0) + 1;
    
    saveAppData();

    showMessage('login-message', '¡Inicio de sesión exitoso! Redirigiendo...', 'success');
    
    // Redirección después de 1 segundo
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);

    return true;
  } catch (error) {
    console.error('Error en login:', error);
    showMessage('login-message', 'Error técnico al iniciar sesión', 'error');
    return false;
  }
}

// Función de registro
function register(name, email, password, confirmPassword) {
  try {
    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword) {
      return { success: false, message: 'Todos los campos son requeridos' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Las contraseñas no coinciden' };
    }

    if (password.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    // Verificar si el usuario ya existe
    const userExists = appData.users.some(u => 
      u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (userExists) {
      return { success: false, message: 'El correo ya está registrado' };
    }

    // Crear nuevo usuario
    const newUser = {
      id: appData.users.length + 1,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(),
      role: USER_ROLES.USER,
      completedExercises: [],
      scores: [],
      lastLogin: null
    };

    // Guardar usuario
    appData.users.push(newUser);
    saveAppData();

    return { 
      success: true, 
      message: '¡Registro exitoso! Serás redirigido...',
      shouldRedirect: true
    };
  } catch (error) {
    console.error('Error en registro:', error);
    return { 
      success: false, 
      message: 'Error técnico al registrar. Intenta nuevamente.' 
    };
  }
}

// Función para guardar los resultados de los ejercicios
function saveExerciseResult(exerciseId, level, score) {
  // Asegurarnos que currentUser existe
  if (!currentUser) {
    console.error('No hay usuario logueado');
    return;
  }

  // Crear el registro de actividad
  const submission = {
    userId: currentUser.id,
    exerciseId: exerciseId,
    level: level,
    score: score,
    date: new Date().toISOString()
  };

  // Verificar si el ejercicio ya fue registrado para este usuario
  const existingSubmission = appData.activity.exerciseSubmissions.find(
    sub => sub.userId === currentUser.id && sub.exerciseId === exerciseId
  );

  if (!existingSubmission) {
    // Agregar el nuevo registro si no existe
    appData.activity.exerciseSubmissions.push(submission);
    saveAppData();
    console.log('Resultado del ejercicio guardado:', submission);
  } else {
    console.log('Este ejercicio ya fue registrado para este usuario');
  }
}

// Configuración del formulario de login
function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      // Mostrar estado de carga
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ingresando...';
      submitBtn.disabled = true;

      // Intentar login
      const loginSuccess = login(email, password);
      
      if (!loginSuccess) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// Configuración del formulario de registro
function setupRegisterForm() {
  const registerForm = document.getElementById('signup-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm').value;

      // Mostrar estado de carga
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
      submitBtn.disabled = true;

      // Intentar registro
      const result = register(name, email, password, confirmPassword);
      
      if (result.success) {
        showMessage('register-message', result.message, 'success');
        registerForm.reset();
        
        if (result.shouldRedirect) {
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        }
      } else {
        showMessage('register-message', result.message, 'error');
      }
      
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  }
}

// Verificar autenticación al cargar
function checkAuth() {
  // Si el usuario está logueado y está en login/register, redirigir a index
  if (currentUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html'))) {
    window.location.href = 'index.html';
  }
  
  // Si no está logueado y está en una página protegida, redirigir a login
  const protectedPages = ['index.html', 'admin.html'];
  if (!currentUser && protectedPages.some(page => window.location.pathname.includes(page))) {
    window.location.href = 'login.html';
  }
}

// Actualizar UI según autenticación
function updateAuthUI() {
  if (currentUser) {
    // Mostrar elementos para usuarios autenticados
    document.querySelectorAll('.auth-only').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.unauth-only').forEach(el => el.style.display = 'none');
    
    // Mostrar nombre de usuario
    const userDisplay = document.getElementById('user-greeting');
    if (userDisplay) {
      userDisplay.textContent = `Bienvenido, ${currentUser.name}`;
      userDisplay.style.display = 'inline';
    }
    
    // Mostrar botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'inline';
    
    // Mostrar enlace a admin si es administrador
    const adminLink = document.getElementById('admin-link');
    if (adminLink && currentUser.role === USER_ROLES.ADMIN) {
      adminLink.style.display = 'inline';
    }
  } else {
    // Mostrar elementos para usuarios no autenticados
    document.querySelectorAll('.auth-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.unauth-only').forEach(el => el.style.display = 'block');
    
    // Mostrar botón de login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.style.display = 'inline';
  }
}

// Configurar toggle de formularios login/register
function setupFormToggle() {
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const loginForm = document.getElementById('login-form-container');
  const registerForm = document.getElementById('register-form-container');

  if (showRegister && showLogin) {
    showRegister.addEventListener('click', function(e) {
      e.preventDefault();
      loginForm.classList.remove('active');
      registerForm.classList.add('active');
    });

    showLogin.addEventListener('click', function(e) {
      e.preventDefault();
      registerForm.classList.remove('active');
      loginForm.classList.add('active');
    });
  }
}

// Configurar toggle de contraseña
function setupPasswordToggle() {
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });
}

// Configurar logout
function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      currentUser = null;
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      window.location.href = 'login.html';
    });
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  // Cargar datos
  const savedData = localStorage.getItem(STORAGE_KEYS.APP_DATA);
  appData = savedData ? JSON.parse(savedData) : INITIAL_APP_DATA;
  
  const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  currentUser = savedUser ? JSON.parse(savedUser) : null;

  // Verificar autenticación y rutas
  checkAuth();
  
  // Configurar eventos
  setupLoginForm();
  setupRegisterForm();
  setupFormToggle();
  setupPasswordToggle();
  setupLogout();
  updateAuthUI();
  
  // Guardar datos iniciales si no existen
  if (!savedData) {
    localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(INITIAL_APP_DATA));
  }
});