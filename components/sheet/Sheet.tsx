import React from "react";
import {AppColors, BasicText, BasicView, ColoredText, WideButton} from "../../common/styling/commonStyles";
import {View} from "react-native";
import {transformToJsx} from "./sheetFunctions";
import NewSheetElement from "./NewSheetElement";
import {ISheet} from "../../common/types/sheetTypes";

export default function Sheet(props: {route: {params: {sheet: ISheet}}}) {
    const sheet = props.route.params.sheet;
    const sheetFieldsArray = sheet.fieldsArray;

    return (
        <BasicView>
            <BasicText>{sheet.sheetName}</BasicText>
            {sheetFieldsArray.map((element, i) => {
                    return (
                        <View key={i}>
                            {transformToJsx(element, i)}
                        </View>
                    )
                }
            )}
            <NewSheetElement/>
            <WideButton color={AppColors.BLUE}>
                <ColoredText color={AppColors.WHITE}>
                    Save changes
                </ColoredText>
            </WideButton>
        </BasicView>
    )
}

// each sheet object is an array of objects representing
/*const sheetArray =
    [
        {
            type: elementType.TEXT,
            name: "Character name",
            value: "Character I."
        },
        {
            type: elementType.CONTROLLED_NUMBER,
            name: "Hit points",
            value: 5
        },
        {
            type: elementType.SECTION,
            name: "Skills",
            dataArray: [
                {
                    type: elementType.TEXT,
                    name: "Athletics",
                    value: 5
                },
                {
                    type: elementType.TEXT,
                    name: "Acrobatics",
                    value: 15
                },
            ]
        }
    ]
;*/

