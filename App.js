import {StatusBar} from "expo-status-bar";
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {BasicView} from "./common/styling/commonStyles";
import {AuthProvider} from "./firebase/context/AuthContext.tsx";
import {DbProvider} from "./firebase/context/DbContext.tsx";
import {MyStack} from "./common/navigation/NavigationStack";
import {Provider} from "react-redux";
import {store} from "./store";

// todo transform to jsx
export default function App() {
    console.log("App starting");

    return (
        <Provider store={store}>
            <NavigationContainer>
                <AuthProvider>
                    <DbProvider>
                        <BasicView>
                            <StatusBar style="auto"/>
                            <MyStack/>
                        </BasicView>
                    </DbProvider>
                </AuthProvider>
            </NavigationContainer>
        //</Provider>
    );
}

