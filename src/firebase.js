import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDON7zG26I10_bBl3PdZlLlYTyvVESDTps',
	authDomain: 'iot-smart-lights.firebaseapp.com',
	databaseURL:
		'https://iot-smart-lights-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'iot-smart-lights',
	storageBucket: 'iot-smart-lights.appspot.com',
	messagingSenderId: '776514871908',
	appId: '1:776514871908:web:979ffd0f8872f3c71fb571',
	measurementId: 'G-RWX56NYZTJ',
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export default db;
