import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import snowflake from "./snowflake.png";


// https://github.com/bsehovac/shader-program

// const snowflake = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTUtMDctMDNUMTg6NTk6MjIrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAxLTEyVDE1OjE0OjQwKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTAxLTEyVDE1OjE0OjQwKzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmIzMzBlMWI0LTk5ZDctNGU2NS05MGQ2LTNmYjFiYmE2ZTE0MCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjAyNThjNzMxLTQ4ZjQtYTA0MS1hNGFkLTQ4MTA2MTVjY2FlYSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjJjY2VkMTUyLTRjNzAtNDFlZC1hMzcyLWRlOWY4NjgyZTcwMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MmNjZWQxNTItNGM3MC00MWVkLWEzNzItZGU5Zjg2ODJlNzAxIiBzdEV2dDp3aGVuPSIyMDE1LTA3LTAzVDE4OjU5OjIyKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjMzMGUxYjQtOTlkNy00ZTY1LTkwZDYtM2ZiMWJiYTZlMTQwIiBzdEV2dDp3aGVuPSIyMDE5LTAxLTEyVDE1OjE0OjQwKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz50mbqsAAAToElEQVR4nOVbW49dR5X+VlXtc2v3Ne52N6bTTnAc0u02GRJQwEhYQkJ5QhmhPPOUl0iBB/4AP4JfMA95IEIaJEYiQhlesCZMEE1iGxJHIjK21XbSwX1xd5+zd9Va87BrVdfefWwI4xEaUVJpn7PPPnVqfbUu31pVh0QE/8zN/KMn8I9uTl+8+uqrAAARgYgghIBer4dnnnkGAPDFL34RANDr9eiJJ55AVVUgIhhjwMwYDAbY3Nyk8+fPP/DHdnd3ZWtr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';

const count = 7000;

let wind = {
  current: 0,
  force: 0.1,
  target: 0.1,
  min: 0.1,
  max: 0.25,
  easing: 0.005
};

// Shaders from your original code
const vertexShader = `
  precision highp float;
  attribute float size;
  attribute vec3 rotation;
  attribute vec3 speed;
  attribute vec4 a_color;
  attribute float scale;
  attribute float distortion;
  attribute float brightness;
  attribute float contrast;
  attribute float rotationOffset;
  attribute float flipX;
  attribute float flipY;
  attribute float warp;
  varying vec4 v_color;
  varying float v_rotation;
  varying float v_scale;
  varying float v_distortion;
  varying float v_brightness;
  varying float v_contrast;
  varying float v_rotationOffset;
  varying float v_flipX;
  varying float v_flipY;
  varying float v_warp;
  uniform float u_time;
  uniform vec3 u_worldSize;
  uniform float u_gravity;
  uniform float u_wind;
  void main() {
    v_color = a_color;
    v_rotation = rotation.x + u_time * rotation.y;
    v_scale = scale;
    v_distortion = distortion;
    v_brightness = brightness;
    v_contrast = contrast;
    v_rotationOffset = rotationOffset;
    v_flipX = flipX;
    v_flipY = flipY;
    v_warp = warp;
    vec3 pos = position;
    pos.x = mod(pos.x + u_time + u_wind * speed.x, u_worldSize.x * 2.0) - u_worldSize.x;
    pos.y = mod(pos.y - u_time * speed.y * u_gravity, u_worldSize.y * 2.0) - u_worldSize.y;
    pos.x += sin(u_time * speed.z) * rotation.z;
    pos.z += cos(u_time * speed.z) * rotation.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (size * v_scale / gl_Position.w) * 100.0;
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D u_texture;
  uniform float u_time;
  varying vec4 v_color;
  varying float v_rotation;
  varying float v_scale;
  varying float v_distortion;
  varying float v_brightness;
  varying float v_contrast;
  varying float v_rotationOffset;
  varying float v_flipX;
  varying float v_flipY;
  varying float v_warp;

  // Simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 coord = gl_PointCoord - 0.5;
    // Apply random scale
    coord *= v_scale;
    // Add random distortion based on noise and time
    float distortion_amount = v_distortion * 0.15;
    coord += vec2(
      noise(coord * 10.0 + u_time * 0.1) * distortion_amount,
      noise(coord * 10.0 + u_time * 0.1 + 1.0) * distortion_amount
    );
    // Apply warp (skew)
    coord.x += v_warp * coord.y;
    coord.y += v_warp * coord.x;
    // Apply flip
    if (v_flipX > 0.5) coord.x = -coord.x;
    if (v_flipY > 0.5) coord.y = -coord.y;
    // Apply random rotation offset
    float angle = v_rotation + v_rotationOffset;
    vec2 rotated = vec2(
      cos(angle) * coord.x + sin(angle) * coord.y,
      cos(angle) * coord.y - sin(angle) * coord.x
    ) + 0.5;
    vec4 snowflake = texture2D(u_texture, rotated);
    // Apply brightness and contrast
    vec3 color = snowflake.rgb;
    color = (color - 0.5) * v_contrast + 0.5 + v_brightness;
    color = clamp(color, 0.0, 1.0);
    gl_FragColor = vec4(color, snowflake.a * v_color.a);
  }
`;

