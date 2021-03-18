import firebase from "firebase/app"
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCDDkxq5enoBHtV-1FJBRrE99cAWtA4MBA",
    authDomain: "progressnotes-b6fc9.firebaseapp.com",
    projectId: "progressnotes-b6fc9",
    storageBucket: "progressnotes-b6fc9.appspot.com",
    messagingSenderId: "192553706420",
    appId: "1:192553706420:web:9528d209e4ec0212f048e1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;
  export const db = firebase.firestore();
  export const auth = firebase.auth();
  export const storage = firebase.storage()