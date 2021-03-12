import React from "react";
import {elementType} from "../../common/constants/elementType";
import {ControlledNumber, Section, Text} from "./sheetComponents";
import {IElementUnion} from "../../common/types/sheetTypes";

export function transformToJsx(element: IElementUnion, i: number) {
    switch (element.type) {
        case elementType.TEXT:
            return <Text element={element} key={i}/>;
        case elementType.CONTROLLED_NUMBER:
            return <ControlledNumber element={element} key={i}/>;
        case elementType.SECTION:
            return <Section key={i} element={element}/>;
        default: {
            throw new Error("Unable to transform element to JSX: " + element);
        }
    }
}