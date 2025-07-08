import TweenLite from 'gsap';
import RainRenderer from "./rain-renderer";
import Raindrops from "./raindrops";
import loadImages from "./image-loader";
import createCanvas from "./create-canvas";
import times from './times';
import {random,chance} from './random';

import DropColor from './img/drop-color.png';
import DropAlpha from './img/drop-alpha.png';

let textureStormLightningFg, textureStormLightningBg, dropColor, dropAlpha;

let textureFg,
  textureFgCtx,
  textureBg,
  textureBgCtx;

let textureBgSize = {
  width: window.innerWidth,
  height: window.innerHeight
}
let textureFgSize = {
  width:96,
  height:64
}

// const blankFg = createCanvas(textureFgSize.width, textureFgSize.height);

let raindrops,
  renderer,
  canvas;

let weatherData = null;
let curWeatherData = null;
let blend = {v:0};
let intervalId = undefined;

let backgroundImage = null;
let lastWeatherType = 'rain'; // Track the last used weather type
let resizeTimeout = null;

// Set the background image and initialize rain effect after image loads
export function setBackgroundImage(url, type = 'rain') {
  if (typeof window === 'undefined') return; // SSR safety
  backgroundImage = new window.Image();
  backgroundImage.crossOrigin = 'anonymous';
  
  console.log('textureBgSize', textureBgSize);
  backgroundImage.onload = () => {
    // Calculate scaled dimensions while preserving aspect ratio
    console.log('backgroundImage natural w h', backgroundImage.naturalWidth, backgroundImage.naturalHeight);
    const imageRatio = backgroundImage.naturalWidth / backgroundImage.naturalHeight;
    const containerRatio = textureBgSize.width / textureBgSize.height;
    console.log('imageRatio', imageRatio);
    console.log('containerRatio', containerRatio);
    if (imageRatio > containerRatio) {
      // Image is wider than target - scale by width
      backgroundImage.height = textureBgSize.height;
      backgroundImage.width = textureBgSize.height * imageRatio;
    } else {
      // Image is taller than target - scale by height
      backgroundImage.width = textureBgSize.width;
      backgroundImage.height = textureBgSize.width / imageRatio;
    }
    console.log('backgroundImage w h', backgroundImage.width, backgroundImage.height);
    loadTextures().then(() => {
      init(type, backgroundImage);
    });
  };
  backgroundImage.src = url;
  console.log('backgroundImage at onload', backgroundImage);
}

// Load drop textures
export function loadTextures() {
  
  return loadImages([
    { name:"dropAlpha", src: DropAlpha },
    { name:"dropColor", src: DropColor },
  ]).then(function (images){
    dropColor = images.dropColor.img;
    dropAlpha = images.dropAlpha.img;
  });
}

// Set up weather data and current weather
function setupWeather(type) {
  
  setupWeatherData();
  curWeatherData = weatherData[type];
  
  if (raindrops && curWeatherData) {
    raindrops.options = Object.assign(raindrops.options, curWeatherData);
    raindrops.clearDrops();
  }
}

// Handle window resize for responsive canvas
function handleResize() {
  // resizeCanvas();
  if (typeof window === 'undefined') return;
  if (backgroundImage && backgroundImage.complete) {
    setBackgroundImage(backgroundImage.src, lastWeatherType);
  }
}

// Make canvas match its CSS size
// function resizeCanvas() {
//   canvas.width = canvas.clientWidth;
//   canvas.height = canvas.clientHeight;
// }

// Enable responsive canvas resizing
export function enableResponsiveCanvas() {
  if (typeof window === 'undefined') return;
  window.addEventListener('resize', handleResize);
}

// Initialize rain effect and renderer
function init(type = 'rain', backgroundImage) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  lastWeatherType = type; // Save the last used weather type
  canvas = document.querySelector('#container-weather');
  // var dpi = window.devicePixelRatio;
  // canvas.width = window.innerWidth * dpi;
  // canvas.height = window.innerHeight * dpi;
  // canvas.style.width = window.innerWidth + "px";
  // canvas.style.height = window.innerHeight + "px";
  const container = canvas.parentElement; // or a specific container element
  console.log('container', container);
  const dpi = window.devicePixelRatio || 1;

  const rect = container.getBoundingClientRect();
  console.log('rect', rect);
  canvas.width = rect.width * dpi;
  canvas.height = rect.height * dpi;

  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  // // Center the image in the canvas
  // const x = (canvas.width - backgroundImage.width) / 2;
  // const y = (canvas.height - backgroundImage.height) / 2;


  console.log('window.innerWidth', window.innerWidth);
  console.log('dpi', dpi);
  console.log('canvas.clientWidth', canvas.clientWidth);
  console.log('canvas.clientHeight', canvas.clientHeight);
  console.log('canvas.width', canvas.width);
  console.log('canvas.height', canvas.height);
  console.log('canvas.style.width', canvas.style.width);
  console.log('canvas.style.height', canvas.style.height);

  textureBgSize = { width: rect.width * dpi, height: rect.height * dpi };

  raindrops=new Raindrops(
    canvas.width,
    canvas.height,
    dpi,
    dropAlpha,
    dropColor,{
      trailRate:1,
      trailScaleRange:[0.2,0.45],
      collisionRadius : 0.45,
      dropletsCleaningRadiusMultiplier : 0.28,
    }
  );

  textureFg = createCanvas(textureFgSize.width,textureFgSize.height);
  textureFgCtx = textureFg.getContext('2d');
  textureBg = createCanvas(textureBgSize.width,textureBgSize.height);
  textureBgCtx = textureBg.getContext('2d');
  
  
  generateTextures(backgroundImage, backgroundImage);
  renderer = new RainRenderer(canvas, raindrops.canvas, textureFg, textureBg, null,{
    brightness:1.04,
    alphaMultiply:6,
    alphaSubtract:3,
    minRefraction: 128
    // minRefraction:256,
    // maxRefraction:512
  });

  setupWeather(type);
  if (curWeatherData && curWeatherData.flashChance) {
    setupFlash();
  }
}

