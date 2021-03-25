import React, {createContext, useEffect, useState} from "react";
import {firebaseApp} from "../config";
import {IAuth, IUser} from "../../common/types/generalTypes";
import {useAppDispatch} from "../../store";
import {initialUser, signedIn} from "../../store/userSlice"

const AuthContext = createContext({});

export function AuthProvider(props: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser>(initialUser);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubsribe = firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                dispatch(signedIn(user));
                setUser(user);
                console.log("user: " + user.uid);
            }
        });
        return () => {
            unsubsribe();
        }
    }, [user]);

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