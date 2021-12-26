importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: " AIzaSyD-8vbbMXn-LKoQIH5ShAdTFV4-pt-Q7o8",
  authDomain: " ez-todos.firebaseapp.com",
  projectId: " ez-todos",
  storageBucket: " ez-todos.appspot.com",
  messagingSenderId: " 534881282091",
  appId: " 1:534881282091:web:96c75f6e50729598d5226",
});

const messaging = firebase.messaging();
