import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: "AIzaSyDQNcQQID87ImaVhI6TbQhfHiYDomC7ae8",
  authDomain: "start-wars-api.firebaseapp.com",
  databaseURL: "https://start-wars-api.firebaseio.com",
  projectId: "start-wars-api",
  storageBucket: "start-wars-api.appspot.com",
  messagingSenderId: "94372385573",
  appId: "1:94372385573:web:b40f3101c70604580d40cc"
};

firebase.initializeApp(config);

export const db = firebase.firestore();
