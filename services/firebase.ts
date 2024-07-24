import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "***************************************",
  authDomain: "************************************",
  projectId: "********************",
  storageBucket: "********************************",
  messagingSenderId: "************",
  appId: "*****************************************",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db: any = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
