// Variables del juego
let nivel;
let puntaje = 0;
let ejercicios = [];
let ejercicioActual = 0;
let tiempoRestante = 60; // 1 minuto inicial
let intervalo;
const tiempoPorEjercicio = 60; // 60 segundos = 1 minuto

// Base de datos de ejercicios (simulada)
const exercisesDB = {
    facil: [
        {
            ejercicio: "Calcula la distancia recorrida por un coche que viaja a 50 km/h durante 3 horas (en km).",
            respuesta: "150",
            explicacion: "Usando la fórmula d = v × t: 50 km/h × 3 h = 150 km"
        },
        {
            ejercicio: "Un objeto se mueve con velocidad constante de 8 m/s durante 5 segundos. ¿Qué distancia recorre? (en metros)",
            respuesta: "40",
            explicacion: "d = v × t = 8 m/s × 5 s = 40 m"
        },
        {
            ejercicio: "Calcula la energía cinética de un objeto de 4 kg que se mueve a 3 m/s (en joules).",
            respuesta: "18",
            explicacion: "Ec = (1/2) × m × v² = 0.5 × 4 × 9 = 18 J"
        },
        {
            ejercicio: "Si un tren recorre 240 km en 4 horas, ¿cuál es su velocidad media? (en km/h)",
            respuesta: "60",
            explicacion: "v = d/t = 240 km / 4 h = 60 km/h"
        }
    ],
    intermedio: [
        {
            ejercicio: "Un coche acelera de 0 a 20 m/s en 5 segundos. Calcula su aceleración (en m/s²).",
            respuesta: "4",
            explicacion: "a = Δv/Δt = (20 m/s - 0 m/s) / 5 s = 4 m/s²"
        },
        {
            ejercicio: "Calcula la velocidad final de un objeto que cae desde el reposo durante 3 segundos (gravedad = 9.81 m/s², en m/s).",
            respuesta: "29.43",
            explicacion: "v = v0 + a×t = 0 + 9.81×3 = 29.43 m/s"
        },
        {
            ejercicio: "Un objeto se lanza hacia arriba a 15 m/s. ¿Cuál es su velocidad después de 1 segundo? (gravedad = 9.81 m/s², en m/s)",
            respuesta: "5.19",
            explicacion: "v = v0 - g×t = 15 - 9.81×1 ≈ 5.19 m/s"
        },
        {
            ejercicio: "Calcula la distancia recorrida por un objeto que acelera a 2 m/s² desde el reposo durante 6 segundos (en metros).",
            respuesta: "36",
            explicacion: "d = v0×t + (1/2)×a×t² = 0 + 0.5×2×36 = 36 m"
        }
    ],
    dificil: [
        {
            ejercicio: "Un coche frena de 25 m/s a 5 m/s en 4 segundos. Calcula su aceleración (en m/s²).",
            respuesta: "-5",
            explicacion: "a = (v - v0)/t = (5 - 25)/4 = -5 m/s² (negativa porque frena)"
        },
        {
            ejercicio: "Calcula la altura máxima alcanzada por un objeto lanzado verticalmente a 19.62 m/s (gravedad = 9.81 m/s², en metros).",
            respuesta: "19.62",
            explicacion: "h = v0²/(2g) = (19.62)²/(2×9.81) = 19.62 m"
        },
        {
            ejercicio: "Un objeto cae desde 44.1 metros. ¿Cuánto tiempo tarda en llegar al suelo? (gravedad = 9.81 m/s², en segundos)",
            respuesta: "3",
            explicacion: "t = √(2h/g) = √(2×44.1/9.81) = √9 = 3 s"
        },
        {
            ejercicio: "Calcula la fuerza necesaria para acelerar un objeto de 10 kg a 3 m/s² (en newtons).",
            respuesta: "30",
            explicacion: "F = m × a = 10 kg × 3 m/s² = 30 N"
        }
    ]
};

// Referencias a los ejercicios por nivel
const ejerciciosFacil = exercisesDB.facil;
const ejerciciosIntermedio = exercisesDB.intermedio;
const ejerciciosDificil = exercisesDB.dificil;

// Event listeners
document.getElementById('facil').addEventListener('click', () => iniciarJuego('facil'));
document.getElementById('intermedio').addEventListener('click', () => iniciarJuego('intermedio'));
document.getElementById('dificil').addEventListener('click', () => iniciarJuego('dificil'));
document.getElementById('submit-btn').addEventListener('click', verificarRespuesta);
document.querySelector('.restart-btn').addEventListener('click', reiniciarJuego);
document.getElementById('respuesta').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verificarRespuesta();
    }
});

// Función para iniciar el juego
function iniciarJuego(nivelSeleccionado) {
    nivel = nivelSeleccionado;
    
    // Seleccionar ejercicios según el nivel
    if (nivel === 'facil') {
        ejercicios = [...ejerciciosFacil];
    } else if (nivel === 'intermedio') {
        ejercicios = [...ejerciciosIntermedio];
    } else {
        ejercicios = [...ejerciciosDificil];
    }
    
    // Verificar que hay ejercicios cargados
    if (ejercicios.length === 0) {
        alert("Error: No se pudieron cargar los ejercicios. Por favor intenta de nuevo.");
        return;
    }
    
    // Mezclar ejercicios
    ejercicios = mezclarArray(ejercicios);
    
    // Inicializar variables
    puntaje = 0;
    ejercicioActual = 0;
    tiempoRestante = tiempoPorEjercicio;
    
    // Mostrar pantalla de juego
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('juego').style.display = 'block';
    document.getElementById('final').style.display = 'none';
    
    // Mostrar primer ejercicio
    mostrarEjercicio();
    
    // Iniciar temporizador
    iniciarTemporizador();
}

