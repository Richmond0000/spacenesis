import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function EarthGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0, 4.0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.rotateSpeed = 0.55;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.72;
    renderer.domElement.style.cursor = "grab";
    controls.addEventListener("start", () => { renderer.domElement.style.cursor = "grabbing"; });
    controls.addEventListener("end", () => { renderer.domElement.style.cursor = "grab"; });

    const loader = new THREE.TextureLoader();
    const dayMap = loader.load("/assets/earth-day.jpg");
    const nightMap = loader.load("/assets/earth-night.jpg");
    const cloudMap = loader.load("/assets/earth-clouds.jpg");
    dayMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
    cloudMap.colorSpace = THREE.SRGBColorSpace;

    const earthGeometry = new THREE.SphereGeometry(1, 72, 72);
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: dayMap },
        nightMap: { value: nightMap },
        lightDirection: { value: new THREE.Vector3(-0.8, 0.25, 1).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayMap;
        uniform sampler2D nightMap;
        uniform vec3 lightDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          float daylight = smoothstep(-0.16, 0.16, dot(normalize(vNormal), normalize(lightDirection)));
          vec3 day = texture2D(dayMap, vUv).rgb;
          vec3 night = texture2D(nightMap, vUv).rgb * 1.35;
          gl_FragColor = vec4(mix(night, day, daylight), 1.0);
        }
      `,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.z = -0.12;
    scene.add(earth);

    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: 0xb8e5ff,
      map: cloudMap,
      alphaMap: cloudMap,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.008, 64, 64), cloudMaterial);
    scene.add(clouds);

    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float rim = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
          gl_FragColor = vec4(0.2, 0.62, 1.0, rim * 0.72);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.075, 64, 64), atmosphereMaterial);
    scene.add(atmosphere);

    const starPositions = [];
    for (let i = 0; i < 260; i += 1) {
      const radius = 5 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xb8dfff, size: 0.025, transparent: true, opacity: 0.78 }));
    scene.add(stars);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let previous = 0;
    renderer.setAnimationLoop((time) => {
      const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      if (!reducedMotion) {
        earth.rotation.y += delta * 0.12;
        clouds.rotation.y += delta * 0.15;
      }
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      observer.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      dayMap.dispose();
      nightMap.dispose();
      cloudMap.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      clouds.geometry.dispose();
      cloudMaterial.dispose();
      atmosphere.geometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      stars.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="earth-globe" ref={mountRef} role="img" aria-label="Slowly rotating 3D Earth with day and night lights, clouds, and blue atmosphere" />;
}
