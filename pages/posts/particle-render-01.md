---
title: Particle-rendering-01
date: 2023-01-30
lang: zh
duration: 6min
---

[[toc]]

## 主要技术 / Main techniques

1. Instancing and draw calls
2. GPUPU and FBO particle systems
3. Light, shadows, and extended ThreeJS materials


## 使用Meshes创建100k的球体 / Using meshes to create 100k spheres

去渲染很多sphere的最直接的方式就是使用循环将meshes添加到场景中。

```js
const geometry = new THREE.SphereBufferGeometry(1, 12, 12)
const colors = [0xFAFAFA, 0xFF0000]
for (let i = 0; i < 5000; i++) {
  const color = colors[random.int(colors.length)]
  const material = new THREE.MeshBasicMaterial({ color })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}
```

当数量级增加的时候，FPS就会下降。

- [Misaki's Curl noise](https://codepen.io/mnmxmx/pen/rzqoeW),
- [Jaume's Polygon Shredder](https://www.clicktorelease.com/code/polygon-shredder/#2048)
- [Edan's Particle love](https://particle-love.com/)

以上这些demo都使用超过了16k的粒子进行模拟，并且还增加了灯光、阴影。

## 太多绘制调用 / Too many draw calls

上面那种代码，在每次渲染时，我们都会告诉GPU绘制一个球体网格，然后绘制另一个，然后绘制另外一个，再绘制6997次，一次一个。我们做了太多次绘制调用了。

Draw调用是从CPU（javascript）到GPU（GLSL）的命令。进行Draw调用时，CPU必须准备渲染需要的东西，比如分配内存、绑定缓冲区和其他进程。

尽管GPU渲染的很快，但CPU是同步的，去调用这么多次绘制命令也是需要时间，所以会很慢。并且CPU在通信的时候，GPU必须得等待，处于停滞状态。

所以慢的老的CPU限制了GPU。也就是常说的`CPU-Bottlenecking`或者 `CPU-bound`。

<figure>
  <img src="/images/particle-render-01-1.png" alt="CPU Bottlenecking the GPU." />
  <figcaption>CPU Bottlenecking the GPU. </figcaption>
</figure>

所以，尽可能减少绘制调用能得到更好的性能。

因此，一次大的绘制调用将比10次相同大小的小的绘制调用快得多。

<figure>
  <img src="/images/particle-render-01-2.png" alt="工作量是相同的。从长远来看，设置时间会增加。" />
  <figcaption>工作量是相同的。从长远来看，设置时间会增加。 </figcaption>
</figure>


## 通过合并几何体减少绘制调用 / Reducing draw calls by Merging Geometries

```js
const baseGeometry = new THREE.SphereBufferGeometry(1, 12, 12)
const spheres = []
const colors = [0xFAFAFA, 0xFF0000]
for (let i = 0; i < 7000; i++) {
  const geometry = baseGeometry.clone()
  spheres.push(geometry)
}
const material = new THREE.MeshBasicMaterial()
const mergedSphereGeometries = THREE.BufferGeometryUtils.mergeBufferGeometries(spheres)
const mesh = new THREE.Mesh(mergedSphereGeometries, material)
scene.add(mesh)
```

在我们的例子中，所有的球体都有相同的几何结构。我们创建了7000个相同的SphereBufferGeometry副本并将其合并。在同一件事情上浪费了大量内存，也给GPU发送了大量重复的数据。

合并几何图形是一种很好的优化技术。但并不是我们想要的。

## 使用Instancing Geometries（瞬时几何体） / Reducing draw calls by Instancing Geometries

Instancing是一种技术，允许我们一次性将几何数据发送到GPU。然后，使用相同的数据，GPU负责重复绘制我们想要的次数。

这是多次渲染同一几何体时的完美解决方式。这就是我们要找的。

它只发送一次数据，通信一次，就可以在GPU中重复绘图。让GPU尽可能快地运行。

<figure>
  <img src="/images/particle-render-01-3.png" alt="通过将所有相同的绘图批处理到单个绘图调用中，加快了通信速度" />
  <figcaption>通过将所有相同的绘图批处理到单个绘图调用中，加快了通信速度 </figcaption>
</figure>

将工作移动到GPU里越多，中断的次数就越少。就会得到更好的性能！


### 创建INSTANCED GEOMETRY / CREATING AN INSTANCED GEOMETRY

首先需要创建`baseGeometry`。然后，创建一个空`InstancedBufferGeometry`并复制我们的几何体。

然后，我们告诉`instancedGeometry.maxInstanceCount`要渲染多少实例。

```js
const baseGeometry = new THREE.SphereBufferGeometry(3)
const instancedGeometry = new THREE.InstancedBufferGeometry().copy(baseGeometry)
const instanceCount = 7000
instancedGeometry.maxInstancedCount = instanceCount
const material = new THREE.ShaderMaterial()
const mesh = new THREE.Mesh(instancedGeometry, material)
```

由于实例在GPU中重复，我们必须在GPU中定位它们。也就需要使用到GLSL顶点着色器。

我们将通过vertex shader来移动定位逻辑。首先我们需要给shader一些数据让其计算每个实例的位置。

> 最新的Threejs有[InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)，使用上更简单。

## Instanced Buffer Attributes

Buffer Attribute是一个数组，其中包含用于描述几何体中每个顶点的属性的值。

一个有4个顶点的正方形几何体，每个角都有一个顶点。每个角/顶点都有自己的位置、法线和UV值。这些都是顶点的属性。这些都是正方形几何体的内置属性。

当GPU渲染这些顶点的时候，就会把这些对应的属性都传给shader。

<figure>
  <img src="/images/particle-render-01-4.png" alt="Buffer Attributes每个顶点有一个值（或向量）。着色器使用它们进行渲染" />
  <figcaption>Buffer Attributes每个顶点有一个值（或向量）。着色器使用它们进行渲染</figcaption>
</figure>

除此之外，我们还有`Instanced buffer attributes`，它同样是数组，但里面装的是每个`instance`的属性。

<figure>
  <img src="/images/particle-render-01-5.png" alt="Instanced buffer attributes" />
  <figcaption>Instanced buffer attributes</figcaption>
</figure>

### CREATING INSTANCED BUFFER ATTRIBUTES

创建`InstancedBufferAttribute`与创建常规缓冲区属性相同。但几何体需要是`InstancedBufferGeometry`。

让我们为每个实例指定其自己的颜色实例化属性：

1. 创建包含所有实例的数组。在我们的例子中，我们随机得到一种颜色，并将RGB添加到数组中。
2. 将`Array`改为`Float32Array`。
3. 创建`InstancedBufferAttribute`，并将其添加到实例化几何体中。我们将使用颜色的三个RGB分量，因此缓冲区属性的大小为3。

```js
// 1. Create the values for each instance
const aColor = []
const colors = [new THREE.Color('#ff3030'), new THREE.Color('#121214')]
for (let i = 0; i < instanceCount; i++) {
  const color = colors[random.int(0, colors.length - 1)]
  aColor.push(color.r, color.g, color.b)
}
// 2. Transform the array to float32
const aColorFloat32 = new Float32Array(aColor)
// 3. Create te instanced Buffer Attribute of size three
instancedGeometry.addAttribute('aColor',
  new THREE.InstancedBufferAttribute(aColorFloat32, 3, false) // 每三个是一组
)
```

要计算球体的曲线位置，我们需要几个不同的值：
0. 曲线的X和Y半径
1. z曲线偏移，使其具有一点厚度。
2. 球体通过曲线的进度progress。
3. 球体的移动速度。

我们将创建一个向量大小为4的`InstancedBufferAttribute`命名为`aCurve`，并在其中批处理所有属性。就只用一次webGL调用！

```js
const aColor = []
const aCurve = []
const colors = [new THREE.Color('#ff3030'), new THREE.Color('#121214')]
for (let i = 0; i < instanceCount; i++) {
  const radius = random.float(30, 40)
  const zOffset = random.float(-5, 5)
  const progress = random.float()
  const speed = random.float(0.02, 0.07)
  aCurve.push(radius, progress, zOffset, speed) // 每四个是一组

  const color = colors[random.int(0, colors.length - 1)]
  aColor.push(color.r, color.g, color.b)
}
const aCurveFloat32 = new Float32Array(aCurve)
instancedGeometry.addAttribute(
  'aCurve',
  new THREE.InstancedBufferAttribute(aCurveFloat32, 4, false)
)
const aColorFloat32 = new Float32Array(aColor)
instancedGeometry.addAttribute(
  'aColor',
  new THREE.InstancedBufferAttribute(aColorFloat32, 3, false)
)
```


### ANIMATING IN THE SHADERS

在着色器中去计算位置动画，移动我们的实例，并且可以提高性能。

如果我们为GPU（着色器）提供计算动画的工具。就不需要如此繁重的通信，GPU就可以全速运行。类似[Three.Bas](https://github.com/zadvorsky/three.bas)的库就是做这个的。

我们来使用新的`aCurve`属性为着色器中的实例设置动画
1. 定义曲线属性。
2. （可选）将值提取到单独的变量中，以便于读取。
3. 计算`CurvePosition`并将其添加到最终位置。

```glsl
// 1. Define the attributes
attribute vec4 aCurve;
// Sphere positioning logic
vec3 getCurvePosition(float progress, float radius, float offset){
  
  vec3 pos = vec3(0.);
  pos.x += cos(progress *PI *8. ) * radius ;
  pos.y += sin(progress *PI*8.) * radius + sin(progress * PI *2.) * 30.;
  pos.z += progress *200. - 200./2. + offset;
  
  return pos;
}
void main(){
  vec3 transformed = position;
  
  // 2. Extract values from attribute
  float aRadius = aCurve.x;
  float aProgress = aCurve.y;
  float aZOffset = aCurve.z;
  float aSpeed = aCurve.w;
  
  // 3. Get position and add it to the final position
  vec3 curvePosition = getCurvePosition(aProgress, aRadius, aZOffset);
  transformed += curvePosition;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
}
```

我们还可以添加`aColor`属性来为球体着色。因为fragment着色器无法读取属性。我们需要使用varying的vColor从顶点着色器向fragment着色器发送`aColor`。

```glsl
attribute vec3 aColor;
varying vec3 vColor;
void main(){
  // ...
  vColor = aColor;
}
```

然后，我们可以在片段着色器中使用它：

```glsl
varying vec3 vColor;
void main(){
  gl_FragColor = vec4(vColor, 1.);
}
```

将这些新着色器添加到ShaderMaterial中，并查看

```js
const material = new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader
})
```


现在，着色器中的位置逻辑已经结束。我们可以用uniforms控制动画。让我们添加`uTime`使球体通过顶点着色器中的曲线移动：

```js
const material = new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: new THREE.Uniform(0)
  }
})
```

```glsl
uniform float uTime;
attribute vec4 aCurve;
attribute vec3 aColor;
varying vec3 vColor;
vec3 getCurvePosition(float progress, float radius, float offset){
	// ...
}
void main(){
  vec3 transformed = position;
  float aRadius = aCurve.x;
  float aZOffset = aCurve.z;
  float aSpeed = aCurve.w;
  float aProgress = mod(aCurve.y + uTime * aSpeed, 1.); // 
  
  vec3 curvePosition = getCurvePosition(aProgress, aRadius, aZOffset);
  transformed += curvePosition;
    
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
  vColor = aColor;
}
```

## 回顾 / Recap & Closing Thoughts

1. 创建100k网格的性能很差，因为它创建了太多的绘制调用。
2. 绘图调用是CPU到GPU的通信。绘制对象很快，但通信很慢。更少的绘制调用，更好的性能。
3. 将几何体合并到一个网格中可以将绘图调用减少到一个。但根据几何图形的大小，会增加CPU的开销。合并几何图形仍然需要时间。
4. 实例化几何体发送一次基本几何体，GPU负责绘制所需的几何体数量。只需要一次绘制调用并且数据量最少。仅当所有实例都具有相同的几何图形时，它才起作用。
5.`InstancedBufferAttribute`存储每个几何体实例的数据。和用于着色器（GPU）。
6. 在着色器中设置动画可以提供更好的性能，因为我们最小化了CPU到GPU的通信。
