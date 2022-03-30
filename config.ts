import firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLYPe2nsVRAb68oO8gDlbNFgZfrEUKOf4",
  authDomain: "globaltalk-c05a4.firebaseapp.com",
  projectId: "globaltalk-c05a4",
  storageBucket: "globaltalk-c05a4.appspot.com",
  messagingSenderId: "730399382561",
  appId: "1:730399382561:web:2006a38f3b84a03821d760",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();
