import {createStackNavigator} from "@react-navigation/stack";
import Signup from "../../components/Signup";
import Login from "../../components/Login";
import Dashboard from "../../components/dashboard/Dashboard";
import Sheet from "../../components/sheet/Sheet";
import React from "react";
import {NavigationLocations, RootStackParamList} from "./locations";

const Stack = createStackNavigator<RootStackParamList>();

export function MyStack() {
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