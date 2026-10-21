import { initializeApp } from "firebase/app";
// IMPORTANTE: Esta é a linha que estava faltando para o banco de dados funcionar!
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAERqq07y7cqMNC82D1R90wc8MwuHhnj60",
  authDomain: "dietapp-7c275.firebaseapp.com",
  databaseURL: "https://dietapp-7c275-default-rtdb.firebaseio.com",
  projectId: "dietapp-7c275",
  storageBucket: "dietapp-7c275.firebasestorage.app",
  messagingSenderId: "1059252822474",
  appId: "1:1059252822474:web:8ddfd3046e322e3d816f33",
  measurementId: "G-WGE3SHNBRJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o banco de dados com suporte offline nativo
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
