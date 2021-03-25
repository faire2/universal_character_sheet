import React from "react";
import {AppColors, BasicText, BasicView, ColoredText, WideButton} from "../../common/styling/commonStyles";
import {View} from "react-native";
import {transformToJsx} from "./sheetFunctions";
import NewSheetElement from "./NewSheetElement";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {NavigationLocations, RootStackParamList} from "../../common/navigation/locations";
import {IElementUnion} from "../../common/types/sheetTypes";

type Props = StackScreenProps<RootStackParamList, NavigationLocations.SHEET>

export default function Sheet({route}: Props) {
    const {sheet} = route.params;
    const sheetFieldsArray = sheet.fieldsArray;

    return (
        <BasicView>
            <BasicText>{sheet.sheetName}</BasicText>
            {sheetFieldsArray.map((element: IElementUnion, i: number) => {
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

