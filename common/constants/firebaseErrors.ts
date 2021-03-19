import {IFirebaseError} from "../types/generalTypes";

export enum FirebaseError {
    INVALID_EMAIL = "auth/invalid-email",
    EMAIL_IN_USE = "auth/email-already-in-use",
    INVALID_PASSWORD = "auth/invalid-password",
    WEAK_PASSWORD = "auth/weak-password",
    WRONG_PASSWORD = "auth/wrong-password",
    USER_NOT_FOUND = "auth/user-not-found",
}

export function getErrorMessage(error: IFirebaseError): string {
    console.info("Firebase error:");
    console.info(error);
    console.info(error.code);
    switch (error.code) {
        case FirebaseError.INVALID_EMAIL:
            return "This does not look like a proper email address. You know what? " +
                "Let's pretend it did not happen and try it again. Hello, adventurer, can I have your " +
                "email address?";
        case FirebaseError.WEAK_PASSWORD:
            return "Well, that password is rather short. Look, I really liked it, " +
                "it had a nice ring to it. But you know, there are certain rules ";
        case FirebaseError.EMAIL_IN_USE:
            return "Someone has already used this email. Perhaps you are sleep-registering instead " +
                "of sleep-walking?";
        case FirebaseError.INVALID_PASSWORD:
        case FirebaseError.WRONG_PASSWORD:
            return "Ha! Wrong password! Are you a spy or what?";
        case FirebaseError.USER_NOT_FOUND:
            return "Who do you think you are? I have never seen your face and email before!";
        default:
            return error.message;
    }
}