// Set up lightning flash effect for storm weather
function setupFlash() {
  intervalId = setInterval(()=>{
    if(chance(curWeatherData.flashChance)){
      flash(curWeatherData.bg,curWeatherData.fg,curWeatherData.flashBg,curWeatherData.flashFg);
    }
  },500);
}

// Set up weather data for different types
function setupWeatherData() {
  var defaultWeather = {
    minR: 10,
    maxR: 40,
    rainChance: 0.35,
    rainLimit: 6,
    drizzle: 50,
    drizzleSize: [2, 4.5],
    raining: true,
    trailRate: 1,
    trailScaleRange: [0.2, 0.35],
    fg: backgroundImage,
    bg: backgroundImage,
    flashFg: null,
    flashBg: null,
    flashChance: 0
  };

  function weather(data) {
    return Object.assign({}, defaultWeather, data);
  };

  weatherData = {
    rain: weather({
      rainChance: 0.35,
      rainLimit: 6,
      drizzle: 50,
      raining: true,
      // trailRate:2.5,
      fg: backgroundImage,
      bg: backgroundImage
    }),
    storm: weather({
      minR: 20,
      maxR: 45,
      rainChance: 0.55,
      rainLimit: 6,
      drizzle: 80,
      drizzleSize: [2, 6],
      trailRate: 1,
      trailScaleRange: [0.15, 0.3],
      fg: backgroundImage,
      bg: backgroundImage,
      flashFg: textureStormLightningFg,
      flashBg: textureStormLightningBg,
      flashChance: 0.1
    }),
    fallout: weather({
      rainChance: 0.35,
      rainLimit: 6,
      drizzle: 20,
      trailRate: 4,
      fg: backgroundImage,
      bg: backgroundImage
    }),
    drizzle: weather({
      rainChance: 0.15,
      rainLimit: 2,
      drizzle: 10,
      fg: backgroundImage,
      bg: backgroundImage
    }),
    sunny: weather({
      rainChance: 0,
      rainLimit: 0,
      drizzle: 0,
      raining: false,
      fg: backgroundImage,
      bg: backgroundImage
    })
  };
}

// Lightning flash animation
function flash(baseBg, baseFg, flashBg, flashFg) {
  let flashValue={v:0};
  function transitionFlash(to,t=0.025){
    return new Promise((resolve,reject)=>{
      TweenLite.to(flashValue,t,{
        v:to,
        // ease:Quint.easeOut,
        onUpdate:()=>{
          generateTextures(baseFg,baseBg);
          generateTextures(flashFg,flashBg,flashValue.v);
          renderer.updateTextures();
        },
        onComplete:()=>{
          resolve();
        }
      });
    });
  }

  let lastFlash=transitionFlash(1);
  times(random(2,7),(i)=>{
    lastFlash=lastFlash.then(()=>{
      return transitionFlash(random(0.1,1))
    })
  })
  lastFlash=lastFlash.then(()=>{
    return transitionFlash(1,0.1);
  }).then(()=>{
    transitionFlash(0,0.25);
  });
}

// Generate foreground/background textures for the rain renderer
function generateTextures(fg, bg, x=0, y=0, alpha=1) {
  if (
    !fg ||
    !bg ||
    (fg instanceof HTMLImageElement && !fg.complete) ||
    (bg instanceof HTMLImageElement && !bg.complete)
  ) {
    // Image not ready, skip drawing
    return;
  }
  textureFgCtx.globalAlpha = alpha;
  textureFgCtx.drawImage(fg, x, y, textureFgSize.width, textureFgSize.height);
  console.log('x and y in generateTextures', x, y);

  textureBgCtx.globalAlpha = alpha;
  textureBgCtx.drawImage(bg, x, y, textureBgSize.width, textureBgSize.height);
}

// Clean up weather effect and clear intervals
export function cleanWeather(){
  //TODO enhance the cleanup function
  // raindrops.clean();
  clearInterval(intervalId);
  // textureRainFg = null;
  // textureRainBg = null;
  // textureStormLightningFg = null; 
  // textureStormLightningBg = null;
  // textureFalloutFg = null; 
  // textureFalloutBg = null;
  // textureSunFg = null; 
  // textureSunBg = null;
  // textureDrizzleFg = null; 
  // textureDrizzleBg = null;
  // dropColor = null; 
  // dropAlpha  = null;
  // textureFg = null;
  // textureFgCtx = null;
  // textureBg = null;
  // textureBgCtx = null;
  // textureBgSize  = null;
  // textureFgSize  = null;
  // raindrops = null;
  // renderer = null;
  // canvas = null;
  // parallax = null;
  weatherData = null;
  curWeatherData = null;
  // blend = null;
  intervalId = null;
}