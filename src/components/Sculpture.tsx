import { useEffect, useRef, useState } from 'react'
import './sculpture.css'

type SculptureProps = {
  paused?: boolean
  tone?: 'silver' | 'emerald'
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
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_emerald;

mat2 rotation(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float sculpture(vec3 p) {
  p.xz = rotation(0.24 + sin(u_time * 0.19) * 0.27 + u_pointer.x * 0.12) * p.xz;
  p.yz = rotation(-0.28 + cos(u_time * 0.15) * 0.13 - u_pointer.y * 0.09) * p.yz;
  p.xy = rotation(-0.53 + u_time * 0.055) * p.xy;

  float angle = atan(p.y, p.x);
  float radius = 0.94 + 0.065 * cos(angle * 3.0);
  vec2 crossSection = vec2(length(p.xy) - radius, p.z - 0.19 * sin(angle * 2.0));
  crossSection = rotation(angle + 0.45) * crossSection;
  // An elliptical section twists around a soft, asymmetric circular path.
  return (length(crossSection * vec2(0.82, 1.35)) - 0.36) * 0.72;
}

vec3 surfaceNormal(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    sculpture(p + e.xyy) - sculpture(p - e.xyy),
    sculpture(p + e.yxy) - sculpture(p - e.yxy),
    sculpture(p + e.yyx) - sculpture(p - e.yyx)
  ));
}

float panel(vec3 direction, vec3 center, float width, float softness) {
  float alignment = dot(direction, normalize(center));
  return smoothstep(width - softness, width + softness, alignment);
}

vec3 environment(vec3 direction, float roughness) {
  vec3 color = vec3(0.012, 0.014, 0.016);
  color += vec3(0.1, 0.105, 0.11) * smoothstep(-0.55, 0.9, direction.y);

  // Large photographic softboxes, a narrow rim strip, and dark studio walls.
  float softbox = panel(direction, vec3(-0.7, 1.0, 0.65), 0.57, 0.07 + roughness);
  float cutout = panel(direction, vec3(-0.53, 1.0, 0.5), 0.91, 0.02 + roughness);
  color += vec3(1.45, 1.39, 1.28) * softbox * (1.0 - cutout * 0.62);

  float strip = exp(-pow((direction.x + 0.48 * direction.y - 0.43) / (0.11 + roughness), 2.0));
  strip *= smoothstep(-0.4, 0.2, direction.z);
  color += vec3(2.1, 2.15, 2.2) * strip;

  float backlight = panel(direction, vec3(0.65, -0.3, -0.9), 0.72, 0.045 + roughness);
  color += vec3(0.72, 0.82, 0.8) * backlight;

  float green = panel(direction, vec3(-1.0, -0.35, 0.3), 0.73, 0.14);
  color += mix(vec3(0.09, 0.17, 0.14), vec3(0.1, 0.64, 0.4), u_emerald) * green;
  color *= 1.0 - panel(direction, vec3(0.1, -0.2, 1.0), 0.92, 0.045) * 0.88;
  return color;
}

