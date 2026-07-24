'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

function LashSphere() {
  const groupRef = useRef<THREE.Group>(null)

  const lashPositions = useMemo(() => {
    const arr: number[] = []
    for (let i = 0; i < 650; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const r = 1.25
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      arr.push(x, y, z)
      const len = 0.07 + Math.random() * 0.42
      arr.push(x * (1 + len), y * (1 + len), z * (1 + len))
    }
    return new Float32Array(arr)
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.095
    groupRef.current.rotation.x = Math.sin(t * 0.065) * 0.22
    groupRef.current.rotation.z = Math.sin(t * 0.048) * 0.09
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.25, 3]} />
        <meshBasicMaterial color="#c2a079" wireframe transparent opacity={0.16} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lashPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#c2a079" transparent opacity={0.68} />
      </lineSegments>
    </group>
  )
}

function GoldParticles() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(240 * 3)
    for (let i = 0; i < 240; i++) {
      const r = 2.3 + Math.random() * 2.8
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.022
    ref.current.rotation.x = Math.sin(t * 0.014) * 0.12
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#c2a079" transparent opacity={0.42} sizeAttenuation />
    </points>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.4]} fov={54} />
      <ambientLight intensity={0.12} />
      <pointLight position={[5, 3, 4]} intensity={1.4} color="#c2a079" />
      <pointLight position={[-4, -2, 2]} intensity={0.55} color="#7a4f28" />
      <LashSphere />
      <GoldParticles />
    </>
  )
}

export function LashCanvas() {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} className="size-full">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