// Settings for gentle and storm snow
const GENTLE_SETTINGS = {
  count: 3000,
  gravity: 20,
  colorAlphaMin: 0.2,
  colorAlphaMax: 0.6,
  sizeMin: 5,
  sizeMax: 15,
  scaleMin: 0.5,
  scaleMax: 1.5,
  distortionMin: 0.1,
  distortionMax: 0.5,
  brightnessMin: -0.1,
  brightnessMax: 0.2,
  contrastMin: 0.8,
  contrastMax: 1.2,
  wind: {
    force: 0.05,
    target: 0.05,
    min: 0.02,
    max: 0.1,
    easing: 0.002,
  },
  windDirectionChangeFreq: 0.97,
  windDirectionChangeAmount: 1.0,
  speedYMin: 0.5,
  speedYMax: 1.0,
  speedXMin: 0.2,
  speedXMax: 0.5,
  swayMax: 5,
};

const STORM_SETTINGS = {
  count: 7000,
  gravity: 45,
  colorAlphaMin: 0.25,
  colorAlphaMax: 0.8,
  sizeMin: 7,
  sizeMax: 18,
  scaleMin: 0.7,
  scaleMax: 2.2,
  distortionMin: 0.2,
  distortionMax: 1.0,
  brightnessMin: -0.2,
  brightnessMax: 0.3,
  contrastMin: 0.7,
  contrastMax: 1.3,
  wind: {
    force: 0.15,
    target: 0.2,
    min: 0.08,
    max: 0.35,
    easing: 0.01,
  },
  windDirectionChangeFreq: 0.995,
  windDirectionChangeAmount: 0.2,
  speedYMin: 1.2,
  speedYMax: 2.0,
  speedXMin: 0.4,
  speedXMax: 1.0,
  swayMax: 12,
};

