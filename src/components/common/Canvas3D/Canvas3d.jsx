import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

const Model = () => {
	const modelPath = process.env.PUBLIC_URL + "/assets/models/scene.gltf";
	const { scene, animations } = useGLTF(modelPath);
	const { actions } = useAnimations(animations, scene);

	useEffect(() => {
		if (scene) {
			scene.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
					if (child.material) {
						child.material.needsUpdate = true;
						child.material.side = THREE.DoubleSide;
					}
				}
			});

			for (const action of Object.values(actions)) {
				if (action) {
					action.play();
					action.setLoop(THREE.LoopRepeat);
				}
			}
		}
	}, [scene, actions]);

	return (
		<primitive
			object={scene}
			scale={[0.04, 0.04, 0.04]}
			position={[-0.8, -1.1, 2]}
			rotation={[0, 4.9, 0]}
			castShadow
			receiveShadow
		/>
	);
};

function CameraAnimation() {
	const { camera } = useThree();

	useEffect(() => {
		gsap.to(camera.position, {
			duration: 2,
			x: 0,
			y: 1,
			z: 8,
			ease: "power2.out",
		});
	}, [camera]);

	return null;
}

const Canvas3D = () => {
	return (
		<Canvas
			shadows
			camera={{ position: [0, 2, 8], fov: 60 }}
			style={{ background: "transparent" }}
			gl={{
				antialias: true,
				alpha: true,
				powerPreference: "high-performance",
			}}
		>
			<Suspense fallback={null}>
				<ambientLight intensity={0.5} />
				<directionalLight position={[5, 5, 5]} intensity={1} castShadow />
				<pointLight position={[0, 2, 0]} intensity={0.9} color="#ff9dba" />
				<Model />
				<CameraAnimation />
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					enableRotate={false}
				/>
			</Suspense>
		</Canvas>
	);
};

export default Canvas3D;
