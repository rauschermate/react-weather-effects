"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import fogElementImg from './fog-element.png';
import denseFogElementImg from './dense-fog-element.png';
import gsap from 'gsap';

// Settings for light and dense fog
const LIGHT_FOG_SETTINGS = {
  count: 18,
  fogElementRatio: 0.8, // 80% fog-element, 20% dense-fog-element
  alphaMin: 0.18,
  alphaMax: 0.32,
  scaleMin: 0.7,
  scaleMax: 1.7,
  moveSpeed: 0.02,
};
const DENSE_FOG_SETTINGS = {
  count: 38,
  fogElementRatio: 0.35, // 35% fog-element, 65% dense-fog-element
  alphaMin: 0.10,
  alphaMax: 0.22,
  scaleMin: 1.0,
  scaleMax: 2.2,
  moveSpeed: 0.04,
};

function FogSprite({ texture, initial, moveSpeed, windOffset }) {
  const mesh = useRef();
  const visibleRef = useRef(false); // Track if currently visible
  useFrame((state) => {
    if (mesh.current) {
      const t = state.clock.getElapsedTime();
      // Add wind offset to base position
      let x = initial.x + (windOffset?.current?.x || 0) + Math.sin(t * initial.driftSpeedX + initial.driftPhaseX) * initial.driftAmountX;
      let y = initial.y + (windOffset?.current?.y || 0) + Math.cos(t * initial.driftSpeedY + initial.driftPhaseY) * initial.driftAmountY;
      // Loop position in [-1.1, 1.1] for seamless looping
      if (x > 1.1) x -= 2.2;
      if (x < -1.1) x += 2.2;
      if (y > 1.1) y -= 2.2;
      if (y < -1.1) y += 2.2;
      mesh.current.position.x = x;
      mesh.current.position.y = y;
      // Determine if inside visible area
      const isVisible = x > -1 && x < 1 && y > -1 && y < 1;
      // Animate opacity with GSAP only on enter/exit
      if (mesh.current.material) {
        if (isVisible && !visibleRef.current) {
          // Entering: fade in
          gsap.to(mesh.current.material, { opacity: initial.alpha, duration: .5, overwrite: true });
          visibleRef.current = true;
        } else if (!isVisible && visibleRef.current) {
          // Exiting: fade out
          gsap.to(mesh.current.material, { opacity: 0, duration: .5, overwrite: true });
          visibleRef.current = false;
        }
      }
    }
  });
  return (
    <mesh ref={mesh} position={[initial.x, initial.y, 0]}>
      <planeGeometry args={[initial.scale, initial.scale]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

// Add a helper component for global wind animation
function FogWindController({ windAngle, windOffset }) {
  useFrame(() => {
    // Occasionally nudge wind angle
    if (Math.random() > 0.995) {
      windAngle.current += (Math.random() - 0.5) * 0.2; // Small nudge
      // Clamp angle to [-PI, PI]
      if (windAngle.current > Math.PI) windAngle.current -= 2 * Math.PI;
      if (windAngle.current < -Math.PI) windAngle.current += 2 * Math.PI;
    }
    // Much slower wind movement
    const windSpeed = 0.0007; // Much slower
    windOffset.current.x += Math.cos(windAngle.current) * windSpeed;
    windOffset.current.y += Math.sin(windAngle.current) * windSpeed;
    // Loop wind offset in [-1, 1] for seamless looping
    if (windOffset.current.x > 1) windOffset.current.x -= 2;
    if (windOffset.current.x < -1) windOffset.current.x += 2;
    if (windOffset.current.y > 1) windOffset.current.y -= 2;
    if (windOffset.current.y < -1) windOffset.current.y += 2;
  });
  return null;
}

export default function FogEffect({ backgroundImageUrl, type = 'light' }) {
  // Load both fog textures
  const [fogElement, denseFogElement] = useLoader(THREE.TextureLoader, [
    fogElementImg.src,
    denseFogElementImg.src,
  ]);
  const settings = type === 'dense' ? DENSE_FOG_SETTINGS : LIGHT_FOG_SETTINGS;

  // Wind angle (in radians) and wind offset
  const windAngle = React.useRef(0); // 0 = right
  const windOffset = React.useRef({ x: 0, y: 0 });

  // Precompute sprite initial states
  const sprites = useMemo(() => {
    return Array.from({ length: settings.count }).map(() => {
      // Randomly choose which texture to use
      const useFogElement = Math.random() < settings.fogElementRatio;
      const texture = useFogElement ? fogElement : denseFogElement;
      // Random position in [-1, 1] (covering the screen)
      const x = (Math.random() - 0.5) * 2.2;
      const y = (Math.random() - 0.5) * 2.2;
      // Random scale
      const scale = settings.scaleMin + Math.random() * (settings.scaleMax - settings.scaleMin);
      // Random alpha
      const alpha = settings.alphaMin + Math.random() * (settings.alphaMax - settings.alphaMin);
      // Random drift parameters
      const driftAmountX = 0.08 + Math.random() * 0.18;
      const driftAmountY = 0.08 + Math.random() * 0.18;
      const driftSpeedX = settings.moveSpeed * (0.7 + Math.random() * 0.6);
      const driftSpeedY = settings.moveSpeed * (0.7 + Math.random() * 0.6);
      const driftPhaseX = Math.random() * Math.PI * 2;
      const driftPhaseY = Math.random() * Math.PI * 2;
      return {
        texture,
        x,
        y,
        scale,
        alpha,
        driftAmountX,
        driftAmountY,
        driftSpeedX,
        driftSpeedY,
        driftPhaseX,
        driftPhaseY,
      };
    });
  }, [fogElement, denseFogElement, settings]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0 }}
        camera={{ position: [0, 0, 1], fov: 75 }}
      >
        <FogWindController windAngle={windAngle} windOffset={windOffset} />
        {sprites.map((init, i) => (
          <FogSprite
            key={i}
            texture={init.texture}
            initial={init}
            moveSpeed={settings.moveSpeed}
            windOffset={windOffset}
          />
        ))}
      </Canvas>
    </div>
  );
}   