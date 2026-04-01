# Prompts utilizados

Sólo fue necesario 1 prompt.
Luego de la revisión, me hicieron los siguientes comentarios:

```text
Buen trabajo sacando una solución funcional 👍

Para mejorar el prompting:

Hay algunos errores/typos y ambigüedades que abren demasiado la interpretación del modelo.
Expresiones como “logs necesarios” o “manejar excepciones” deberían ser más concretas.
💡 Recomendación:

Cierra con una versión final limpia del prompt.
Añade criterios de aceptación verificables.
Elimina la carpeta template
Con un poco más de precisión, el resultado puede mejorar mucho 🚀

```

Por lo que generé un segundo prompt.

## Prompt 1

### Modelo
Gemini 3.1 Pro

### Prompt

Crea una página web que implementa un StopWatch.

Criterios técnicos:
- Separa el html y el javascript en los archivos de partida que te estoy suministrando: index.html y script.js. No puedes crear otro archivos. La funcionalidad debe estar en el .js.
- Usa sólo Vanilla JS
- Aplica principio SOLID
- Implementa los logs que sean necesarios en la consola.
- Atrapa (Catch) las posibles excepciones.
- Para el CSS usa tailwind
- Haz que el sitio sea responsive


Criterios funcionales:
- La pagina comienza el el cronómetro en 0.
- Cuando el usuario pulsa "Start" el cronómetro comienza a correr.
- Cuando el usuario pulsa "Stop" el cronómetro se para.
- Si el usuario pulsa "Start" mientras el cronómetro está corriendo, comienza a contar desde 0 de nuevo.
- Si el usuario pulsa "Stop" con el cronómetro detenido no pasa nada.

Diseño:
- Te adjunto el archivo stopwatch.png para que lo tengas de referencia para el diseño.

Preguntame si necesitas más información para construir la aplicación web.

### Iteraciones

No hizo comentarios ni preguntas, directamente arrojó la solución correcta.

### Comentarios

Me advirtió que solo podía arrojarme el `.html` porque necesitaba que el JavaScript estuviera dentro del mismo para correr, pero la adaptación en mi ordenador fue trivial.

## Prompt 2

### Modelo

Gemini 3.1 Pro

### Prompt

Prompt Refactorizado:

Actúa como un desarrollador Frontend Senior. Crea una página web que implemente un Cronómetro (StopWatch).

Criterios Arquitectónicos y Técnicos:

Archivos: Separa la vista y la lógica usando exclusivamente los archivos index.html y script.js.

Tecnología: Utiliza Vanilla JavaScript (ES6+).

Diseño de Software (SOLID): Separa las responsabilidades. Implementa una clase para la lógica del tiempo y otra clase independiente para la actualización del DOM.

Precisión: Utiliza performance.now() junto con requestAnimationFrame() para el cálculo del tiempo (no uses setInterval).

Manejo de Excepciones: Usa bloques try...catch específicamente en las funciones que renderizan datos en el DOM y en los event listeners principales.

Trazabilidad (Logs): Registra un console.info exclusivamente cuando haya un cambio de estado ("Iniciado desde 0", "Detenido"). Registra un console.error si se captura una excepción.

UI/UX: Utiliza Tailwind CSS (vía CDN) para replicar el diseño de la imagen adjunta stopwatch.png. El diseño debe ser responsive (Mobile First).

Criterios de Aceptación (Comportamiento Funcional Verificable):

AC1: Al inicializar, el display debe mostrar exactamente 00:00:00 con 000 milisegundos.

AC2: Al hacer clic en "Start", el tiempo comienza a correr.

AC3: Si se hace clic en "Start" mientras el cronómetro está en marcha, el contador se reinicia instantáneamente a 0 y continúa corriendo.

AC4: Al hacer clic en "Stop", el tiempo se congela. Si se hace clic en "Stop" estando el cronómetro ya detenido, la aplicación ignora la acción silenciosamente (sin errores).
