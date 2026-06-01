import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 500 }) {
  const mesh = useRef();
  const light = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Purple-blue gradient colors
      colors[i * 3] = 0.4 + Math.random() * 0.3;
      colors[i * 3 + 1] = 0.2 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.02;
      mesh.current.rotation.y = time * 0.03;
    }
    if (light.current) {
      light.current.position.x = Math.sin(time * 0.5) * 5;
      light.current.position.y = Math.cos(time * 0.3) * 5;
    }
  });

  return (
    <>
      <pointLight ref={light} color="#8b5cf6" intensity={2} distance={15} />
      <pointLight position={[-5, 3, -5]} color="#6366f1" intensity={1} distance={12} />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

export default function ParticleField() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.1} />
        <Particles count={400} />
      </Canvas>
    </div>
  );
}
