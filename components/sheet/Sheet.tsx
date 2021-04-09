import React, {useState} from "react";
import {
    AppColors,
    BasicInput,
    BasicText,
    BasicView,
    ColoredText,
    RowButton,
    WideButton
} from "../../common/styling/commonStyles";
import {View} from "react-native";
import {transformToJsx} from "./sheetFunctions";
import NewSheetElement from "./NewSheetElement";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {NavigationLocations, RootStackParamList} from "../../common/navigation/locations";
import {IElementUnion, ISheet} from "./sheetTypes";
import {useAppSelector} from "../../store";
import {selectSheetById, sheetNameChanged} from "../../store/sheetsSlice";
import styled from "styled-components/native";
import {useDispatch} from "react-redux";

type Props = StackScreenProps<RootStackParamList, NavigationLocations.SHEET>

export default function Sheet({route}: Props) {
    const {index} = route.params;
    const sheet: ISheet = useAppSelector(state => selectSheetById(state, index));
    const sheetFieldsArray = sheet.fieldsArray;
    const dispatch = useDispatch();

    const [isEditting, setIsEditing] = useState<boolean>(false);

    return (
        <BasicView>
            <HeadRow>
                {!isEditting ?
                    <BasicText>{sheet.sheetName}</BasicText> :
                    <BasicInput placeholder={sheet.sheetName} value={sheet.sheetName}
                                onChangeText={(e) => dispatch(sheetNameChanged({sheetIndex: index, sheetName: e}))}/>
                }
                <RowButton color={AppColors.BLUE} onPress={() => setIsEditing(!isEditting)}>
                    <ColoredText color={AppColors.WHITE}>Edit mode</ColoredText>
                </RowButton>
            </HeadRow>
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

const HeadRow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

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

