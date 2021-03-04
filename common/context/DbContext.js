import {firebaseApp} from "../../firebase/config";
import React, {useState, useEffect, createContext} from "react";

const DbContext = createContext({});

function DbProvider(props) {
    const [db, setDb] = useState({});

    useEffect(() => {
       setDb(firebaseApp.firestore());
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

const useDb = () => React.useContext(DbContext);

export {DbProvider, useDb};