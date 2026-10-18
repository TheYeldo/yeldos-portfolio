import { useEffect, useRef, useState } from 'react'
import './signature.css'

type SignatureProps = {
  paused: boolean
  tone?: 'titanium' | 'obsidian'
  progress?: number
}

const vertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentSource = `
precision highp float;
uniform vec2 u_resolution;
uniform mat3 u_rotation;
uniform float u_hover;
uniform float u_obsidian;
uniform float u_quality;

vec3 localPoint(vec3 point) {
  return u_rotation * (point - vec3(0.0, u_hover, 0.0));
}

float box2(vec2 p, vec2 size) {
  vec2 q = abs(p) - size;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
}

float monogram(vec3 point) {
  vec3 p = localPoint(point);
  // Two tapered arms and a solid stem form one continuous, legible Y.
  float outer = (abs(p.x) - 0.667 * p.y - 0.467) * 0.832;
  float inner = (-abs(p.x) + 0.632 * p.y - 0.190) * 0.845;
  float fork = max(max(outer, inner), abs(p.y - 0.515) - 0.735);
  float stem = box2(p.xy - vec2(0.0, -0.68), vec2(0.32, 0.57));
  float silhouette = min(fork, stem);

  // A restrained crown catches a softbox across the otherwise flat face.
  float crown = 0.022 * (p.x * p.x + 0.55 * p.y * p.y);
  vec2 section = vec2(silhouette, abs(p.z) - 0.24 + crown);
  return min(max(section.x, section.y), 0.0) + length(max(section, 0.0)) - 0.065;
}

vec3 normalAt(vec3 point) {
  const vec2 e = vec2(0.0012, -0.0012);
  return normalize(
    e.xyy * monogram(point + e.xyy) +
    e.yyx * monogram(point + e.yyx) +
    e.yxy * monogram(point + e.yxy) +
    e.xxx * monogram(point + e.xxx)
  );
}

float softPanel(vec3 direction, vec3 center, float threshold, float feather) {
  return smoothstep(threshold - feather, threshold + feather, dot(direction, normalize(center)));
}

vec3 studio(vec3 ray, vec3 point) {
  vec3 color = mix(vec3(0.035, 0.041, 0.048), vec3(0.23, 0.245, 0.25), smoothstep(-0.4, 1.0, ray.y));
  // A dark front flag gives the metal a dense, clean middle tone.
  color *= 1.0 - softPanel(ray, vec3(0.15, 0.0, 1.0), 0.86, 0.07) * 0.73;

  float key = softPanel(ray, vec3(-0.8, 1.1, 0.8), 0.7, 0.035);
  color += vec3(2.6, 2.5, 2.32) * key;

  // Finite rectangular studio lights make reflections move across the face.
  float plane = (3.8 - point.z) / max(ray.z, 0.001);
  vec2 onPanel = point.xy + ray.xy * plane;
  float front = smoothstep(0.05, 0.15, ray.z);
  float left = (1.0 - smoothstep(0.25, 0.42, abs(onPanel.x + 2.9))) *
    (1.0 - smoothstep(2.5, 3.3, abs(onPanel.y - 0.8))) * front;
  color += vec3(2.2, 2.28, 2.3) * left;
  float top = (1.0 - smoothstep(0.32, 0.5, abs(onPanel.y - 3.6))) *
    (1.0 - smoothstep(2.0, 3.0, abs(onPanel.x))) * front;
  color += vec3(2.1, 2.05, 1.92) * top;

  float rim = softPanel(ray, vec3(1.1, 0.4, -0.6), 0.75, 0.035);
  color += vec3(1.35, 1.45, 1.48) * rim;
  float warmFloor = softPanel(ray, vec3(0.2, -1.0, 0.5), 0.52, 0.12);
  color += vec3(0.34, 0.33, 0.285) * warmFloor;
  float accent = softPanel(ray, vec3(-0.7, -0.3, -0.8), 0.83, 0.09);
  color += vec3(0.28, 0.34, 0.11) * accent;
  return color;
}

float ambientOcclusion(vec3 point, vec3 normal) {
  float value = 0.0;
  float weight = 1.0;
  for (int i = 1; i <= 3; i++) {
    float distance = float(i) * 0.12;
    value += max(0.0, distance - monogram(point + normal * distance)) * weight;
    weight *= 0.5;
  }
  return clamp(1.0 - value * 2.4, 0.3, 1.0);
}

float groundShadow(vec3 point) {
  vec3 light = normalize(vec3(-3.5, 6.0, 4.5));
  float softness = 1.0;
  float travel = 0.04;
  for (int i = 0; i < 24; i++) {
    float distance = monogram(point + light * travel);
    softness = min(softness, 5.5 * distance / travel);
    travel += clamp(distance, 0.035, 0.3);
    if (distance < 0.002 || travel > 4.5) break;
  }
  return clamp(softness, 0.0, 1.0);
}

vec3 filmic(vec3 color) {
  color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);
  return pow(clamp(color, 0.0, 1.0), vec3(0.4545));
}

vec4 sampleScene(vec2 offset) {
  vec2 uv = ((gl_FragCoord.xy + offset) * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  vec3 origin = vec3(0.0, 0.15, 5.5);
  vec3 direction = normalize(vec3(uv * 1.08, -3.2) + vec3(0.0, -0.087, 0.0));
  float travel = 2.7;
  vec3 point = origin;
  bool hit = false;

  for (int i = 0; i < 72; i++) {
    point = origin + direction * travel;
    float distance = monogram(point);
    if (distance < 0.0012) { hit = true; break; }
    travel += distance * 0.88;
    if (travel > 8.0) break;
  }

  if (hit) {
    vec3 normal = normalAt(point);
    vec3 reflected = reflect(direction, normal);
    vec3 local = localPoint(point);
    float facing = max(dot(-direction, normal), 0.0);
    float fresnel = pow(1.0 - facing, 5.0);
    vec3 titanium = vec3(0.67, 0.7, 0.72);
    vec3 obsidian = vec3(0.15, 0.175, 0.18);
    vec3 tint = mix(titanium, obsidian, u_obsidian);
    vec3 color = studio(reflected, point) * mix(tint, vec3(0.94), fresnel);

    float keyDiffuse = max(dot(normal, normalize(vec3(-3.5, 6.0, 4.5))), 0.0);
    color += mix(vec3(0.055), vec3(0.012), u_obsidian) * keyDiffuse;
    color *= ambientOcclusion(point, normal);
    float grain = fract(sin(dot(floor(local.xy * 1200.0), vec2(127.1, 311.7))) * 43758.5453);
    color *= 0.985 + grain * 0.03;
    return vec4(filmic(color), 1.0);
  }

  // The invisible floor receives a directional, physically traced soft shadow.
  if (direction.y < -0.03) {
    float floorTravel = (-1.65 - origin.y) / direction.y;
    vec3 floorPoint = origin + direction * floorTravel;
    if (abs(floorPoint.x) < 3.0 && floorPoint.z > -3.5 && floorPoint.z < 2.0) {
      float shadow = 1.0 - groundShadow(floorPoint + vec3(0.0, 0.008, 0.0));
      float fade = 1.0 - smoothstep(1.6, 3.4, length(floorPoint.xz));
      float alpha = shadow * 0.18 * fade;
      return vec4(vec3(0.18, 0.19, 0.16) * alpha, alpha);
    }
  }
  return vec4(0.0);
}

void main() {
  vec4 color;
  if (u_quality > 0.5) {
    color = (sampleScene(vec2(-0.24, -0.24)) + sampleScene(vec2(0.24, 0.24))) * 0.5;
  } else {
    color = sampleScene(vec2(0.0));
  }
  gl_FragColor = vec4(color.rgb / max(color.a, 0.001), color.a);
}
`

