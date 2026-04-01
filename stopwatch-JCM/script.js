/**
 * Clase encargada exclusivamente de la lógica del tiempo y estado del cronómetro.
 * Cumple con el Principio de Responsabilidad Única (SRP) de SOLID.
 * Utiliza performance.now() y requestAnimationFrame() para alta precisión.
 */
class StopwatchLogic {
    constructor(onTickCallback) {
        // Callback para inyectar la dependencia de actualización de la UI
        this.onTickCallback = onTickCallback; 
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.animationFrameId = null;
    }

    /**
     * Inicia o reinicia el cronómetro desde 0.
     * Registra log de información al iniciar.
     */
    start() {
        if (this.isRunning) {
            // Criterio de Aceptación AC3: Reinicia si ya está corriendo
            this.elapsedTime = 0;
            this.startTime = performance.now();
            console.info("[Log] Cronómetro reiniciado desde 0.");
        } else {
            // Inicio normal
            this.isRunning = true;
            this.elapsedTime = 0; 
            this.startTime = performance.now();
            console.info("[Log] Cronómetro iniciado desde 0.");
            this._tick(); // Inicia el bucle de actualización
        }
    }

    /**
     * Detiene el cronómetro congelando el tiempo.
     * Registra log de información al detener.
     * Ignora la acción si ya está detenido (AC4).
     */
    stop() {
        if (!this.isRunning) {
            // Criterio de Aceptación AC4: Ignora si ya está detenido
            return;
        }
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        console.info("[Log] Cronómetro detenido.");
    }

    /**
     * Bucle de actualización de alta frecuencia que calcula el tiempo transcurrido.
     * Se ejecuta recursivamente usando requestAnimationFrame().
     * @private
     */
    _tick() {
        if (!this.isRunning) return;

        // Cálculo preciso del tiempo transcurrido
        this.elapsedTime = performance.now() - this.startTime;
        
        // Formateo de los datos crudos a unidades legibles
        const timeData = this._formatTime(this.elapsedTime);
        
        // Ejecución del callback inyectado para actualizar la UI
        this.onTickCallback(timeData);

        // Solicitud del próximo frame de animación
        this.animationFrameId = requestAnimationFrame(this._tick.bind(this));
    }

    /**
     * Convierte milisegundos crudos en un objeto formateado con horas, minutos, segundos y milisegundos.
     * Asegura el padding de ceros a la izquierda.
     * @param {number} ms - Tiempo transcurrido en milisegundos.
     * @returns {Object} Objeto con las unidades de tiempo formateadas como strings.
     * @private
     */
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
 * Clase encargada exclusivamente de manejar la interfaz de usuario (DOM).
 * Cumple con SOLID al separar la manipulación del DOM de la lógica de tiempo.
 */
class StopwatchUI {
    constructor() {
        // Caché de elementos del DOM para optimizar accesos
        this.displayElement = document.getElementById('display');
        this.msDisplayElement = document.getElementById('ms-display');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');

        // Instanciación de la lógica, inyectando el método de actualización de la UI
        // Envolvemos la actualización en un try...catch como se solicitó
        this.stopwatchLogic = new StopwatchLogic((timeData) => {
            this._safeUpdateDisplay(timeData);
        });

        this._bindEvents();
        console.info("[Log] Interfaz de usuario inicializada. Esperando interacción.");
    }

    /**
     * Vincula los event listeners a los botones de control.
     * Enuelve los handlers en try...catch para manejo robusto de excepciones.
     * @private
     */
    _bindEvents() {
        this.startBtn.addEventListener('click', () => {
            try {
                this.stopwatchLogic.start();
            } catch (error) {
                console.error("[Error] Excepción capturada al intentar iniciar el cronómetro:", error);
            }
        });

        this.stopBtn.addEventListener('click', () => {
            try {
                this.stopwatchLogic.stop();
            } catch (error) {
                console.error("[Error] Excepción capturada al intentar detener el cronómetro:", error);
            }
        });
    }

    /**
     * Actualiza los elementos del DOM de forma segura capturando posibles excepciones.
     * @param {Object} timeData - Objeto con los strings de tiempo formateados.
     * @private
     */
    _safeUpdateDisplay(timeData) {
        try {
            this.displayElement.textContent = `${timeData.hours}:${timeData.minutes}:${timeData.seconds}`;
            this.msDisplayElement.textContent = timeData.milliseconds;
        } catch (error) {
            // Registro detallado del error en consola como se solicitó
            console.error("[Error] Excepción capturada durante la actualización del DOM:", error);
            this.stopwatchLogic.stop(); // Parada de seguridad de la lógica si falla la UI
        }
    }
}

// Inicialización de la aplicación una vez que el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    try {
        new StopwatchUI();
    } catch (error) {
        console.error("[Error] Excepción fatal durante la inicialización de la aplicación:", error);
    }
});