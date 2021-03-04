import React, {createContext, useState, useEffect} from "react";
import {firebaseApp} from "../../firebase/config";

const AuthContext = createContext({});

function AuthProvider(props) {
    const [user, setUser] = useState({});

    useEffect(() => {
        const unsubsribe = firebaseApp.auth().onAuthStateChanged(setUser);
        console.log("user: " + user.uid);
        return () => {
            unsubsribe();
        }
    }, [user]);

    const authContextValue = {
        firebaseApp,
        user,
        signOut: () => firebaseApp.auth().signOut(),
        signIn: (email, password) => firebaseApp.auth().signInWithEmailAndPassword(email, password),
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

const useAuth = () => React.useContext(AuthContext);

export {AuthProvider, useAuth};