
import "@firebase/auth"
import "@firebase/firestore"
import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD3hfSImrt_AjoNLCU7K08SkwxHsN5UOK4",
    authDomain: "https://universal-sheet.firebaseio.com",
    projectId: "universal-sheet",
    storageBucket: "universal-sheet.appspot.com",
    messagingSenderId: "362882603016",
    appId: "1:362882603016:ios:6f7f1098d52a63d16219bd",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
