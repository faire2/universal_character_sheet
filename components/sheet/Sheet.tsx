import React, {useEffect, useState} from "react";
import {
    AppColors,
    BasicInput,
    BasicText,
    BasicView,
    ColoredText,
    RowButton,
    WideButton
} from "../../common/styling/commonStyles";
import {Platform, UIManager, View} from "react-native";
import {transformToJsx} from "./sheetFunctions";
import NewSheetElement from "./NewSheetElement";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {IElementUnion, ISheet} from "./sheetTypes";
import {useAppSelector} from "../../store";
import {selectSheetById, sheetNameChanged} from "../../store/sheetsSlice";
import styled from "styled-components/native";
import {useDispatch} from "react-redux";
import {NavigationLocations, RootStackParamList} from "../../common/navigation/NavigationStack";

type Props = StackScreenProps<RootStackParamList, NavigationLocations.SHEET>

export default function Sheet({route}: Props) {
    const dispatch = useDispatch();
    const {sheetId} = route.params;
    const sheet: ISheet | undefined = useAppSelector(state => selectSheetById(state, sheetId));

    const [isEditting, setIsEditing] = useState<boolean>(false);

    // we need to enable animations for collapsible sections
    useEffect(() => {
        if (Platform.OS === "android") {
            // eslint-disable-next-line no-unused-expressions
            UIManager.setLayoutAnimationEnabledExperimental &&
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    if (!sheet) {
        throw new Error("Did not find sheet with id: " + sheetId);
    } else {
        const sheetFieldsArray = sheet.fieldsArray;
        return (
            <BasicView>
                <HeadRow>
                    {!isEditting ?
                        <BasicText>{sheet.sheetName}</BasicText> :
                        <BasicInput placeholder={sheet.sheetName} value={sheet.sheetName}
                                    onChangeText={(e) => dispatch(sheetNameChanged({
                                        sheetId: sheetId,
                                        sheetName: e
                                    }))}/>
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
}

const HeadRow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

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

