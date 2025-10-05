"use client"

import type React from "react"

import { useEffect, useRef } from "react"

// GLSL utility functions
const declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`

const proceduralHash11 = `
  float hash11(float p) {
    p = fract(p * 0.3183099) + 0.1;
    p *= p + 19.19;
    return fract(p * p);
  }
`

const proceduralHash21 = `
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`

const simplexNoise = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`

// Vertex shader
const vertexShaderSource = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`

// Fragment shader
const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_shape;
uniform float u_type;
uniform float u_pxSize;
uniform float u_onlyShape;
uniform float u_debug;      // 1.0 => mode debug (heatmap)
uniform float u_pulse;      // intensité pulsation (0..1)

out vec4 fragColor;

${simplexNoise}
${declarePI}
${proceduralHash11}
${proceduralHash21}

float getSimplexNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));
  return noise;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
  0,  8,  2, 10,
 12,  4, 14,  6,
  3, 11,  1,  9,
 15,  7, 13,  5
);

const int bayer8x8[64] = int[64](
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(mod(uv, float(size)));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}

void main() {
  float t = .5 * u_time;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv -= .5;
  
  // Apply pixelization
  float pxSize = u_pxSize;
  vec2 pxSizeUv = gl_FragCoord.xy;
  pxSizeUv -= .5 * u_resolution;
  pxSizeUv /= pxSize;
  vec2 pixelizedUv = floor(pxSizeUv) * pxSize / u_resolution.xy;
  pixelizedUv += .5;
  pixelizedUv -= .5;
  
  vec2 shape_uv = pixelizedUv;
  vec2 dithering_uv = pxSizeUv;
  vec2 ditheringNoise_uv = uv * u_resolution;

  float shape = 0.;
  if (u_shape < 1.5) {
    // Simplex noise
    shape_uv *= .001;
    shape = 0.5 + 0.5 * getSimplexNoise(shape_uv, t);
    shape = smoothstep(0.3, 0.9, shape);

  } else if (u_shape < 2.5) {
    // Warp
    shape_uv *= .003;
    for (float i = 1.0; i < 6.0; i++) {
      shape_uv.x += 0.6 / i * cos(i * 2.5 * shape_uv.y + t);
      shape_uv.y += 0.6 / i * cos(i * 1.5 * shape_uv.x + t);
    }
    shape = .15 / abs(sin(t - shape_uv.y - shape_uv.x));
    shape = smoothstep(0.02, 1., shape);

  } else if (u_shape < 3.5) {
    // Dots
    shape_uv *= .05;
    float stripeIdx = floor(2. * shape_uv.x / TWO_PI);
    float rand = hash11(stripeIdx * 10.);
    rand = sign(rand - .5) * pow(.1 + abs(rand), .4);
    shape = sin(shape_uv.x) * cos(shape_uv.y - 5. * rand * t);
    shape = pow(abs(shape), 6.);

  } else if (u_shape < 4.5) {
    // Sine wave
    shape_uv *= 4.;
    float wave = cos(.5 * shape_uv.x - 2. * t) * sin(1.5 * shape_uv.x + t) * (.75 + .25 * cos(3. * t));
    shape = 1. - smoothstep(-1., 1., shape_uv.y + wave);

  } else if (u_shape < 5.5) {
    // Ripple
    float dist = length(shape_uv);
    float waves = sin(pow(dist, 1.7) * 7. - 3. * t) * .5 + .5;
    shape = waves;

  } else if (u_shape < 6.5) {
    // Swirl
    float l = length(shape_uv);
    float angle = 6. * atan(shape_uv.y, shape_uv.x) + 4. * t;
    float twist = 1.2;
    float offset = pow(l, -twist) + angle / TWO_PI;
    float mid = smoothstep(0., 1., pow(l, twist));
    shape = mix(0., fract(offset), mid);

  } else {
    // Sphere robuste
    // Correction du ratio d'aspect pour éviter l'ellipse: on reconstruit coords normalisées (-1..1)
    vec2 aspectUv = shape_uv;
    float aspect = u_resolution.x / u_resolution.y;
    aspectUv.x *= aspect;
    aspectUv *= 2.0; // zoom

    float lenSq = dot(aspectUv, aspectUv);
    float d = 1.0 - lenSq; // >0 à l'intérieur
    float inside = step(0.0, d);
    // Sécuriser sqrt
    float z = sqrt(max(d, 0.0));
    vec3 pos = vec3(aspectUv, z);

    vec3 lightPos = normalize(vec3(cos(1.5 * t), 0.8, sin(1.25 * t)));
    float ndl = clamp(dot(lightPos, pos), -1.0, 1.0);
    float lighting = 0.5 + 0.5 * ndl;
    lighting = pow(lighting, 1.15);

    // Rim (utilise d proche de 0)
    float rim = smoothstep(0.0, 0.22, d) * 0.55;

    // Base shading
    float sphereVal = (lighting + rim) * inside;

    // Pulsation douce (si u_pulse>0)
    if (u_pulse > 0.001) {
      float puls = 0.5 + 0.5 * sin(t * 1.2);
      sphereVal *= mix(1.0, 0.85 + 0.3 * puls, clamp(u_pulse, 0.0, 1.0));
    }

    // Remap pour augmenter contraste général
    sphereVal = smoothstep(0.05, 0.95, sphereVal);
    shape = sphereVal;
  }

  int type = int(floor(u_type));
  float dithering = 0.0;

  switch (type) {
    case 1: {
      dithering = step(hash21(ditheringNoise_uv), shape);
    } break;
    case 2:
      dithering = getBayerValue(dithering_uv, 2);
      break;
    case 3:
      dithering = getBayerValue(dithering_uv, 4);
      break;
    default:
      dithering = getBayerValue(dithering_uv, 8);
      break;
  }

  dithering -= .5;
  float res;
  if (u_onlyShape > 0.5) {
    // Pas de dithering: utiliser directement la valeur shape (après remap)
    res = clamp(shape, 0.0, 1.0);
  } else {
    res = step(.5, shape + dithering);
  }

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  if (u_onlyShape > 0.5) {
    opacity = res; // sphere nette
  } else {
    color += bgColor * (1. - opacity);
    opacity += bgOpacity * (1. - opacity);
  }

  // Mode debug: heatmap
  if (u_debug > 0.5) {
    vec3 heat = vec3(res, shape, 0.5 + 0.5 * sin(res * 10.0));
    fragColor = vec4(heat, 1.0);
  } else {
    fragColor = vec4(color, opacity);
  }
}
`