// Función para mezclar array
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para mostrar el ejercicio actual
function mostrarEjercicio() {
    if (ejercicioActual < ejercicios.length) {
        // Mostrar ejercicio
        document.getElementById('ejercicio').textContent = ejercicios[ejercicioActual].ejercicio;
        document.getElementById('respuesta').value = '';
        document.getElementById('mensaje').textContent = '';
        document.getElementById('respuesta').focus();
        
        // Actualizar barra de progreso
        const progreso = (ejercicioActual / ejercicios.length) * 100;
        document.getElementById('progress-bar').style.width = `${progreso}%`;
        
        // Actualizar puntaje
        document.getElementById('puntaje').textContent = `Puntaje: ${puntaje}/${ejercicios.length}`;
        
        // Reiniciar temporizador
        reiniciarTemporizador();
    } else {
        // Fin del juego
        finalizarJuego();
    }
}

// Función para verificar la respuesta
function verificarRespuesta() {
    const respuestaUsuario = document.getElementById('respuesta').value.trim();
    const respuestaCorrecta = ejercicios[ejercicioActual].respuesta;

    // Detener temporizador
    clearInterval(intervalo);

    // Verificar respuesta
    let esCorrecta = false;
    if (respuestaUsuario.toLowerCase() === respuestaCorrecta.toLowerCase()) {
        puntaje++;
        esCorrecta = true;
        document.getElementById('mensaje').textContent = "¡Correcto! " + ejercicios[ejercicioActual].explicacion;
        document.getElementById('mensaje').style.color = "#2ecc71";
    } else {
        document.getElementById('mensaje').textContent = `Incorrecto. La respuesta correcta es: ${respuestaCorrecta}. ${ejercicios[ejercicioActual].explicacion}`;
        document.getElementById('mensaje').style.color = "#e74c3c";
    }

    // Guardar resultado para el admin
    if (typeof saveExerciseResult === "function") {
        // Guardar el resultado del ejercicio actual
        saveExerciseResult(
            ejercicioActual + 1, // o usa un ID único si tienes
            nivel,
            esCorrecta ? 1 : 0
        );
    }

    // Pasar al siguiente ejercicio después de 2 segundos
    ejercicioActual++;
    setTimeout(() => {
        if (ejercicioActual < ejercicios.length) {
            mostrarEjercicio();
            iniciarTemporizador();
        } else {
            finalizarJuego();
        }
    }, 2000);
}

// Función para iniciar el temporizador
function iniciarTemporizador() {
    reiniciarTemporizador();
    intervalo = setInterval(actualizarTemporizador, 1000);
}

// Función para reiniciar el temporizador
function reiniciarTemporizador() {
    tiempoRestante = tiempoPorEjercicio;
    actualizarDisplayTemporizador();
    document.getElementById('timer').classList.remove('urgente');
}

// Función para actualizar el display del temporizador
function actualizarDisplayTemporizador() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    const tiempoFormateado = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    document.getElementById('timer').textContent = `Tiempo: ${tiempoFormateado}`;
}

// Función para actualizar el temporizador
function actualizarTemporizador() {
    tiempoRestante--;
    actualizarDisplayTemporizador();
    
    // Cambiar estilo cuando queda poco tiempo
    if (tiempoRestante <= 10) {
        document.getElementById('timer').classList.add('urgente');
    }
    
    // Tiempo agotado
    if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        document.getElementById('mensaje').textContent = `¡Tiempo agotado! La respuesta era: ${ejercicios[ejercicioActual].respuesta}. ${ejercicios[ejercicioActual].explicacion}`;
        document.getElementById('mensaje').style.color = "#e74c3c";
        
        // Pasar al siguiente ejercicio después de 2 segundos
        ejercicioActual++;
        setTimeout(() => {
            if (ejercicioActual < ejercicios.length) {
                mostrarEjercicio();
                iniciarTemporizador();
            } else {
                finalizarJuego();
            }
        }, 2000);
    }
}

// Función para finalizar el juego
function finalizarJuego() {
    clearInterval(intervalo);
    
    // Asegurarse de que tenemos ejercicios cargados
    const totalEjercicios = ejercicios.length > 0 ? ejercicios.length : 1;
    const puntajeFinal = puntaje > 0 ? puntaje : 0;
    
    // Mostrar pantalla final
    document.getElementById('juego').style.display = 'none';
    document.getElementById('final').style.display = 'block';
    
    // Mostrar resultados
    document.getElementById('final-score').textContent = `${puntajeFinal}/${totalEjercicios}`;
    
    // Mensaje según el puntaje
    let porcentaje = (puntajeFinal / totalEjercicios) * 100;
    let mensaje = "";
    
    if (ejercicios.length === 0) {
        mensaje = "Ocurrió un error al cargar los ejercicios. Por favor intenta de nuevo.";
    } else if (porcentaje >= 80) {
        mensaje = "¡Excelente trabajo! Eres un experto en física.";
    } else if (porcentaje >= 50) {
        mensaje = "Buen trabajo, pero puedes mejorar. ¡Sigue practicando!";
    } else {
        mensaje = "No te rindas. Revisa los conceptos y vuelve a intentarlo.";
    }
    
    document.getElementById('resultado-mensaje').textContent = mensaje;
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Resetear todas las variables del juego
    puntaje = 0;
    ejercicioActual = 0;
    tiempoRestante = tiempoPorEjercicio;
    ejercicios = [];
    
    document.getElementById('final').style.display = 'none';
    document.getElementById('inicio').style.display = 'block';
}