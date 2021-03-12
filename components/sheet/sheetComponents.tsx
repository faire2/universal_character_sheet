import {ColumnView, Line, RowView, Text50, Text75} from "../../common/styling/commonStyles";
import React, {FunctionComponent} from "react";
import {IElementUnion} from "../../common/types/sheetTypes";
import {elementType} from "../../common/constants/elementType";
import {transformToJsx} from "./sheetFunctions";

type ElementProps = {
    element: IElementUnion
}

export const Text: FunctionComponent<ElementProps> = ({element}) =>
    <RowView>
        <Text50>
            {element.name}:
        </Text50>
        <Text50>
            {element.value}
        </Text50>
    </RowView>;

export const ControlledNumber: FunctionComponent<ElementProps> = ({element}) =>
    <RowView>
        <Text50>
            {element.name}
        </Text50>
        <Text50>
            {element.value}
        </Text50>
    </RowView>;

// todo change subElement type to IElementUnion
export const Section: FunctionComponent<ElementProps> = ({element}) =>
    <ColumnView>
        <Line/>
        <Text75>{element.name}</Text75>
        {element.type === elementType.SECTION && element.value.map((subElement: IElementUnion, i: number) =>
            transformToJsx(subElement, i))}
    </ColumnView>;