// Shape and type enums
export const DitheringShapes = {
  simplex: 1,
  warp: 2,
  dots: 3,
  wave: 4,
  ripple: 5,
  swirl: 6,
  sphere: 7,
} as const

export const DitheringTypes = {
  random: 1,
  "2x2": 2,
  "4x4": 3,
  "8x8": 4,
} as const

export type DitheringShape = keyof typeof DitheringShapes
export type DitheringType = keyof typeof DitheringTypes

interface DitheringShaderProps {
  /** Largeur explicite en pixels (désactive autoResize si fourni avec autoResize=false) */
  width?: number
  /** Hauteur explicite en pixels */
  height?: number
  /** Couleur d'arrière-plan (hex) */
  colorBack?: string
  /** Couleur de premier plan (hex) */
  colorFront?: string
  /** Forme / pattern */
  shape?: DitheringShape
  /** Type de dithering */
  type?: DitheringType
  /** Taille pixelisation interne (shader) */
  pxSize?: number
  /** Vitesse d'animation (0 pour figer) */
  speed?: number
  /** Classe wrapper */
  className?: string
  /** Style wrapper */
  style?: React.CSSProperties
  /** Adapter automatiquement à la taille du conteneur (par défaut true) */
  autoResize?: boolean
  /** Prendre en compte le devicePixelRatio (sharp) */
  highDpi?: boolean
  /** Pauser si hors écran (IntersectionObserver) */
  pauseOffscreen?: boolean
  /** Ne rendre que la forme (fond totalement transparent hors forme) */
  onlyShape?: boolean
  /** Activer mode debug (heatmap) */
  debug?: boolean
  /** Intensité de pulsation (0..1) */
  pulse?: number
}

