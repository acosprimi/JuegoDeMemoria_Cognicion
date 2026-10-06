# MEMORY SEQUENCE · Neural Memory Experiment

Juego corto de memoria visual/secuencial para una exposición escolar sobre la memoria humana.
Observas una secuencia de nodos que se iluminan y la reproduces en el mismo orden.
Sin backend, base de datos ni autenticación: todo corre en el navegador.

## Ejecutar

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```

Requiere Node 18.18+ (recomendado 20+). La primera vez que se hace `build` hace falta internet
(las fuentes Sora e IBM Plex Mono se descargan y se sirven desde el propio sitio; después el juego funciona offline).

## Desplegar en Vercel

Sube el proyecto a GitHub e impórtalo en vercel.com. Next.js se detecta solo; no hay variables de entorno.

## Cómo se juega

1. **START EXPERIMENT** → cuenta atrás 3 · 2 · 1 · BEGIN.
2. **OBSERVE CAREFULLY**: los nodos se iluminan en cian (la señal del sistema).
3. **YOUR TURN**: repite el orden con el ratón/táctil o con las teclas **1–9**. Tu ruta se traza en violeta.
4. Si aciertas: **SEQUENCE CONFIRMED** y sube el nivel automáticamente. Si fallas: **PATTERN LOST** y reporte final.
5. Nivel 1 = 3 nodos, nivel 2 = 4… hasta el nivel 12 (14 nodos) = **EXPERIMENT MASTERED**.

En la pantalla de inicio puedes tocar los nodos para previsualizarlos (con sonido).

## Estructura

```
app/                 layout (fuentes, metadata), page, globals.css (animaciones CSS + reduced-motion)
components/          UI presentacional (MemoryBoard, MemoryNode, GameHUD, ResultsScreen, ...)
hooks/useMemoryGame  único sitio con timers y efectos (audio, storage). Cada efecto limpia sus timers.
lib/game-engine.ts   máquina de estados pura (reducer), generación de secuencias, timing, resumen
lib/scoring.ts       puntuación: base + nivel + velocidad + precisión
lib/audio.ts         sonidos con Web Audio API (sin archivos)
lib/storage.ts       récords y preferencia de sonido en localStorage (tolerante a fallos)
lib/neural-data.ts   nodos/aristas del fondo, deterministas (sin hydration mismatch)
```

Estados: `idle → countdown → showing → input → success → (showing…) | gameOver → results`.
Cada transición del reducer comprueba la fase actual, así que clicks rápidos o timers tardíos no pueden
producir estados imposibles.

## Ajustar la dificultad

- `lib/game-engine.ts`: `GAME_CONFIG` (nivel máximo, longitud inicial) y `getLevelTiming` (tiempos de iluminación).
- `lib/scoring.ts`: constantes de puntos.
- `hooks/useMemoryGame.ts`: pausas entre estados (`SUCCESS_HOLD_MS`, etc.).

## Accesibilidad

Botones reales, foco visible, teclas 1–9, `role="status"` para los mensajes, estados con texto/forma/animación
además de color, y `prefers-reduced-motion` (Motion y CSS) sin romper el juego.

## Datos locales

`localStorage`: `memory-sequence:records:v1` (mejores marcas y top 5) y `memory-sequence:sound:v1`.
Para reiniciar récords: `localStorage.clear()` en la consola del navegador.
