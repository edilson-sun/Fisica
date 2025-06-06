// Constantes (eliminar la segunda declaración)
const STORAGE_KEYS = {
    CURRENT_USER: 'currentUser',
    APP_DATA: 'appData'
};

// Estado inicial (eliminar la segunda declaración)
let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
let appData = JSON.parse(localStorage.getItem(STORAGE_KEYS.APP_DATA)) || {
    users: [],
    exercises: { facil: [], intermedio: [], dificil: [] },
    activity: { exerciseSubmissions: [] }
};

// Función para inicializar datos (combinar ambas implementaciones)
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.APP_DATA)) {
        // Crear admin por defecto si no existe
        if (!appData.users.some(u => u.role === 'admin')) {
            appData.users.push({
                id: 1,
                name: "Admin",
                email: "admin@fisica.com",
                password: "admin123",
                role: "admin",
                lastLogin: null
            });
        }
        
        localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(appData));
    } else {
        appData = JSON.parse(localStorage.getItem(STORAGE_KEYS.APP_DATA));
        
        // Asegurar estructura de datos
        if (!appData.activity) {
            appData.activity = { exerciseSubmissions: [] };
            saveAppData();
        }
    }
}

// Función para guardar datos (eliminar la segunda implementación)
function saveAppData() {
    localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(appData));
}

// Función para cargar progreso de usuarios (eliminar la segunda implementación)
function loadUserProgress() {
    // Conservar la primera implementación completa
    // ...
}

function mostrarConteoUsuariosActivos() {
    // Obtener todos los envíos de ejercicios
    const submissions = appData.activity.exerciseSubmissions || [];
    // Obtener IDs únicos de usuarios que han realizado al menos una actividad
    const usuariosUnicos = [...new Set(submissions.map(sub => sub.userId))];
    // Mostrar el conteo en el panel
    const totalUsuariosActivos = usuariosUnicos.length;
    const totalUsuariosSpan = document.getElementById('total-users');
    if (totalUsuariosSpan) {
        totalUsuariosSpan.textContent = totalUsuariosActivos;
    }
}

// Llama a esta función al cargar el admin
document.addEventListener('DOMContentLoaded', function() {
    // ...otras inicializaciones...
    mostrarConteoUsuariosActivos();
});