function parseColor(input: string): [number, number, number, number] {
  if (!input) return [0, 0, 0, 1]
  const trimmed = input.trim()

  // rgba() or rgb()
  if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgba?\(([^)]+)\)/i)
    if (match) {
      const parts = match[1].split(',').map(p => p.trim())
      if (parts.length >= 3) {
        const r = Math.min(255, Math.max(0, Number(parts[0]))) / 255
        const g = Math.min(255, Math.max(0, Number(parts[1]))) / 255
        const b = Math.min(255, Math.max(0, Number(parts[2]))) / 255
        const a = parts.length >= 4 ? Math.min(1, Math.max(0, Number(parts[3]))) : 1
        return [r, g, b, a]
      }
    }
  }

  // #RRGGBB or #RRGGBBAA
  const hex = trimmed.replace('#', '')
  if (/^[a-fA-F0-9]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16) / 255
    const g = parseInt(hex.slice(2, 4), 16) / 255
    const b = parseInt(hex.slice(4, 6), 16) / 255
    return [r, g, b, 1]
  }
  if (/^[a-fA-F0-9]{8}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16) / 255
    const g = parseInt(hex.slice(2, 4), 16) / 255
    const b = parseInt(hex.slice(4, 6), 16) / 255
    const a = parseInt(hex.slice(6, 8), 16) / 255
    return [r, g, b, a]
  }
  return [0, 0, 0, 1]
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

  if (!vertexShader || !fragmentShader) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function DitheringShader({
  width = 800,
  height = 800,
  colorBack = "#000000",
  colorFront = "#723131ff",
  shape = "simplex",
  type = "8x8",
  pxSize = 4,
  speed = 1,
  className = "",
  style = {},
  autoResize = true,
  highDpi = true,
  pauseOffscreen = true,
  onlyShape = false,
  debug = false,
  pulse = 0,
}: DitheringShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const programRef = useRef<WebGLProgram | null>(null)
  const glRef = useRef<WebGL2RenderingContext | null>(null)
  const uniformLocationsRef = useRef<Record<string, WebGLUniformLocation | null>>({})
  const startTimeRef = useRef<number>(Date.now())
  const runningRef = useRef<boolean>(true)

  // Dynamic props refs (pour éviter de recréer le programme à chaque changement)
  const propsRef = useRef({ colorBack, colorFront, shape, type, pxSize, speed, onlyShape, debug, pulse })

  // Mettre à jour refs quand props changent
  useEffect(() => {
    propsRef.current = { colorBack, colorFront, shape, type, pxSize, speed, onlyShape, debug, pulse }
  }, [colorBack, colorFront, shape, type, pxSize, speed, onlyShape, debug, pulse])

  // Initialisation (une seule fois)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false })
    if (!gl) {
      console.error("WebGL2 not supported")
      return
    }

  glRef.current = gl
  // Activer blending pour rendu alpha correct
  gl.enable(gl.BLEND)
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    // Create shader program
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)
    if (!program) return

    programRef.current = program

    // Get uniform locations
    uniformLocationsRef.current = {
      u_time: gl.getUniformLocation(program, "u_time"),
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_colorBack: gl.getUniformLocation(program, "u_colorBack"),
      u_colorFront: gl.getUniformLocation(program, "u_colorFront"),
      u_shape: gl.getUniformLocation(program, "u_shape"),
      u_type: gl.getUniformLocation(program, "u_type"),
      u_pxSize: gl.getUniformLocation(program, "u_pxSize"),
      u_onlyShape: gl.getUniformLocation(program, "u_onlyShape"),
      u_debug: gl.getUniformLocation(program, "u_debug"),
      u_pulse: gl.getUniformLocation(program, "u_pulse"),
    }

    // Set up position attribute
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    function resize() {
      if (!glRef.current || !canvas) return
      const glCtx = glRef.current
      let targetWidth = width
      let targetHeight = height

      if (autoResize) {
        const rect = canvas.parentElement?.getBoundingClientRect()
        if (rect) {
          targetWidth = Math.max(1, Math.floor(rect.width))
          targetHeight = Math.max(1, Math.floor(rect.height))
        }
      }

      const dpr = highDpi ? window.devicePixelRatio || 1 : 1
      const displayWidth = Math.floor(targetWidth * dpr)
      const displayHeight = Math.floor(targetHeight * dpr)
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
      }
      glCtx.viewport(0, 0, displayWidth, displayHeight)
    }

    resize()

    let resizeObserver: ResizeObserver | null = null
    if (autoResize && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => resize())
      resizeObserver.observe(canvas.parentElement || canvas)
    } else if (!autoResize) {
      // Fallback: simple resize listener si fixed size mais DPR change
      window.addEventListener('resize', resize)
    }

    let intersectionObserver: IntersectionObserver | null = null
    if (pauseOffscreen && typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          runningRef.current = entry.isIntersecting
          if (entry.isIntersecting) {
            // redémarrer si stoppé
            if (!animationRef.current && propsRef.current.speed !== 0) {
              startTimeRef.current = Date.now()
              animationRef.current = requestAnimationFrame(render)
            }
          }
        })
      }, { threshold: 0 })
      intersectionObserver.observe(canvas)
    }

    // Animation loop
    const render = () => {
  const { colorBack: cBack, colorFront: cFront, shape: sh, type: ty, pxSize: pSize, speed: spd, onlyShape: oSh, debug: dbg, pulse: pls } = propsRef.current
      const currentTime = (Date.now() - startTimeRef.current) * 0.001 * spd

      const context = glRef.current
      const shaderProgram = programRef.current

      if (!context || !shaderProgram) return
      if (!runningRef.current) {
        animationRef.current = undefined
        return
      }

  context.clearColor(0,0,0,0)
  context.clear(context.COLOR_BUFFER_BIT)
      context["useProgram"](shaderProgram)

      // Set uniforms
      const locations = uniformLocationsRef.current

      if (locations.u_time) context.uniform1f(locations.u_time, currentTime)
      if (locations.u_resolution) context.uniform2f(locations.u_resolution, canvas.width, canvas.height)
  if (locations.u_colorBack) context.uniform4fv(locations.u_colorBack, parseColor(cBack))
  if (locations.u_colorFront) context.uniform4fv(locations.u_colorFront, parseColor(cFront))
      if (locations.u_shape) context.uniform1f(locations.u_shape, DitheringShapes[sh])
      if (locations.u_type) context.uniform1f(locations.u_type, DitheringTypes[ty])
  if (locations.u_pxSize) context.uniform1f(locations.u_pxSize, pSize)
  if (locations.u_onlyShape) context.uniform1f(locations.u_onlyShape, oSh ? 1 : 0)
  if (locations.u_debug) context.uniform1f(locations.u_debug, dbg ? 1 : 0)
  if (locations.u_pulse) context.uniform1f(locations.u_pulse, pls)

      context.drawArrays(context.TRIANGLES, 0, 6)

      if (spd !== 0) {
        animationRef.current = requestAnimationFrame(render)
      } else {
        animationRef.current = undefined
      }
    }

    const renderRef = { current: render }

    function startAnimation() {
      if (propsRef.current.speed !== 0 && !animationRef.current) {
        animationRef.current = requestAnimationFrame(renderRef.current)
      }
    }

    startAnimation()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (glRef.current && programRef.current) {
        glRef.current.deleteProgram(programRef.current)
      }
      if (resizeObserver) resizeObserver.disconnect()
      window.removeEventListener('resize', resize)
      if (intersectionObserver) intersectionObserver.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Si width/height changent ET autoResize désactivé => forcer un resize manuel
  useEffect(() => {
    if (!autoResize) {
      const canvas = canvasRef.current
      const gl = glRef.current
      if (canvas && gl) {
        const dpr = highDpi ? window.devicePixelRatio || 1 : 1
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
    }
  }, [width, height, autoResize, highDpi])

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: autoResize ? '100%' : width,
        height: autoResize ? '100%' : height,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
