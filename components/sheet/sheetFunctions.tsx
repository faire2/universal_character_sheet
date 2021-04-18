import React from "react";
import {elementType} from "../../common/constants/elementType";
import {ControlledNumber, Section, Text} from "./sheetComponents";
import {IElementUnion} from "./sheetTypes";

export function transformToJsx(element: IElementUnion, i: number, elementId: number[], handleElementChange: Function) {
    switch (element.type) {
        case elementType.TEXT:
            return <Text element={element} key={i} elementId={elementId} handleElementChange={handleElementChange}/>;
        case elementType.CONTROLLED_NUMBER:
            return <ControlledNumber element={element} key={i} elementId={elementId} handleElementChange={handleElementChange} />;
        case elementType.SECTION:
            return <Section key={i} element={element} elementId={elementId} handleElementChange={handleElementChange} />;
        default: {
            throw new Error("Unable to transform element to JSX: " + element);
        }
    }
}