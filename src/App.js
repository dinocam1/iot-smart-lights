import './assets/styles/App.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PresentationControls } from '@react-three/drei';
import Room from './components/Room';
import { useControls } from 'leva';
import { useRef } from 'react/cjs/react.development';

function App() {
	const bulbLight = useRef();

	const { isLightOn, intensity, color } = useControls('Sijalica', {
		isLightOn: {
			value: true,
			label: 'On/Off',
		},
		intensity: {
			value: 3,
			label: 'Intenzitet',
			min: 0,
			max: 5,
			step: 0.1,
			onEditEnd: (value) =>
				console.log('Šaljem na Firebase (Intenzitet) -->', value),
			render: (get) => get('Sijalica.isLightOn'),
		},
		color: {
			value: '#fff',
			label: 'Boja',
			onEditEnd: (value) => console.log('Šaljem na Firebase (Boja) -->', value),
			render: (get) => get('Sijalica.isLightOn'),
		},
	});

	const { isDay, sunLightIntensity } = useControls('Dnevna svjetlost', {
		isDay: {
			value: true,
			label: 'Dan/Noć',
		},
		sunLightIntensity: {
			value: 0.5,
			min: 0,
			max: 1,
			step: 0.1,
			label: 'Intenzitet sunčeve svjetlosti',
			onEditEnd: (value) =>
				console.log(
					'Šaljem na Firebase (Intenzitet sunčeve svjetlosti) -->',
					value
				),
			render: (get) => get('Dnevna svjetlost.isDay'),
		},
	});

	return (
		<div className='app'>
			<div className='canvas'>
				<Canvas
					shadows
					dpr={[1, 2]}
					camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 4, 8] }}>
					<color attach='background' args={['#000']} />
					<hemisphereLight
						visible={isDay}
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
								visible={isLightOn}
								ref={bulbLight}
								castShadow
								position={[0, 4.5, 0]}
								color={color}
								intensity={intensity}
								distance={100}
								decay={2}
							/>
							<mesh position={[0, 4.5, 0]}>
								<sphereBufferGeometry attach='geometry' args={[0.2, 16, 8]} />
								<meshStandardMaterial
									visible={isLightOn}
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
			</div>
		</div>
	);
}

export default App;
