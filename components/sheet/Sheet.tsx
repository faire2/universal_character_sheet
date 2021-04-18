import React, {useEffect, useState} from "react";
import {AppColors, BasicInput, BasicText, BasicView, ColoredText, WideButton} from "../../common/styling/commonStyles";

import {Platform, Switch, UIManager, View} from "react-native";
import {transformToJsx} from "./sheetFunctions";
import NewSheetElement from "./NewSheetElement";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {IElementUnion, ISheet} from "./sheetTypes";
import {useAppSelector} from "../../store";
import {selectSheetById, sheetChanged, sheetNameChanged} from "../../store/sheetsSlice";
import styled from "styled-components/native";
import {useDispatch} from "react-redux";
import {NavigationLocations, RootStackParamList} from "../../common/navigation/NavigationStack";

type Props = StackScreenProps<RootStackParamList, NavigationLocations.SHEET>

export default function Sheet({route}: Props) {
    const dispatch = useDispatch();
    const {sheetId} = route.params;
    const sheet: ISheet | undefined = useAppSelector(state => selectSheetById(state, sheetId));
    console.warn(sheet);  // todo remove
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // we need to enable animations for collapsible sections
    useEffect(() => {
        if (Platform.OS === "android") {
            // eslint-disable-next-line no-unused-expressions
            UIManager.setLayoutAnimationEnabledExperimental &&
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    function handleElementChange(element: IElementUnion, elementId: number[]) {
        dispatch(sheetChanged({sheet: sheet!, element: element, elementId: elementId}));
    }

    if (!sheet) {
        throw new Error("Did not find sheet with id: " + sheetId);
    } else {
        const sheetFieldsArray = sheet.fieldsArray;
        return (
            <BasicView>
                <HeadRow>
                    {!isEditing ?
                        <BasicText>{sheet.sheetName}</BasicText> :
                        <BasicInput placeholder={sheet.sheetName} value={sheet.sheetName}
                                    onChangeText={(e) => dispatch(sheetNameChanged({
                                        sheetId: sheetId,
                                        sheetName: e
                                    }))}/>
                    }
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEditing ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsEditing(!isEditing)}
                        value={isEditing}
                    />
                </HeadRow>
                {sheetFieldsArray.map((element: IElementUnion, i: number) => {
                        return (
                            <View key={i}>
                                {transformToJsx(element, i, [i], handleElementChange)}
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