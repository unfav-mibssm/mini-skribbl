// Firebase configuration for your project
const firebaseConfig = {
  apiKey: "AIzaSyAY7hSDaaBh71z3k2PXj3s93uxk3AF3Mvs",
  authDomain: "mini-skribbl.firebaseapp.com",
  databaseURL: "https://mini-skribbl-default-rtdb.firebaseio.com",
  projectId: "mini-skribbl",
  storageBucket: "mini-skribbl.firebasestorage.app",
  messagingSenderId: "423970942237",
  appId: "1:423970942237:web:ac3853dab889c0fe3305f4"
};

// Initialize Firebase (compat version)
firebase.initializeApp(firebaseConfig);

// Get reference to Realtime Database
const database = firebase.database();
