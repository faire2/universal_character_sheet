import {firebaseApp} from "../../firebase/config";
import {Firestore} from "./sheetTypes";
import firebase from "firebase";

export interface IUser extends firebase.UserInfo {
}

export interface IAuth {
    signOut: Function,
    signIn: Function,
    user: {uid: string},
    firebaseApp: typeof firebaseApp
}

export interface IDb {
    db: Firestore,
}

export interface IFirebaseError {
    code: string,
    message: string
}