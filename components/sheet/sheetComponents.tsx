import {AppColors, ColoredText, ColumnView, Line, RowButton, RowView, Text50} from "../../common/styling/commonStyles";
import React, {FunctionComponent, useState} from "react";
import {IElementUnion} from "./sheetTypes";
import {elementType} from "../../common/constants/elementType";
import {transformToJsx} from "./sheetFunctions";
import styled from "styled-components/native";
import {LayoutAnimation} from "react-native";

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
export const Section: FunctionComponent<ElementProps> = ({element}) => {
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
                element.value.map((subElement: IElementUnion, i: number) =>
                    transformToJsx(subElement, i))
                : null}
        </ColumnView>
    )
};

const SectionHeadline = styled(RowButton)`
    font-size: larger;
    font-weight: bolder;
    padding: 10px 0 10px 5px;
`;