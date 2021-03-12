import {firebaseApp} from "../config";
import React, {createContext, useEffect, useState} from "react";
import {Firestore} from "../../common/types/sheetTypes";
import {IDb} from "../../common/types/generalTypes";

const DbContext = createContext({});

function DbProvider(props: {children: React.ReactNode}) {
    const [db, setDb] = useState({});

    useEffect(() => {
        const db: Firestore = firebaseApp.firestore();
        setDb(db);
        console.log("Db set:");
        console.log(db);
    }, []);

    const dbContextValue = {
        db
    };

    return (
        <DbContext.Provider value={dbContextValue}>
            {props.children}
        </DbContext.Provider>
    )
}

const useDb = () => React.useContext(DbContext) as IDb;

export {DbProvider, useDb};