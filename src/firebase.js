// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

// Inicializa o banco de dados com suporte offline nativo
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});