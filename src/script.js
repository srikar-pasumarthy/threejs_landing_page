import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lilgui from 'lil-gui'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Setup the threeJS basics
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const gui = new lilgui.GUI()


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const wordTexture = textureLoader.load('/textures/matcaps/2.png')
const donutTexture = textureLoader.load('/textures/matcaps/3.png')


/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'PORTFOLIO',
            {
                font: font,
                size: 1,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.04,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )

        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: wordTexture })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
    }
)


/**
 * Let's put a bunch of random donuts
 */
// Create the container for the donuts
const donutContainer = new THREE.Object3D();
scene.add(donutContainer);

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: donutTexture })

for (let i=0; i<1000; i++) 
{
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)
    scene.add(donut)

    donut.position.x = (Math.random() - 0.5) * 50
    donut.position.y = (Math.random() - 0.5) * 50
    donut.position.z = (Math.random() - 0.5) * 50

    donut.rotateX((Math.random() - 0.5) * 3)
    donut.rotateZ((Math.random() - 0.5) * 3)

    const scale = Math.random() * 2
    donut.scale.set(scale, scale, scale)
    donutContainer.add(donut);
}


/**
 * Window related code.
 * Resize the window to fit the graphic on any device.
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Setup the camera and controls
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 4
scene.add(camera)

// Use built in ThreeJS Object to handle user interaction
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Update the display if anything changes
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update donut rotation
    donutContainer.rotation.x += 0.01;
    donutContainer.rotation.y += 0.01;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()