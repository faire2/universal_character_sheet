import {AppColors, ColoredText, ColumnView, Line, RowButton, RowView, Text50} from "../../common/styling/commonStyles";
import React, {FunctionComponent, useState} from "react";
import {IElementUnion} from "./sheetTypes";
import {LayoutAnimation} from "react-native";
import {elementType} from "../../common/constants/elementType";
import {transformToJsx} from "./sheetFunctions";
import styled from "styled-components/native";

type ElementProps = {
    element: IElementUnion,
    elementId: number[],
    handleElementChange: (element: IElementUnion, elementId: number[]) => void,
}

export const Text: FunctionComponent<ElementProps> = ({element, elementId, handleElementChange}) =>
    <RowView>
        <RowButton color={AppColors.BLUE} onPress={() => handleElementChange(element, elementId)}>
            <Text50>
                {element.name}:
            </Text50>
            <Text50>
                {element.value}
            </Text50>
        </RowButton>
    </RowView>;

export const ControlledNumber: FunctionComponent<ElementProps> = ({element, elementId, handleElementChange}) =>
    <RowView>
        <RowButton color={AppColors.BLUE} onPress={() => handleElementChange(element, elementId)}>
            <Text50>
                {element.name}
            </Text50>
            <Text50>
                {element.value}
            </Text50>
        </RowButton>
    </RowView>;

// todo change subElement type to IElementUnion
export const Section: FunctionComponent<ElementProps> = ({element, elementId, handleElementChange}) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    function handleCollapse() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsCollapsed(!isCollapsed)
    }

    return (
        <ColumnView>
            <Line/>
            <SectionHeadline color={AppColors.BLUE} onPress={() => handleCollapse()}>
                <ColoredText color={AppColors.WHITE}>{element.name}</ColoredText>
            </SectionHeadline>
            {isCollapsed && element.type === elementType.SECTION ?
                element.value.map((subElement: IElementUnion, i: number) => {
                    const newElementId = [...elementId];
                    newElementId.push(i);
                    return transformToJsx(subElement, i, newElementId, handleElementChange);
                })
                : null}
        </ColumnView>
    )
};

const SectionHeadline = styled(RowButton)`
    font-size: 20px;
    padding: 10px 0 10px 5px;
`;