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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // ========================================
    // 1. WHITISH STAR FIELD (Background)
    // ========================================
    const starCount = 2500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusX = 4 + Math.random() * 4;
      const radiusY = 1.5 + Math.random() * 2;
      const radiusZ = 1 + Math.random() * 2;

      starPositions[i * 3] = Math.cos(angle) * radiusX;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * radiusY * 2;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * radiusZ * 2;

      const warmth = Math.random();
      starColors[i * 3] = 0.85 + warmth * 0.15;
      starColors[i * 3 + 1] = 0.82 + warmth * 0.18;
      starColors[i * 3 + 2] = 0.9 + (1 - warmth) * 0.1;

      starSizes[i] = Math.random() * 0.06 + 0.02;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8,
      color: 0xFFFFFF,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ========================================
    // 2. GLOW HALOS AROUND STAR CLUSTERS
    // ========================================
    const createGlowTexture = (innerColor: string, outerColor: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, innerColor);
      gradient.addColorStop(0.15, innerColor);
      gradient.addColorStop(0.4, outerColor);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const warmGlow = createGlowTexture('rgba(255, 255, 255, 1)', 'rgba(200, 180, 255, 0.3)');
    const coolGlow = createGlowTexture('rgba(255, 255, 255, 1)', 'rgba(180, 200, 255, 0.3)');

    const createGlowHalo = (x: number, y: number, z: number, size: number, texture: THREE.CanvasTexture) => {
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.4,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(x, y, z);
      sprite.scale.set(size, size, 1);
      return sprite;
    };

    const halos: THREE.Sprite[] = [];
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 4;
      const texture = i % 2 === 0 ? warmGlow : coolGlow;
      const halo = createGlowHalo(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2,
        1.5 + Math.random() * 2.5,
        texture
      );
      scene.add(halo);
      halos.push(halo);
    }

    // ========================================
    // 3. NODE NETWORK (Foreground structure)
    // ========================================
    const nodeCount = 50;
    const nodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeBaseY: number[] = [];

    const nodeGlowTexture = createGlowTexture('rgba(255, 255, 255, 1)', 'rgba(150, 170, 255, 0.3)');

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 2
      );
      nodePositions.push(pos);
      nodeBaseY.push(pos.y);

      const spriteMat = new THREE.SpriteMaterial({
        map: nodeGlowTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.6,
        color: 0x818CF8,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos);
      sprite.scale.set(0.5, 0.5, 1);
      scene.add(sprite);

      const geo = new THREE.SphereGeometry(0.04, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.userData = { sprite };
      scene.add(mesh);
      nodeMeshes.push(mesh);
    }

    // ========================================
    // 4. CONNECTION LINES
    // ========================================
    const lineGroup = new THREE.Group();
    
    const updateConnections = () => {
      while (lineGroup.children.length > 0) {
        const child = lineGroup.children[0] as THREE.Line;
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
        lineGroup.remove(child);
      }

      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const dist = nodePositions[i].distanceTo(nodePositions[j]);
          if (dist < 2.5) {
            const points = [nodePositions[i], nodePositions[j]];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const lineMat = new THREE.LineBasicMaterial({
              color: 0xC8D4FF,
              transparent: true,
              opacity: 0.12 * (1 - dist / 2.5),
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            });
            const line = new THREE.Line(lineGeo, lineMat);
            lineGroup.add(line);
          }
        }
      }
    };

    updateConnections();
    scene.add(lineGroup);

    // ========================================
    // 5. ENHANCED RINGS SYSTEM
    // ========================================
    
    // Ring type 1: Smooth flowing stream rings
    const createStreamRing = (
      radiusX: number, 
      radiusY: number, 
      y: number, 
      color: number, 
      opacity: number,
      tubeRadius: number,
      segments: number = 120
    ) => {
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radiusX,
          y + Math.sin(i * 0.15) * 0.3,
          Math.sin(angle) * radiusY
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points, true);
      const tubeGeo = new THREE.TubeGeometry(curve, 100, tubeRadius, 8, true);
      const tubeMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Mesh(tubeGeo, tubeMat);
    };

    // Ring type 2: Dashed/dotted rings
    const createDashedRing = (
      radiusX: number,
      radiusY: number,
      y: number,
      color: number,
      opacity: number,
      dashCount: number
    ) => {
      const group = new THREE.Group();
      for (let i = 0; i < dashCount; i++) {
        const angle = (i / dashCount) * Math.PI * 2;
        const nextAngle = ((i + 0.7) / dashCount) * Math.PI * 2;
        
        const points = [];
        const arcSteps = 8;
        for (let j = 0; j <= arcSteps; j++) {
          const a = angle + (j / arcSteps) * (nextAngle - angle);
          points.push(new THREE.Vector3(
            Math.cos(a) * radiusX,
            y,
            Math.sin(a) * radiusY
          ));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 6, 0.015, 6, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        group.add(new THREE.Mesh(tubeGeo, tubeMat));
      }
      return group;
    };

    // Ring type 3: Double parallel rings
    const createDoubleRing = (
      radiusX: number,
      radiusY: number,
      y: number,
      color: number,
      opacity: number,
      separation: number
    ) => {
      const group = new THREE.Group();
      [-separation, separation].forEach((offset) => {
        const ringGeo = new THREE.TorusGeometry(1, 0.012, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.scale.set(radiusX, radiusY, 1);
        ring.position.y = y + offset;
        ring.rotation.x = Math.PI / 2.3;
        group.add(ring);
      });
      return group;
    };

    // Create all rings
    const rings: { mesh: THREE.Object3D; data: any }[] = [];

    // Stream rings (elliptical flowing)
    rings.push({
      mesh: createStreamRing(4.8, 1.7, 0.3, 0x8899DD, 0.25, 0.012),
      data: { type: 'stream', speed: 0.003, axis: 'z' }
    });
    rings.push({
      mesh: createStreamRing(4.2, 1.5, -0.4, 0x99AADD, 0.18, 0.01),
      data: { type: 'stream', speed: -0.004, axis: 'x' }
    });
    rings.push({
      mesh: createStreamRing(3.6, 1.3, 1.0, 0xAABBEE, 0.15, 0.008),
      data: { type: 'stream', speed: 0.0035, axis: 'y' }
    });

    // Dashed rings (orbital paths)
    const dashedRing1 = createDashedRing(5.2, 1.9, -0.8, 0xCCDDFF, 0.2, 12);
    rings.push({
      mesh: dashedRing1,
      data: { type: 'dashed', speed: 0.002, axis: 'y' }
    });
    
    const dashedRing2 = createDashedRing(3.2, 1.1, 1.5, 0xDDE4FF, 0.15, 8);
    rings.push({
      mesh: dashedRing2,
      data: { type: 'dashed', speed: -0.003, axis: 'z' }
    });

    // Double rings (close parallel)
    rings.push({
      mesh: createDoubleRing(4.5, 1.6, -1.2, 0x8899CC, 0.15, 0.15),
      data: { type: 'double', speed: 0.002, axis: 'x' }
    });
    rings.push({
      mesh: createDoubleRing(3.9, 1.4, 1.8, 0x99AACC, 0.12, 0.12),
      data: { type: 'double', speed: -0.003, axis: 'y' }
    });

    // Add all rings to scene
    rings.forEach(r => scene.add(r.mesh));

    // ========================================
    // 6. LIGHTING
    // ========================================
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    scene.add(ambientLight);

    // ========================================
    // 7. MOUSE INTERACTION
    // ========================================
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ========================================
    // 8. ANIMATION LOOP
    // ========================================
    const clock = new THREE.Clock();
    let frameCount = 0;
    
    const animate = () => {
      const time = clock.getElapsedTime();
      frameCount++;
      requestAnimationFrame(animate);

      // Stars gently drift
      stars.rotation.y += (mouseRef.current.x * 0.2 - stars.rotation.y) * 0.015;
      stars.rotation.x += (mouseRef.current.y * 0.08 - stars.rotation.x) * 0.015;

      // Star twinkling
      starMaterial.opacity = 0.7 + Math.sin(time * 0.5) * 0.1;

      // Halos pulse
      halos.forEach((halo, i) => {
        const pulse = 1 + Math.sin(time * 1.5 + i) * 0.2;
        halo.scale.set(
          (1.5 + Math.sin(time + i) * 0.3) * pulse,
          (1.5 + Math.cos(time + i) * 0.3) * pulse,
          1
        );
        halo.material.opacity = 0.2 + Math.sin(time * 2 + i) * 0.1;
      });

      // Node animation
      nodeMeshes.forEach((mesh, i) => {
        const floatY = Math.sin(time * 0.7 + i * 0.5) * 0.35;
        const floatX = Math.cos(time * 0.5 + i * 0.3) * 0.2;
        
        mesh.position.y = nodeBaseY[i] + floatY;
        mesh.position.x = nodePositions[i].x + floatX;
        
        if (mesh.userData.sprite) {
          mesh.userData.sprite.position.copy(mesh.position);
          const pulse = 0.5 + Math.sin(time * 2 + i * 0.3) * 0.15;
          mesh.userData.sprite.scale.set(0.4 * (1 + pulse), 0.4 * (1 + pulse), 1);
        }

        nodePositions[i].y = mesh.position.y;
        nodePositions[i].x = mesh.position.x;
      });

      // Update connections every 2 seconds
      if (frameCount % 120 === 0) {
        updateConnections();
      }

      // Enhanced ring animations
      rings.forEach(({ mesh, data }) => {
        const speed = data.speed;
        const axis = data.axis as string;
        
        // Base rotation
        if (axis === 'x') mesh.rotation.x += speed;
        if (axis === 'y') mesh.rotation.y += speed;
        if (axis === 'z') mesh.rotation.z += speed;
        
        // Subtle wobble for stream rings
        if (data.type === 'stream') {
          mesh.rotation.z += Math.sin(time * 2) * 0.001;
          mesh.position.y += Math.sin(time * 1.5 + mesh.position.x) * 0.001;
        }
        
        // Pulse opacity for dashed rings
        if (data.type === 'dashed') {
          mesh.children.forEach((child: THREE.Mesh) => {
            if (child.material instanceof THREE.MeshBasicMaterial) {
              child.material.opacity = data.speed > 0 
                ? 0.15 + Math.sin(time * 3) * 0.05
                : 0.12 + Math.cos(time * 2.5) * 0.05;
            }
          });
        }
        
        // Mouse influence on closer rings
        const dist = Math.abs(mesh.position.z);
        if (dist < 2) {
          mesh.rotation.y += mouseRef.current.x * 0.005;
          mesh.rotation.x += mouseRef.current.y * 0.003;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // ========================================
    // 9. RESIZE HANDLER
    // ========================================
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ========================================
    // 10. CLEANUP
    // ========================================
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      starGeometry.dispose();
      starMaterial.dispose();
      lineGroup.children.forEach((child) => {
        (child as THREE.Line).geometry.dispose();
        ((child as THREE.Line).material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full opacity-70" />;
};