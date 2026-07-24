'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function LashCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      54,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 4.4)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Grupo principal (esfera + cílios), roda junto
    const group = new THREE.Group()
    scene.add(group)

    // Núcleo wireframe dourado
    const coreGeo = new THREE.IcosahedronGeometry(1.25, 3)
    const coreMat = new THREE.MeshBasicMaterial({
      color: '#c2a079',
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    })
    group.add(new THREE.Mesh(coreGeo, coreMat))

    // Fios de cílios irradiando da superfície
    const lashArr: number[] = []
    for (let i = 0; i < 650; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const r = 1.25
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      lashArr.push(x, y, z)
      const len = 0.07 + Math.random() * 0.42
      lashArr.push(x * (1 + len), y * (1 + len), z * (1 + len))
    }
    const lashGeo = new THREE.BufferGeometry()
    lashGeo.setAttribute('position', new THREE.Float32BufferAttribute(lashArr, 3))
    const lashMat = new THREE.LineBasicMaterial({
      color: '#c2a079',
      transparent: true,
      opacity: 0.68,
    })
    group.add(new THREE.LineSegments(lashGeo, lashMat))

    // Partículas douradas flutuando ao redor
    const particleArr = new Float32Array(240 * 3)
    for (let i = 0; i < 240; i++) {
      const r = 2.3 + Math.random() * 2.8
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      particleArr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      particleArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      particleArr[i * 3 + 2] = r * Math.cos(phi)
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particleArr, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.02,
      color: '#c2a079',
      transparent: true,
      opacity: 0.42,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Iluminação
    scene.add(new THREE.AmbientLight(0xffffff, 0.12))
    const light1 = new THREE.PointLight(0xc2a079, 1.4)
    light1.position.set(5, 3, 4)
    scene.add(light1)
    const light2 = new THREE.PointLight(0x7a4f28, 0.55)
    light2.position.set(-4, -2, 2)
    scene.add(light2)

    // Responsividade
    const onResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // Loop de animação
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = performance.now() / 1000
      group.rotation.y = t * 0.095
      group.rotation.x = Math.sin(t * 0.065) * 0.22
      group.rotation.z = Math.sin(t * 0.048) * 0.09
      particles.rotation.y = t * 0.022
      particles.rotation.x = Math.sin(t * 0.014) * 0.12
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      coreGeo.dispose()
      coreMat.dispose()
      lashGeo.dispose()
      lashMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
    }
  }, [])

  return <div ref={containerRef} className="size-full" />
}