float occlusion(vec3 p, vec3 normal) {
  float result = 0.0;
  float weight = 1.0;
  for (int i = 1; i <= 4; i++) {
    float distance = float(i) * 0.1;
    result += (distance - sculpture(p + normal * distance)) * weight;
    weight *= 0.55;
  }
  return clamp(1.0 - result * 1.2, 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  vec3 origin = vec3(0.0, 0.0, 4.8);
  vec3 direction = normalize(vec3(uv * 1.13, -3.0));
  float distance = 0.0;
  vec3 point = origin;
  for (int i = 0; i < 94; i++) {
    point = origin + direction * distance;
    float surface = sculpture(point);
    if (surface < 0.0013 || distance > 7.5) break;
    distance += surface;
  }

  if (distance > 7.5) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 normal = surfaceNormal(point);
  vec3 reflected = reflect(direction, normal);
  float facing = clamp(dot(-direction, normal), 0.0, 1.0);
  float fresnel = pow(1.0 - facing, 5.0);
  vec3 metal = mix(vec3(0.89, 0.9, 0.9), vec3(0.35, 0.8, 0.61), u_emerald * 0.82);
  vec3 color = environment(reflected, 0.012) * mix(metal, vec3(1.0), fresnel);
  color *= occlusion(point, normal);
  color += vec3(0.018, 0.02, 0.019) * max(dot(normal, normalize(vec3(-0.4, 1.0, 2.0))), 0.0);

  // Soft filmic contrast keeps the broad silver highlights from clipping.
  color = color / (color + vec3(0.58));
  color = pow(color, vec3(0.4545));
  gl_FragColor = vec4(color, 1.0);
}
`

export default function Sculpture({ paused = false, tone = 'silver' }: SculptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const optionsRef = useRef({ paused, tone })
  const renderRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    optionsRef.current = { paused, tone }
    renderRef.current?.()
  }, [paused, tone])

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
    if (!vertex || !fragment || !program) {
      shaders.forEach((shader) => gl.deleteShader(shader))
      if (program) gl.deleteProgram(program)
      return
    }

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((shader) => gl.deleteShader(shader))
      gl.deleteProgram(program)
      return
    }

    gl.useProgram(program)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'u_resolution')
    const time = gl.getUniformLocation(program, 'u_time')
    const pointer = gl.getUniformLocation(program, 'u_pointer')
    const emerald = gl.getUniformLocation(program, 'u_emerald')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let elapsed = 0
    let previous = 0
    let visible = true
    let disposed = false
    let contextLost = false
    let initialized = false
    const cursor = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const canAnimate = () =>
      !optionsRef.current.paused && !reducedMotion.matches && visible && !document.hidden

    const render = (timestamp: number) => {
      frame = 0
      if (disposed || contextLost || !visible || document.hidden) return
      const animated = canAnimate()
      if (animated && previous) elapsed += Math.min((timestamp - previous) / 1000, 0.05)
      previous = animated ? timestamp : 0
      if (animated) {
        cursor.x += (cursor.targetX - cursor.x) * 0.045
        cursor.y += (cursor.targetY - cursor.y) * 0.045
      }
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform1f(time, elapsed)
      gl.uniform2f(pointer, cursor.x, cursor.y)
      gl.uniform1f(emerald, optionsRef.current.tone === 'emerald' ? 1 : 0)
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
      const pixelRatio = Math.min(window.devicePixelRatio || 1, rect.width < 500 ? 1.15 : 1.4)
      const pixelBudget = Math.sqrt(540000 / Math.max(rect.width * rect.height, 1))
      const scale = Math.min(pixelRatio, pixelBudget)
      canvas.width = Math.max(1, Math.round(rect.width * scale))
      canvas.height = Math.max(1, Math.round(rect.height * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      requestRender()
    }
    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !canAnimate()) return
      const rect = canvas.getBoundingClientRect()
      cursor.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      cursor.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const resetPointer = () => {
      cursor.targetX = 0
      cursor.targetY = 0
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
      { rootMargin: '100px' },
    )
    intersectionObserver.observe(canvas)
    canvas.addEventListener('pointermove', movePointer)
    canvas.addEventListener('pointerleave', resetPointer)
    canvas.addEventListener('webglcontextlost', loseContext)
    document.addEventListener('visibilitychange', refreshVisibility)
    reducedMotion.addEventListener('change', requestRender)
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
      reducedMotion.removeEventListener('change', requestRender)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      shaders.forEach((shader) => gl.deleteShader(shader))
    }
  }, [])

  return (
    <div
      className={`sculpture${ready ? ' sculpture--ready' : ''}${paused ? ' sculpture--paused' : ''} sculpture--${tone}`}
      aria-hidden="true"
    >
      <div className="sculpture__atmosphere" />
      <div className="sculpture__fallback">
        <div className="sculpture__fallback-ring" />
      </div>
      <canvas ref={canvasRef} className="sculpture__canvas" />
      <div className="sculpture__shadow" />
    </div>
  )
}
