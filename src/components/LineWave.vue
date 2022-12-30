<!-- eslint-disable no-tabs -->
<script setup lang="ts">
import * as THREE from 'three'
import { Color } from 'three'
import { isDark } from '~/logics'
const mask = computed(() => 'radial-gradient(circle, transparent, black);')
const el = ref<HTMLCanvasElement | null>(null)
const webglContainer = ref<HTMLCanvasElement | null>(null)
let camera: THREE.OrthographicCamera | null = null
let scene: THREE.Scene | null = null
let renderer: THREE.WebGLRenderer | null = null
let clock: THREE.Clock | null = null
let uniforms1: any = null
const uniforms2 = ref()
const vertexShader = `
      varying vec2 vUv;
			void main()
			{
				vUv = uv;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position = projectionMatrix * mvPosition;
			}
`
const fragmentShader = `
      uniform float time;
			varying vec2 vUv;
			void main( void ) {
				vec2 position = - 0.0 + 3.0 * vUv;
				float red = abs( sin( position.x * position.y + time / 5.0 ) );
				float green = abs( sin( position.x * position.y + time / 4.0 ) );
				float blue = abs( sin( position.x * position.y + time / 3.0 ) );
				gl_FragColor = vec4( red, green, blue, 1.0 );
			}
`

const { random } = Math
const size = reactive(useWindowSize())

function init() {
  scene = new THREE.Scene()
  clock = new THREE.Clock()
  camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -5000, 5000)
  camera.position.set(30, 30, 30)
  camera.updateProjectionMatrix()
  camera.lookAt(scene.position)

  const cubeSize = 80

  const geometry = new THREE.BoxGeometry(1, cubeSize * 4, 1)
  uniforms1 = {
    time: { value: 1.0 },
  }

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms1,
    vertexShader,
    fragmentShader,
  })
  for (let i = 0; i < 1000; i++) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = i * 4 - cubeSize * 12.5 * 2
    mesh.rotation.z = i * 0.01
    scene.add(mesh)
  }

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  if (isDark.value)
    renderer!.setClearColor(new Color('#050505'), 1)
  else
    renderer!.setClearColor(new Color('#dbdbdb'), 1)
  webglContainer.value!.appendChild(renderer.domElement)

  onWindowResize()
  window.addEventListener('resize', onWindowResize, false)
}
function onWindowResize() {
  camera!.aspect = window.innerWidth / window.innerHeight
  camera!.updateProjectionMatrix()
  renderer!.setSize(window.innerWidth, window.innerHeight)
}
function animate() {
  requestAnimationFrame(animate)
  render()
}
function render() {
  const delta = clock!.getDelta()
  uniforms1.time.value += delta * 5
  for (let i = 0; i < scene!.children.length; i++) {
    const object = scene!.children[i]
    object.rotation.x += 0.04
    object.rotation.z += 0.04
    object.rotation.y += delta * 0.8 * (i % 2 ? 1 : -1)
  }
  camera!.rotation.x += delta * 0.03
  camera!.rotation.z += delta * 0.03
  renderer!.render(scene!, camera!)
}
watch(() => isDark.value, (val) => {
  if (isDark.value)
    renderer!.setClearColor(new Color('#050505'), 1)
  else
    renderer!.setClearColor(new Color('#dbdbdb'), 1)
})
onMounted(() => {
  init()
  animate()
})
</script>

<template>
  <div
    ref="webglContainer" class="fixed top-0 bottom-0 left-0 right-0 pointer-events-none" style="z-index: -1"
    :style="`mask-image: ${mask};--webkit-mask-image: ${mask};`"
  >
    <!-- <canvas ref="el" width="400" height="400" /> -->
  </div>
</template>

<style scoped>

</style>
