/**
 * Clase encargada ÚNICAMENTE de la lógica de tiempo y estado.
 * (Single Responsibility Principle)
 */
class StopWatchLogic {
    constructor(onTickCallback) {
        // Callback para inyectar la dependencia de la UI (Dependency Inversion/Open-Closed)
        this.onTick = onTickCallback; 
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.animationFrameId = null;
    }

    start() {
        try {
            if (this.isRunning) {
                // Requisito: Si pulsa Start mientras corre, comienza desde 0.
                console.log("[LOG] Reiniciando el cronómetro desde 0...");
                this.elapsedTime = 0;
                this.startTime = performance.now();
            } else {
                // Inicio normal
                console.log("[LOG] Iniciando el cronómetro...");
                this.isRunning = true;
                // Ajustamos el startTime por si hubiera tiempo pausado acumulado 
                // (aunque tu lógica pide que si se detiene y luego start, empieza de 0. 
                // Modificado abajo para cumplir estrictamente tus reglas).
                
                // NOTA: Según tus reglas "Si pulsa Start mientras corre, comienza a contar desde 0 de nuevo".
                // Asumiremos que si estaba detenido y pulsa Start, también empieza de 0 basado en un uso típico,
                // o retoma. Lo haré para que SIEMPRE que se pulse Start, empiece desde 0 para mantener simplicidad y cumplir tu regla.
                this.elapsedTime = 0; 
                this.startTime = performance.now();
                this._tick(); // Iniciamos el bucle
            }
        } catch (error) {
            console.error("[ERROR] Excepción al intentar iniciar el cronómetro:", error);
        }
    }

    stop() {
        try {
            if (!this.isRunning) {
                // Requisito: Si pulsa Stop estando detenido, no pasa nada.
                console.log("[LOG] Stop ignorado. El cronómetro ya estaba detenido.");
                return;
            }
            console.log("[LOG] Deteniendo el cronómetro...");
            this.isRunning = false;
            cancelAnimationFrame(this.animationFrameId);
        } catch (error) {
            console.error("[ERROR] Excepción al intentar detener el cronómetro:", error);
        }
    }

    // Método privado (convención) que actúa como bucle de control
    _tick() {
        if (!this.isRunning) return;

        try {
            // Calculamos el delta de tiempo exacto
            this.elapsedTime = performance.now() - this.startTime;
            
            // Formateamos y pasamos los datos a la UI
            const formattedTime = this._formatTime(this.elapsedTime);
            this.onTick(formattedTime);

            // Solicitamos el próximo frame recursivamente
            this.animationFrameId = requestAnimationFrame(this._tick.bind(this));
        } catch (error) {
            console.error("[ERROR] Excepción en el ciclo de actualización (tick):", error);
            this.stop(); // Parada de seguridad
        }
    }

    // Método de utilidad para convertir milisegundos a formato legible
    _formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const milliseconds = String(Math.floor(ms % 1000)).padStart(3, '0');
        
        return { hours, minutes, seconds, milliseconds };
    }
}

/**
 * Clase encargada ÚNICAMENTE de interactuar con el DOM.
 */
class StopWatchUI {
    constructor() {
        // Referencias al DOM
        this.timeDisplay = document.getElementById('time-display');
        this.msDisplay = document.getElementById('ms-display');
        this.btnStart = document.getElementById('btn-start');
        this.btnStop = document.getElementById('btn-stop');

        // Instanciamos la lógica inyectando el método de actualización
        this.stopWatchLogic = new StopWatchLogic(this.updateDisplay.bind(this));

        this._bindEvents();
        console.log("[LOG] Interfaz de usuario inicializada. Cronómetro en 0.");
    }

    _bindEvents() {
        this.btnStart.addEventListener('click', () => {
            this.stopWatchLogic.start();
        });

        this.btnStop.addEventListener('click', () => {
            this.stopWatchLogic.stop();
        });
    }

    // Método que recibe los datos procesados y los pinta en pantalla
    updateDisplay(timeData) {
        try {
            this.timeDisplay.textContent = `${timeData.hours}:${timeData.minutes}:${timeData.seconds}`;
            this.msDisplay.textContent = timeData.milliseconds;
        } catch (error) {
            console.error("[ERROR] Excepción al actualizar el DOM:", error);
        }
    }
}

// Inicializamos la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    new StopWatchUI();
});
