import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDmJPLNMgjIPpa9fh_O_1Bk9EnJweQO1EM',
  authDomain: 'attendace-fyp.firebaseapp.com',
  projectId: 'attendace-fyp',
  storageBucket: 'attendace-fyp.appspot.com',
  messagingSenderId: '770541267867',
  appId: '1:770541267867:web:65036bf00d90c53f6d8f3e',
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db: any = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
