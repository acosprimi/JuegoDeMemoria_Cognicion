# Memory Sequence · a cozy memory game

Juego corto de memoria visual/secuencial para una exposición escolar sobre la memoria humana.
Observas una secuencia de amiguitos kawaii que se iluminan y la reproduces en el mismo orden.
Estética pastel y acogedora: rosa, lila, crema, celeste y amarillo mantequilla.
Sin backend, base de datos ni autenticación: todo corre en el navegador.

## Ejecutar

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```

Requiere Node 18.18+ (recomendado 20+). La primera vez que se hace `build` hace falta internet
(las fuentes Fredoka y Nunito se descargan y se sirven desde el propio sitio; después el juego funciona offline).

## Desplegar en Vercel

Sube el proyecto a GitHub e impórtalo en vercel.com. Next.js se detecta solo; no hay variables de entorno.

## Cómo se juega

1. **Let's play!** → cuenta atrás 3 · 2 · 1 · Go!
2. **Watch closely**: los amiguitos (corazón, estrella, flor, nube, gatito, osito, conejito, mochi y sol) se iluminan y ponen carita feliz.
3. **Your turn**: repite el orden con el ratón/táctil o con las teclas **1–9**. Tu ruta se dibuja en rosa.
4. Si aciertas: **Yay, you did it!** y sube el nivel automáticamente. Si fallas: **Oh no, oopsie!** y resumen final.
5. Nivel 1 = 3 amiguitos, nivel 2 = 4… hasta el nivel 12 (14) = **Memory Master!**

En la pantalla de inicio puedes tocar los amiguitos para previsualizarlos (con sonido).

## Estructura

```
app/                 layout (fuentes, metadata), page, globals.css (animaciones CSS + reduced-motion)
components/          UI presentacional (MemoryBoard, MemoryNode, GameHUD, ResultsScreen, ...)
                     Doodles.tsx = corazones/estrellas/flores/nubes; SweetBackground.tsx = fondo pastel
hooks/useMemoryGame  único sitio con timers y efectos (audio, storage). Cada efecto limpia sus timers.
lib/game-engine.ts   máquina de estados pura (reducer), generación de secuencias, timing, resumen
lib/scoring.ts       puntuación: base + nivel + velocidad + precisión
lib/audio.ts         sonidos con Web Audio API (sin archivos)
lib/storage.ts       récords y preferencia de sonido en localStorage (tolerante a fallos)
lib/node-shapes.ts   los 9 personajes (forma, paleta y posición de la carita)
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
