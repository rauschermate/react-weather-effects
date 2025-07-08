# 🌦️ Animated React Weather Effects

A beautiful, interactive weather effects demo built with React, Next.js, WebGL, and Three.js. Experience realistic **rain**, **snow**, and **fog** scenes, each with unique visual effects and controls.

## 🚀 Demo

[Live demo](https://react-weather-effects.vercel.app/)

## ✨ Features

- **Rain:** Realistic WebGL rain with custom shaders, and lightning effects.
- **Snow:** Gentle and stormy snow scenes powered by Three.js particle systems.
- **Fog:** Light and dense fog overlays using Three.js and custom blending.
- **Interactive:** Switch between weather types and subtypes (e.g., storm, drizzle) with a modern UI.
- **Responsive:** Works on desktop and mobile browsers.

## 🌈 Weather Types

- **Rain**
  - Rain
  - Storm (with lightning)
  - Drizzle
  - Fallout
- **Snow**
  - Gentle
  - Storm
- **Fog**
  - Light
  - Dense

## 🛠️ Technology

- **React** & **Next.js** (App Router)
- **WebGL** (custom shaders for rain)
- **Three.js** (snow and fog effects)
- **GSAP** (for smooth lightning and fog animations)
- **Tailwind CSS** (for modern UI)

## 🖥️ Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure

- `/src/app/rain/` – Rain effect (WebGL, shaders, rain types)
- `/src/app/snow/` – Snow effect (Three.js, snow types)
- `/src/app/fog/` – Fog effect (Three.js, fog types)
- `/src/app/components/Navbar.jsx` – Navigation bar for switching weather types

---

## 🙏 Credits

- **Rain shaders & inspiration:**  
  [Lucas Bebber – RainEffect](https://github.com/codrops/RainEffect)
  [Shadertoy rain shader](https://www.shadertoy.com/view/ltffzl)
- **Snow & fog inspiration:**  
  [React three Fiber docs](https://r3f.docs.pmnd.rs/getting-started/examples)
  [Freezing cube](https://boytchev.github.io/etudes/webgl/freezing-cube.html)
  [Images from Unsplash](https://unsplash.com)
  [Snow effect inspiration #1](https://codepen.io/bsehovac/pen/GPwXxq)
  [Snow effect inspiration #2](https://codepen.io/bsehovac/full/GPwXxq)
  [Smoke effect](https://codepen.io/daniel3toma/pen/dybjNbZ)

---

## 📄 License

MIT
