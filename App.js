import {StatusBar} from "expo-status-bar";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/dahsboard/Dashboard";
import {NavigationLocations} from "./common/constants/locations";
import {NavigationContainer} from "@react-navigation/native";
import {BasicView} from "./styling/commonStyles";
import {AuthProvider, useAuth} from "./common/context/AuthContext";
import {DbProvider} from "./common/context/DbContext";

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
        </Stack.Navigator>
    )
}