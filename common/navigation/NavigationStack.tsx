import {createStackNavigator} from "@react-navigation/stack";
import Signup from "../../components/Signup";
import Login from "../../components/Login";
import Dashboard from "../../components/dashboard/Dashboard";
import Sheet from "../../components/sheet/Sheet";
import React from "react";
import Templates from "../../components/sheetTemplates/Templates";

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
                    }
                }
            />
            <Stack.Screen
                name={NavigationLocations.DASHBOARD}
                component={Dashboard}
                options={
                    {
                        title: "Dashboard",
                    }}
            />
            <Stack.Screen
                name={NavigationLocations.SHEET}
                component={Sheet}
                options={
                    {
                        title: "Character sheet",
                    }}
            />
            <Stack.Screen
                name={NavigationLocations.TEMPLATES}
                component={Templates}
                options={
                    {
                        title: "Sheet Templates",
                    }}
            />
        </Stack.Navigator>
    )
}

export enum NavigationLocations {
    SIGNUP = "Signup",
    LOGIN = "Login",
    DASHBOARD = "Dashboard",
    SHEET = "SheetView",
    TEMPLATES = "Templates",
}

export type RootStackParamList = {
    Signup: undefined,
    Login: undefined,
    Dashboard: undefined,
    SheetView: {sheetId: string},
    Templates: undefined,
};