function SnowParticles({ settings }) {
  const mesh = useRef();
  const worldSize = [110, 110, 80];
  const gravity = settings.gravity;
  const wind = useRef({
    current: 0,
    force: settings.wind.force,
    target: settings.wind.target,
    min: settings.wind.min,
    max: settings.wind.max,
    easing: settings.wind.easing,
  });
  // Wind angle in radians
  const windAngle = React.useRef(0); // 0 = right, PI = left

  // Generate attributes
  const { positions, colors, sizes, rotations, speeds, scales, distortions, brightnesses, contrasts, rotationOffsets, flipXs, flipYs, warps } = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];
    const rotations = [];
    const speeds = [];
    const scales = [];
    const distortions = [];
    const brightnesses = [];
    const contrasts = [];
    const rotationOffsets = [];
    const flipXs = [];
    const flipYs = [];
    const warps = [];
    for (let i = 0; i < settings.count; i++) {
      // Position
      positions.push(
        -worldSize[0] + Math.random() * worldSize[0] * 2,
        -worldSize[1] + Math.random() * worldSize[1] * 2,
        Math.random() * worldSize[2] * 2
      );
      // Speed
      speeds.push(
        settings.speedXMin + Math.random() * (settings.speedXMax - settings.speedXMin),
        settings.speedYMin + Math.random() * (settings.speedYMax - settings.speedYMin),
        Math.random() * settings.swayMax
      );
      // Rotation
      rotations.push(
        Math.random() * 2 * Math.PI,
        Math.random() * 20,
        Math.random() * 10
      );
      // Color (RGBA)
      colors.push(1, 1, 1, settings.colorAlphaMin + Math.random() * (settings.colorAlphaMax - settings.colorAlphaMin));
      // Size
      sizes.push(settings.sizeMin + Math.random() * (settings.sizeMax - settings.sizeMin));
      // Random scale
      scales.push(settings.scaleMin + Math.random() * (settings.scaleMax - settings.scaleMin));
      // Random distortion
      distortions.push(settings.distortionMin + Math.random() * (settings.distortionMax - settings.distortionMin));
      // Random brightness
      brightnesses.push(settings.brightnessMin + Math.random() * (settings.brightnessMax - settings.brightnessMin));
      // Random contrast
      contrasts.push(settings.contrastMin + Math.random() * (settings.contrastMax - settings.contrastMin));
      // Random rotation offset
      rotationOffsets.push(Math.random() * Math.PI * 2);
      // Random flip
      flipXs.push(Math.random() > 0.5 ? 1 : 0);
      flipYs.push(Math.random() > 0.5 ? 1 : 0);
      // Random warp
      warps.push(-0.3 + Math.random() * 0.6); // -0.3 to 0.3
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      rotations: new Float32Array(rotations),
      speeds: new Float32Array(speeds),
      scales: new Float32Array(scales),
      distortions: new Float32Array(distortions),
      brightnesses: new Float32Array(brightnesses),
      contrasts: new Float32Array(contrasts),
      rotationOffsets: new Float32Array(rotationOffsets),
      flipXs: new Float32Array(flipXs),
      flipYs: new Float32Array(flipYs),
      warps: new Float32Array(warps),
    };
  }, [settings]);

  // Texture loading (async)
  const [texture, setTexture] = React.useState();
  React.useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(snowflake.src, (tex) => {
      setTexture(tex);
    });
  }, []);

  // Uniforms
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_texture: { value: texture },
      u_worldSize: { value: worldSize },
      u_gravity: { value: gravity },
      u_wind: { value: 0 },
    }),
    [texture, gravity]
  );

  useFrame((state, delta) => {
    // Wind logic
    const w = wind.current;
    w.force += (w.target - w.force) * w.easing;
    w.current += w.force * (delta * 0.2);
    // Wind angle logic: nudge angle
    if (Math.random() > settings.windDirectionChangeFreq) {
      // Gentle: nudge more often/larger, Storm: less often/smaller
      const nudge = (Math.random() - 0.5) * settings.windDirectionChangeAmount;
      windAngle.current += nudge;
      // Clamp angle to [-PI, PI] for stability
      if (windAngle.current > Math.PI) windAngle.current -= 2 * Math.PI;
      if (windAngle.current < -Math.PI) windAngle.current += 2 * Math.PI;
    }
    // Compute wind X (horizontal) from angle
    const windX = Math.cos(windAngle.current);
    // Optionally, you could use windY = Math.sin(windAngle.current) for vertical modulation
    uniforms.u_wind.value = w.current * windX;
    // Subtle wind change (gentle drift)
    if (Math.random() > 0.98) {
      w.target += (Math.random() - 0.5) * 0.01; // Small nudge
      w.target = Math.max(w.min, Math.min(w.max, w.target));
    }
    // Occasional strong/random wind change
    if (Math.random() > 0.995) {
      w.target = (w.min + Math.random() * (w.max - w.min)) * (Math.random() > 0.5 ? -1 : 1);
    }
    uniforms.u_time.value = state.clock.getElapsedTime();
  });

  if (!texture) return null;

  return (
    <points ref={mesh} key={settings.count + '-' + settings.gravity}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-a_color"
          array={colors}
          count={colors.length / 4}
          itemSize={4}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={sizes.length}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-rotation"
          array={rotations}
          count={rotations.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-speed"
          array={speeds}
          count={speeds.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          array={scales}
          count={scales.length}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-distortion"
          array={distortions}
          count={distortions.length}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-brightness"
          array={brightnesses}
          count={brightnesses.length}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-contrast"
          array={contrasts}
          count={contrasts.length}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-rotationOffset"
          array={rotationOffsets}
          count={rotationOffsets.length}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-flipX"
          array={flipXs}
          count={flipXs.length}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-flipY"
          array={flipYs}
          count={flipYs.length}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-warp"
          array={warps}
          count={warps.length}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
      />
    </points>
  );
}

/**
 * SnowEffect component
 * Props:
 *   type: 'gentle' | 'storm' (default: 'gentle')
 *     - 'gentle': Gentle snowfall
 *     - 'storm': Heavy snowstorm
 */

export default function SnowEffect({ type = 'gentle', backgroundImageUrl }) {
  const settings = type === 'storm' ? STORM_SETTINGS : GENTLE_SETTINGS;
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <Canvas camera={{ position: [0, 0, 200], fov: 75 }}>
        <SnowParticles settings={settings} />
      </Canvas>
    </div>
  );
} 