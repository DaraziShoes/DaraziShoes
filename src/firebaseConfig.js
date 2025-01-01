import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAalo_7WQqL4FzNX_fd8WHaTv9exBex1U4",
  authDomain: "darazi-shoes.firebaseapp.com",
  projectId: "darazi-shoes",
  storageBucket: "darazi-shoes.firebasestorage.app",
  messagingSenderId: "766823543260",
  appId: "1:766823543260:web:9215655e0ff2d0c3569f19",
  measurementId: "G-Y29FDXF1R2",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
