'use client'

import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Silk material shader - creates realistic fabric appearance
const silkVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vElevation;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Base wave animation - slow, hypnotic movement
    float wave1 = snoise(vec3(pos.x * 0.5, pos.y * 0.5, uTime * 0.15)) * 0.3;
    float wave2 = snoise(vec3(pos.x * 0.8, pos.y * 0.3, uTime * 0.1 + 100.0)) * 0.2;
    float wave3 = snoise(vec3(pos.x * 1.2, pos.y * 0.7, uTime * 0.2 + 200.0)) * 0.1;
    
    float elevation = wave1 + wave2 + wave3;
    
    // Mouse interaction - fabric responds to cursor
    float dist = distance(uv, uMouse);
    float mouseEffect = smoothstep(0.4, 0.0, dist) * uMouseInfluence;
    elevation -= mouseEffect * 0.5;
    
    pos.z += elevation;
    
    vElevation = elevation;
    vPosition = pos;
    vNormal = normal;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const silkFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vElevation;
  
  void main() {
    // Silk base color - cream/pearl tone
    vec3 baseColor = mix(uColor1, uColor2, vUv.y * 0.5 + 0.25);
    
    // Add subtle color variation based on elevation (fold highlights)
    float highlight = smoothstep(-0.2, 0.3, vElevation);
    baseColor = mix(baseColor, uColor3, highlight * 0.3);
    
    // Simulate silk sheen - lighter where fabric catches light
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
    baseColor += fresnel * 0.15;
    
    // Add subtle gradient for depth
    float gradient = smoothstep(0.0, 1.0, vUv.y);
    baseColor = mix(baseColor * 0.95, baseColor, gradient);
    
    // Soft vignette
    float vignette = smoothstep(1.5, 0.5, length(vUv - 0.5) * 2.0);
    baseColor *= 0.9 + vignette * 0.1;
    
    gl_FragColor = vec4(baseColor, 0.95);
  }
`

// The 3D Silk mesh component
function SilkMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 })
  const mouseInfluenceRef = useRef(0)
  
  const { viewport, size } = useThree()
  
  // Create shader material with uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uMouseInfluence: { value: 0 },
    uColor1: { value: new THREE.Color('#FAF8F5') }, // Off-white
    uColor2: { value: new THREE.Color('#F5F0E8') }, // Warm beige  
    uColor3: { value: new THREE.Color('#FFFFF0') }, // Ivory highlight
  }), [])
  
  // Handle mouse movement
  const handlePointerMove = useCallback((e: THREE.Event) => {
    if (!e.uv) return
    targetMouseRef.current = { x: e.uv.x, y: e.uv.y }
    mouseInfluenceRef.current = 1
  }, [])
  
  const handlePointerLeave = useCallback(() => {
    mouseInfluenceRef.current = 0
  }, [])
  
  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return
    
    const material = meshRef.current.material as THREE.ShaderMaterial
    
    // Update time
    material.uniforms.uTime.value = state.clock.elapsedTime
    
    // Smooth mouse following
    mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05
    mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05
    
    material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y)
    
    // Smooth mouse influence
    const currentInfluence = material.uniforms.uMouseInfluence.value
    const targetInfluence = mouseInfluenceRef.current
    material.uniforms.uMouseInfluence.value += (targetInfluence - currentInfluence) * 0.1
  })
  
  // Calculate plane size to fill viewport
  const planeSize = useMemo(() => {
    const aspect = size.width / size.height
    if (aspect > 1) {
      return [viewport.width * 1.2, viewport.width * 1.2 / aspect]
    }
    return [viewport.height * aspect * 1.2, viewport.height * 1.2]
  }, [viewport, size])
  
  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[planeSize[0], planeSize[1], 128, 128]} />
      <shaderMaterial
        vertexShader={silkVertexShader}
        fragmentShader={silkFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Main canvas component
export default function SilkCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <SilkMesh />
      </Canvas>
    </div>
  )
}