function rotationMatrix(x: number, y: number, z: number, target: Float32Array) {
  const sx = Math.sin(x)
  const cx = Math.cos(x)
  const sy = Math.sin(y)
  const cy = Math.cos(y)
  const sz = Math.sin(z)
  const cz = Math.cos(z)
  target.set([
    cy * cz,
    cy * sz,
    -sy,
    sx * sy * cz - cx * sz,
    sx * sy * sz + cx * cz,
    sx * cy,
    cx * sy * cz + sx * sz,
    cx * sy * sz - sx * cz,
    cx * cy,
  ])
}

export default function Signature({ paused, tone = 'titanium', progress = 0 }: SignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const optionsRef = useRef({ paused, tone, progress })
  const renderRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    optionsRef.current = { paused, tone, progress }
    renderRef.current?.()
  }, [paused, tone, progress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const shaders: WebGLShader[] = []
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      shaders.push(shader)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
    }
    const vertex = compile(gl.VERTEX_SHADER, vertexSource)
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource)
    const program = gl.createProgram()
    const buffer = gl.createBuffer()
    const release = () => {
      shaders.forEach((shader) => gl.deleteShader(shader))
      gl.deleteProgram(program)
      gl.deleteBuffer(buffer)
    }
    if (!vertex || !fragment || !program || !buffer) {
      release()
      return
    }
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      release()
      return
    }
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      rotation: gl.getUniformLocation(program, 'u_rotation'),
      hover: gl.getUniformLocation(program, 'u_hover'),
      obsidian: gl.getUniformLocation(program, 'u_obsidian'),
      quality: gl.getUniformLocation(program, 'u_quality'),
    }
    const matrix = new Float32Array(9)
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let frame = 0
    let previous = 0
    let elapsed = 0
    let visible = true
    let disposed = false
    let contextLost = false
    let initialized = false
    let quality = 1
    let frameInterval = 0
    let lastDraw = 0
    let material = optionsRef.current.tone === 'obsidian' ? 1 : 0
    // The parent owns the motion preference, including an explicit user override.
    const canAnimate = () => !optionsRef.current.paused && visible && !document.hidden

    const render = (timestamp: number) => {
      frame = 0
      if (disposed || contextLost || !visible || document.hidden) return
      const animated = canAnimate()
      if (animated && lastDraw && timestamp - lastDraw < frameInterval) {
        frame = requestAnimationFrame(render)
        return
      }
      lastDraw = timestamp
      const delta = previous ? Math.min((timestamp - previous) / 1000, 0.05) : 1 / 60
      previous = animated ? timestamp : 0
      if (animated) {
        elapsed += delta
        const ease = 1 - Math.exp(-delta * 4)
        pointer.x += (pointer.targetX - pointer.x) * ease
        pointer.y += (pointer.targetY - pointer.y) * ease
      }
      const targetMaterial = optionsRef.current.tone === 'obsidian' ? 1 : 0
      material = animated
        ? material + (targetMaterial - material) * (1 - Math.exp(-delta * 6))
        : targetMaterial
      const scroll = Math.max(0, Math.min(1, optionsRef.current.progress))
      rotationMatrix(
        -0.12 + Math.sin(elapsed * 0.25) * 0.035 + pointer.y * 0.065,
        0.33 + Math.sin(elapsed * 0.19) * 0.075 + pointer.x * 0.1 + scroll * 0.09,
        -0.11 + Math.sin(elapsed * 0.21) * 0.018,
        matrix,
      )
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
      gl.uniformMatrix3fv(uniforms.rotation, false, matrix)
      gl.uniform1f(uniforms.hover, Math.sin(elapsed * 0.55) * 0.035)
      gl.uniform1f(uniforms.obsidian, material)
      gl.uniform1f(uniforms.quality, quality)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (!initialized) {
        initialized = true
        setReady(true)
      }
      if (animated) frame = requestAnimationFrame(render)
    }
    const requestRender = () => {
      if (!frame && !disposed && !contextLost) frame = requestAnimationFrame(render)
    }
    renderRef.current = requestRender

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const mobile = rect.width < 520
      const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1.4 : 1.5)
      const pixelBudget = Math.sqrt(
        (mobile ? 380000 : 700000) / Math.max(rect.width * rect.height, 1),
      )
      const scale = Math.min(ratio, pixelBudget)
      const width = Math.max(1, Math.round(rect.width * scale))
      const height = Math.max(1, Math.round(rect.height * scale))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
      quality = mobile ? 0 : 1
      frameInterval = mobile ? 1000 / 30 - 0.5 : 0
      requestRender()
    }
    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !canAnimate()) return
      const rect = canvas.getBoundingClientRect()
      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const resetPointer = () => {
      pointer.targetX = 0
      pointer.targetY = 0
    }
    const refreshVisibility = () => {
      previous = 0
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else requestRender()
    }
    const loseContext = () => {
      contextLost = true
      cancelAnimationFrame(frame)
      frame = 0
      setReady(false)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        previous = 0
        if (visible) requestRender()
        else {
          cancelAnimationFrame(frame)
          frame = 0
        }
      },
      { rootMargin: '80px' },
    )
    intersectionObserver.observe(canvas)
    canvas.addEventListener('pointermove', movePointer)
    canvas.addEventListener('pointerleave', resetPointer)
    canvas.addEventListener('webglcontextlost', loseContext)
    document.addEventListener('visibilitychange', refreshVisibility)
    resize()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      renderRef.current = null
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener('pointermove', movePointer)
      canvas.removeEventListener('pointerleave', resetPointer)
      canvas.removeEventListener('webglcontextlost', loseContext)
      document.removeEventListener('visibilitychange', refreshVisibility)
      release()
    }
  }, [])

  return (
    <div
      className={`signature signature--${tone}${ready ? ' signature--ready' : ''}`}
      data-motion={paused ? 'paused' : 'active'}
      aria-hidden="true"
    >
      <div className="signature__fallback">
        <div className="signature__fallback-shadow" />
        <div className="signature__fallback-depth">Y</div>
        <div className="signature__fallback-face">Y</div>
      </div>
      <canvas ref={canvasRef} className="signature__canvas" />
    </div>
  )
}
