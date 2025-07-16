import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
//@ts-ignore
import { initializeAuth, getReactNativePersistence, Auth, getAuth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDLYPe2nsVRAb68oO8gDlbNFgZfrEUKOf4",
	authDomain: "globaltalk-c05a4.firebaseapp.com",
	projectId: "globaltalk-c05a4",
	storageBucket: "globaltalk-c05a4.appspot.com",
	messagingSenderId: "730399382561",
	appId: "1:730399382561:web:2006a38f3b84a03821d760",
};

let app: FirebaseApp;
let auth: Auth;
let fstore: Firestore;
let store: FirebaseStorage;
// Initialize Firebase
if (getApps().length === 0) {
	try {
		app = initializeApp(firebaseConfig);
		auth = initializeAuth(app, {
			persistence: getReactNativePersistence(AsyncStorage),
		});
		fstore = getFirestore(app);
		store = getStorage(app);
		// if (__DEV__) {
		// 	console.log("[Config.ts] -> Switching to local cloud instance...");
		// 	connectAuthEmulator(auth, "http://192.168.1.5:9099");
		// 	connectFirestoreEmulator(fstore, "192.168.1.5", 8080);
		// 	connectStorageEmulator(store, "192.168.1.5", 9199);
		// }
	} catch (error) {
		console.error("Error in intializing database: " + error);
	}
} else {
	app = getApp();
	auth = getAuth(app)
	fstore = getFirestore();
	store = getStorage();
}

export { app, auth, fstore, store };
