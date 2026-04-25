"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Main Geometry
    const geometry = new THREE.TorusKnotGeometry(2.8, 0.8, 128, 32);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x10B981,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.5,
      thickness: 2,
      transparent: true,
      wireframe: true,
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Floating Particles - refined distribution
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i += 3) {
      // Spiral distribution for more organized look
      const t = (i / 3) / particlesCount;
      const radius = 3 + t * 2;
      const angle = t * Math.PI * 8;
      posArray[i] = Math.cos(angle) * radius;
      posArray[i + 1] = (Math.random() - 0.5) * 8;
      posArray[i + 2] = Math.sin(angle) * radius;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x34D399,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.6
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10B981, 10);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x00f2ff, 5);
    blueLight.position.set(-5, -5, 2);
    scene.add(blueLight);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      requestAnimationFrame(animate);
      
      // Subtle mouse follow
      torusKnot.rotation.x = elapsedTime * 0.2 + mouseRef.current.y * 0.2;
      torusKnot.rotation.y = elapsedTime * 0.3 + mouseRef.current.x * 0.3;
      
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full opacity-60" />;
};