import AsyncStorage from "@react-native-async-storage/async-storage";

// general function for saving data
export async function saveData(key, value) {
    if (_shouldBeStringidiedForStorage(value)) {
        value = JSON.stringify(value);
        console.log("Value has been stringified:" + value);
    }
    if (typeof value === "string") {
        try {
            await AsyncStorage.setItem(key, value);
            console.log("Data saved. Key + " + key + ", value: " + value);
        } catch (e) {
            console.error("Failed to save data, key: " + key);
        }
    } else {
        console.error("Value could not be stringified and was not stored - key: " + key + ", value: " + value);
    }
}

export async function loadData(key, destringify) {
    try {
        const data = await AsyncStorage.getItem(key);
        console.log("Data loaded. Key: " + key + ", value: " + data);
        if (destringify) {
            return JSON.parse(data);
        }
        return data;
    } catch (e) {
        console.error(e);
        console.log("Data could not be loaded, key: " + key);
    }
}

/*export async function saveUserData(userData) {
    try {
        await AsyncStorage.setItem(asyncStorageKeys.USER_DATA, JSON.stringify(userData));
        console.log("User data saved:");
        console.log(userData);
    } catch {
        console.error("Unable to store user data.");
    }
}

export async function loadUserData() {
    try {
        const userObject = await AsyncStorage.getItem(asyncStorageKeys.USER_DATA);
        const userData = JSON.parse(userObject);
        console.log("User data loaded: ");
        console.log(userData);
        return userData;
    } catch (e) {
        console.error("Failed to load user!");
    }
}*/

export async function removeItem(key) {
    try {
        await AsyncStorage.removeItem(key);
        console.log("Item has been removed from local storage: " + item);
    } catch (e) {
        console.error("Unable to remove item: " + key);
    }
}

function _shouldBeStringidiedForStorage(value) {
    // only selected non-strings must be stringified
    if (typeof value !== "string") {
        switch (typeof value) {
            case "boolean":
            case "number":
            case "bigint":
            case "object":
                return true;
            default:
                console.error("Unable to stringify data for storage.");
                debugger;
                return null;
        }
    } else {
        return false;
    }
}