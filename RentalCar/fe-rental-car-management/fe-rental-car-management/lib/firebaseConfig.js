// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyC0lQflhxECUtKU72bl9ziVvHuCbL5mvno',
    authDomain: 'rentail-car-management.firebaseapp.com',
    projectId: 'rentail-car-management',
    storageBucket: 'rentail-car-management.appspot.com',
    messagingSenderId: '817829720914',
    appId: '1:817829720914:web:dd0a92e416015077bc408b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
