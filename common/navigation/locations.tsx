export enum NavigationLocations {
    SIGNUP = "Signup",
    LOGIN = "Login",
    DASHBOARD = "Dashboard",
    SHEET = "SheetView"
}

export type RootStackParamList = {
    Signup: undefined,
    Login: undefined,
    Dashboard: undefined,
    SheetView: {index: number}
};