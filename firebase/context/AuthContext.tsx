import React, {createContext, useEffect} from "react";
import {firebaseApp} from "../config";
import {IAuth, IUser} from "../../common/types/generalTypes";
import {useAppDispatch} from "../../store";
import {signedIn} from "../../store/userSlice"

const AuthContext = createContext({});

export function AuthProvider(props: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubsribe = firebaseApp.auth().onAuthStateChanged(dbUser => {
            if (dbUser) {
                const appUser: IUser = {
                    displayName: dbUser.displayName,
                    email: dbUser.email,
                    phoneNumber: dbUser.phoneNumber,
                    photoURL: dbUser.photoURL,
                    providerId: dbUser.providerId,
                    uid: dbUser.uid
                };
                dispatch(signedIn(appUser));
            }
        });
        return () => {
            unsubsribe();
        }
    }, []);

    const authContextValue = {
        firebaseApp,
        signOut: () => firebaseApp.auth().signOut(),
        signIn: (email: string, password: string) => firebaseApp.auth().signInWithEmailAndPassword(email, password),
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => React.useContext(AuthContext) as IAuth;