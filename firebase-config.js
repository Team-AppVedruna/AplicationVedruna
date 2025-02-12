// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDiyMg6dXVIwXl8ZHgHt8lNSiEspfgAGIw",
  authDomain: "appvedruna-dfa03.firebaseapp.com",
  projectId: "appvedruna-dfa03",
  storageBucket: "appvedruna-dfa03.firebasestorage.app",
  messagingSenderId: "301207904128",
  appId: "1:301207904128:web:7e1fbbe1c37159bbf86b65",
  measurementId: "G-GP8NW16KD3"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Configura y exporta el servicio de autenticación
const auth = getAuth(app);

export { app, auth };
