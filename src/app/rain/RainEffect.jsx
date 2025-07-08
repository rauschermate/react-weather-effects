import React, { useEffect } from 'react';

import RainRenderer from "./rain-renderer";
import TweenLite from 'gsap';
import times from './times';
import {random,chance} from './random';
import Raindrops from "./raindrops";
import loadImages from "./image-loader";
import createCanvas from "./create-canvas";
import { weatherData } from './rain-utils';

import DropColor from './img/drop-color.png';
import DropAlpha from './img/drop-alpha.png';


const RainEffect = (props) => {
  const {type, backgroundImageUrl } = props;

  let canvas, dropAlpha, dropColor, raindrops, textureFg, textureFgCtx, textureBg, textureBgCtx, renderer, curWeatherData;
  let backgroundImage = null;
  let intervalId = undefined;
  let blend = {v:0};

  let textureFgSize = {
    width: 100,
    height: 100
  }
  let textureBgSize = {
    width: 100,
    height: 100
  }
  

  useEffect(() => {
    setBackgroundImage(backgroundImageUrl);
  },[backgroundImageUrl, type]);

  // Set the background image and initialize rain effect after image loads
  const setBackgroundImage = (backgroundImageUrl) => {
    if (typeof window === 'undefined') return; // SSR safety
    backgroundImage = new window.Image();
    backgroundImage.crossOrigin = 'anonymous';
    backgroundImage.src = backgroundImageUrl;

    backgroundImage.onload = () => {
      textureFgSize = {
        width: backgroundImage.naturalWidth,
        height: backgroundImage.naturalHeight
      }
      textureBgSize = {
        width: backgroundImage.naturalWidth,
        height: backgroundImage.naturalHeight
      }
    }


  
    loadTextures().then(() => {
      init(type);
    });
  }

  // Load drop textures
  const loadTextures = () => {
    return loadImages([
      { name:"dropAlpha", src: DropAlpha },
      { name:"dropColor", src: DropColor },
    ]).then(function (images){      
      dropColor = images.dropColor.img;
      dropAlpha = images.dropAlpha.img;
    });
  }

  const init = (type = 'rain') => {
    canvas = document.querySelector('#container-weather');
    const container = canvas.parentElement; // or a specific container element
    const dpi = window.devicePixelRatio || 1;
  
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpi;
    canvas.height = rect.height * dpi;
  
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  

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
      alphaMultiply:16,
      alphaSubtract:4,
      minRefraction: 128
      // minRefraction:256,
      // maxRefraction:512
    });
  
    curWeatherData = { ...weatherData[type], fg: backgroundImage, bg: backgroundImage };
    if (type === 'storm' || type === 'fallout') {
      setupLightningFlicker();
    }
    if (raindrops && curWeatherData) {
      raindrops.options = Object.assign(raindrops.options, curWeatherData);
      raindrops.clearDrops();
    }
  }

  // Generate foreground/background textures for the rain renderer
  const generateTextures = (fg, bg, x=0, y=0, alpha=1) => {
    if (!fg || !bg || (fg instanceof HTMLImageElement && !fg.complete) || (bg instanceof HTMLImageElement && !bg.complete)) { return; }
    textureFgCtx.globalAlpha = alpha;
    textureFgCtx.drawImage(fg, x, y, textureFgSize.width, textureFgSize.height);
    textureBgCtx.globalAlpha = alpha;
    textureBgCtx.drawImage(bg, x, y, textureBgSize.width, textureBgSize.height);
  }

  // Lightning flicker effect for storm weather
  const setupLightningFlicker = () => {
    const minInterval = 1000; // minimum time between flickers
    const maxInterval = 5000; // maximum time between flickers
    const flashChance = curWeatherData && typeof curWeatherData.flashChance === 'number' ? curWeatherData.flashChance : 0;
    const interval = minInterval + (maxInterval - minInterval) * (1 - flashChance);

    intervalId = setInterval(() => {
      const flicker = Math.random() * 2.0;
      if (renderer && renderer.gl) {
        renderer.gl.useProgram(renderer.programWater);
        renderer.gl.createUniform("1f", "lightningFlash", flicker);
        setTimeout(() => {
          renderer.gl.useProgram(renderer.programWater);
          renderer.gl.createUniform("1f", "lightningFlash", 0.0);
        }, 100 + Math.random() * 200); // Flicker lasts 100-300ms
      }
    }, interval);
  }
    

    return (
      <div className="rain-effect-container" style={{width: '100%', height: '100vh'}}>
        <canvas id="container-weather"></canvas>
      </div>
    )
  
}

export default RainEffect;