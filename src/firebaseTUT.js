import firebase from "firebase/app"
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "",
    authDomain: "progressnotes-b6fc9.firebaseapp.com",
    projectId: "progressnotes-b6fc9",
    storageBucket: "progressnotes-b6fc9.appspot.com",
    messagingSenderId: "",
    appId: ""
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;
  export const db = firebase.firestore();
  export const auth = firebase.auth();
  export const storage = firebase.storage()