

class CalabiYauManifold {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        
        this.init();
        this.createManifold();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('manifold-container').appendChild(this.renderer.domElement);

        this.camera.position.z = 2;

        // Add subtle ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        window.addEventListener('resize', () => this.onResize());
    }

    createManifold() {
        const geometry = new THREE.ParametricBufferGeometry((u, v, target) => {
            const n = 3;
            const a = 0.5;
            
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI * 2;
            
            const r = a * (1 + Math.sin(n * phi));
            
            target.x = r * Math.cos(theta) * Math.sin(phi);
            target.y = r * Math.sin(theta) * Math.sin(phi);
            target.z = r * Math.cos(phi);
        }, 100, 100);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                uniform float time;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec3 pos = position;
                    
                    // Add subtle wave motion
                    pos.x += sin(pos.z * 2.0 + time) * 0.05;
                    pos.y += cos(pos.x * 2.0 + time) * 0.05;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                uniform float time;
                
                void main() {
                    vec3 baseColor = vec3(0.98, 0.98, 0.98);
                    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                    float diff = max(dot(vNormal, lightDir), 0.0);
                    
                    vec3 color = baseColor * (diff * 0.5 + 0.5);
                    gl_FragColor = vec4(color, 0.9);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.manifold = new THREE.Mesh(geometry, material);
        this.scene.add(this.manifold);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = performance.now() * 0.001;
        this.manifold.material.uniforms.time.value = time;
        
        this.manifold.rotation.x = time * 0.1;
        this.manifold.rotation.y = time * 0.15;
        
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize when the window loads
window.addEventListener('load', () => {
    new CalabiYauManifold();
});