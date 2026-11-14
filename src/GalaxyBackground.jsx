import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function makeGalaxyPoints(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const core = new THREE.Color("#ffb477");
  const middle = new THREE.Color("#a176ff");
  const outer = new THREE.Color("#5bbaff");

  for (let i = 0; i < count; i += 1) {
    const radius = Math.pow(Math.random(), 1.55) * 10.2;
    const arm = Math.floor(Math.random() * 3);
    const angle = arm * (Math.PI * 2 / 3) + radius * 0.58 + (Math.random() - 0.5) * 0.65;
    const scatter = 0.1 + Math.random() * 0.32 + radius * 0.02;
    const offset = i * 3;
    positions[offset] = Math.cos(angle) * radius + (Math.random() - 0.5) * scatter;
    positions[offset + 1] = (Math.random() - 0.5) * scatter * 0.7;
    positions[offset + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * scatter;

    const blend = Math.min(radius / 10.2, 1);
    const color = blend < 0.48
      ? core.clone().lerp(middle, blend / 0.48)
      : middle.clone().lerp(outer, (blend - 0.48) / 0.52);
    color.multiplyScalar(0.7 + Math.random() * 0.55);
    colors[offset] = color.r;
    colors[offset + 1] = color.g;
    colors[offset + 2] = color.b;
    sizes[i] = radius < 1.8 ? 0.08 + Math.random() * 0.04 : 0.05 + Math.random() * 0.04;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  return geometry;
}

function makeBackgroundStars(count) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;
    positions[offset] = (Math.random() - 0.5) * 42;
    positions[offset + 1] = (Math.random() - 0.5) * 25;
    positions[offset + 2] = -6 - Math.random() * 18;
    sizes[i] = 0.018 + Math.random() * 0.015;
    colors[offset] = 0.66;
    colors[offset + 1] = 0.78;
    colors[offset + 2] = 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function addSpiralArms(galaxy) {
  const armColors = ["#ffc08a", "#9f83ff", "#69baff"];
  const armResources = [];
  for (let arm = 0; arm < 3; arm += 1) {
    const curvePoints = [];
    for (let step = 0; step <= 260; step += 1) {
      const progress = step / 260;
      const radius = 0.28 + progress * 9.5;
      const angle = arm * (Math.PI * 2 / 3) + progress * Math.PI * 2;
      curvePoints.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 2.2) * 0.08,
        Math.sin(angle) * radius,
      ));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const hazeGeometry = new THREE.TubeGeometry(curve, 360, 0.12, 5, false);
    const hazeMaterial = new THREE.MeshBasicMaterial({ color: armColors[arm], transparent: true, opacity: 0.055, depthWrite: false, blending: THREE.AdditiveBlending });
    const haze = new THREE.Mesh(hazeGeometry, hazeMaterial);
    galaxy.add(haze);
    armResources.push(hazeGeometry, hazeMaterial);

    const coreGeometry = new THREE.TubeGeometry(curve, 360, 0.028, 5, false);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: armColors[arm], transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    galaxy.add(core);
    armResources.push(coreGeometry, coreMaterial);
  }
  return armResources;
}

function makePointMaterial(opacity) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: { value: opacity },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
      uViewportHeight: { value: window.innerHeight },
      uFovRadians: { value: 52 * Math.PI / 180 },
    },
    vertexShader: `
      attribute float aSize;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uPixelRatio;
      uniform float uViewportHeight;
      uniform float uFovRadians;
      void main() {
        vColor = color;
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        float focalPixels = uViewportHeight / (2.0 * tan(uFovRadians * 0.5));
        gl_PointSize = clamp(aSize * uPixelRatio * focalPixels / max(-viewPosition.z, 1.0), 1.0, 7.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      uniform float uOpacity;
      void main() {
        float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
        float softCircle = 1.0 - smoothstep(0.12, 0.5, distanceFromCenter);
        gl_FragColor = vec4(vColor, softCircle * uOpacity);
      }
    `,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function makeCoreTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 4, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,220,174,0.8)");
  gradient.addColorStop(0.12, "rgba(255,157,117,0.42)");
  gradient.addColorStop(0.4, "rgba(170,108,255,0.15)");
  gradient.addColorStop(1, "rgba(85,142,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export default function GalaxyBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 4.4, 13.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const galaxy = new THREE.Group();
    galaxy.rotation.x = 0.5;
    scene.add(galaxy);
    const spiralResources = addSpiralArms(galaxy);

    const galaxyGeometry = makeGalaxyPoints(20000);
    const galaxyMaterial = makePointMaterial(0.62);
    galaxy.add(new THREE.Points(galaxyGeometry, galaxyMaterial));

    const coreTexture = makeCoreTexture();
    const core = new THREE.Sprite(new THREE.SpriteMaterial({
      map: coreTexture,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    core.scale.set(6.8, 6.8, 1);
    galaxy.add(core);

    const starGeometry = makeBackgroundStars(1700);
    const starMaterial = makePointMaterial(0.38);
    scene.add(new THREE.Points(starGeometry, starMaterial));

    const rotation = { x: galaxy.rotation.x, y: 0 };
    let pointer = null;
    let lastTime = 0;
    let dragging = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isForegroundControl = (target) => target instanceof Element && Boolean(target.closest(
      "button, a, input, select, textarea, [role='button'], .sidebar, .topbar, .panel, .metric-card, .hero-earth, .module-earth, .welcome-copy, .health-banner, .entry-form, .checkin-form, .bone-assessment-form, .modal-scrim",
    ));
    const onPointerDown = (event) => {
      if (event.button !== 0 || isForegroundControl(event.target)) return;
      pointer = { x: event.clientX, y: event.clientY };
      dragging = true;
    };
    const onPointerMove = (event) => {
      if (!dragging || !pointer) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      rotation.y += dx * 0.004;
      rotation.x = THREE.MathUtils.clamp(rotation.x + dy * 0.003, -0.75, 0.75);
      pointer = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = () => { dragging = false; pointer = null; };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      galaxyMaterial.uniforms.uViewportHeight.value = window.innerHeight;
      starMaterial.uniforms.uViewportHeight.value = window.innerHeight;
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointermove", onPointerMove, true);
    window.addEventListener("pointerup", onPointerUp, true);
    window.addEventListener("pointercancel", onPointerUp, true);
    window.addEventListener("resize", onResize);

    renderer.setAnimationLoop((time) => {
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      if (!reducedMotion && !dragging) rotation.y += delta * 0.018;
      galaxy.rotation.y += (rotation.y - galaxy.rotation.y) * 0.07;
      galaxy.rotation.x += (rotation.x - galaxy.rotation.x) * 0.07;
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onPointerUp, true);
      window.removeEventListener("resize", onResize);
      renderer.setAnimationLoop(null);
      galaxyGeometry.dispose();
      galaxyMaterial.dispose();
      spiralResources.forEach((resource) => resource.dispose());
      coreTexture.dispose();
      core.material.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="galaxy-background" ref={mountRef} aria-hidden="true" />;
}
