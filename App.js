import {StatusBar} from "expo-status-bar";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";

import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import Dashboard from "./components/dashboard/Dashboard";
import {NavigationLocations} from "./common/constants/locations.ts";
import {NavigationContainer} from "@react-navigation/native";
import {BasicView} from "./common/styling/commonStyles";
import {AuthProvider} from "./firebase/context/AuthContext.tsx";
import {DbProvider} from "./firebase/context/DbContext.tsx";
import Sheet from "./components/sheet/Sheet.tsx";

// todo transform to jsx
export default function App() {
    console.log("App starting");

    return (
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
  );
}

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator
            initialRouteName={NavigationLocations.SIGNUP}
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: "#00fefb",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}>
            <Stack.Screen
                name={NavigationLocations.SIGNUP}
                component={Signup}
                options={{title: "Signup"}}
            />
            <Stack.Screen
                name={NavigationLocations.LOGIN}
                component={Login}
                options={
                    {
                        title: "Login",
                        headerLeft: null
                    }
                }
            />
            <Stack.Screen
                name={NavigationLocations.DASHBOARD}
                component={Dashboard}
                options={
                    {
                        title: "Dashboard",
                        headerLeft: null
                    }}
            />
            <Stack.Screen
                name={NavigationLocations.SHEET}
                component={Sheet}
                options={
                    {
                        title: "Character sheet",
                        headerLeft: null
                    }}
            />
        </Stack.Navigator>
    )
}