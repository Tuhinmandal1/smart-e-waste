import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCv5PEJldRN4G-YzNk7O6zLyxNspJ8tDHQ",
  authDomain: "smart-e-waste-system.firebaseapp.com",
  databaseURL: "https://smart-e-waste-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-e-waste-system",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);