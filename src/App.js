import './assets/styles/App.css';
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, Loader } from '@react-three/drei';
import Room from './components/Room';
import { useControls } from 'leva';
import { ref, onValue, update } from 'firebase/database';
import db from './firebase';

function App() {
	const [loading, setLoading] = useState(true);
	const [isLightOnState, setIsLightOnState] = useState();
	const [isDayState, setIsDayState] = useState();

	const updateBulbData = (data) => {
		setBulbControls({
			isLightOn: data.isBulbLightOn,
			intensity: data.intensity,
			color: data.color,
		});
		setIsLightOnState(data.isBulbLightOn);
	};

	const updateSunlightData = (data) => {
		setSunlightControls({
			isDay: data.isDay,
			sunLightIntensity: data.intensity,
		});
		setIsDayState(data.isDay);
	};

	useEffect(() => {
		setLoading(true);
		const bulbData = ref(db, 'bulb');
		onValue(bulbData, (snapshot) => {
			const data = snapshot.val();
			updateBulbData(data);
		});
		const sunlightData = ref(db, 'sunlight');
		onValue(sunlightData, (snapshot) => {
			const data = snapshot.val();
			updateSunlightData(data);
		});
		setLoading(false);
	}, []);

	let [{ isLightOn, intensity, color }, setBulbControls] = useControls(
		'Sijalica',
		() => ({
			isLightOn: {
				value: false,
				label: 'On/Off',
				onChange: (value, path, { initial, fromPanel }) => {
					if (initial) {
						initial = false;
						return;
					}
					update(ref(db, 'bulb'), {
						isBulbLightOn: value,
					});
					setIsLightOnState(value);
				},
			},
			intensity: {
				value: 3,
				label: 'Intenzitet',
				min: 0,
				max: 5,
				step: 0.1,
				onEditEnd: (value) =>
					update(ref(db, 'bulb'), {
						intensity: value,
					}),
				render: (get) => get('Sijalica.isLightOn'),
			},
			color: {
				value: '#fff',
				label: 'Boja',
				onEditEnd: (value) =>
					update(ref(db, 'bulb'), {
						color: value,
					}),
				render: (get) => get('Sijalica.isLightOn'),
			},
		})
	);

	const [{ isDay, sunLightIntensity }, setSunlightControls] = useControls(
		'Dnevna svjetlost',
		() => ({
			isDay: {
				value: false,
				label: 'Dan/Noć',
				onChange: (value, path, { initial, fromPanel }) => {
					if (initial) {
						initial = false;
						return;
					}
					update(ref(db, 'sunlight'), {
						isDay: value,
					});
					setIsDayState(value);
				},
			},
			sunLightIntensity: {
				value: 0.5,
				min: 0,
				max: 1,
				step: 0.1,
				label: 'Intenzitet sunčeve svjetlosti',
				onEditEnd: (value) =>
					update(ref(db, 'sunlight'), {
						intensity: value,
					}),
				render: (get) => get('Dnevna svjetlost.isDay'),
			},
		})
	);

	return (
		<div className='app'>
			{!loading && (
				<div className='canvas'>
					<Suspense fallback={<Loader />}>
						<Canvas
							shadows
							dpr={[1, 2]}
							camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 4, 8] }}>
							<color attach='background' args={['#000']} />
							<hemisphereLight
								visible={isDayState}
								intensity={sunLightIntensity}
								color={0xddeeff}
								groundColor={0x0f0e0d}
							/>
							<PresentationControls
								global
								zoom={0.8}
								polar={[0, Math.PI / 4]}
								azimuth={[-Math.PI / 4, Math.PI / 4]}>
								<group rotation={[0, -Math.PI / 4, 0]}>
									<pointLight
										visible={isLightOnState}
										castShadow
										position={[0, 4.5, 0]}
										color={color}
										intensity={intensity}
										distance={100}
										decay={2}
									/>
									<mesh position={[0, 4.5, 0]}>
										<sphereBufferGeometry
											attach='geometry'
											args={[0.2, 16, 8]}
										/>
										<meshStandardMaterial
											visible={isLightOnState}
											emissive={color}
											emissiveIntensity={intensity / Math.pow(0.02, 2.0)}
											color={color}
											attach='material'
										/>
									</mesh>
									<Room />
								</group>
							</PresentationControls>
						</Canvas>
					</Suspense>
				</div>
			)}
		</div>
	);
}

export default App;
