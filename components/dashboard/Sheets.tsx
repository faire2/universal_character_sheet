import React from "react";
import {AppColors, BasicText, BasicView, ColoredText, RowButton, RowView} from "../../common/styling/commonStyles";
import {View} from "react-native";
import {NavigationLocations} from "../../common/navigation/locations";
import {ISheet} from "../sheet/sheetTypes";

// todo removeSheet should be declared e.g. type SuccessHandler = (address: string) => string;
export function Sheets(props: {
    sheets: Array<ISheet>, removeSheet: any, navigation: {
        navigate: Function
    };
}) {

    return (
        <BasicView>
            {props.sheets.map((sheet: ISheet, i: number) =>
                <RowView key={i}>
                    <View style={{flex: 4}}>
                        <BasicText key={i}>
                            {sheet.sheetName}
                        </BasicText>
                    </View>
                    <RowView style={{flex: 2}}>
                        <RowButton color={AppColors.BLUE}
                                   onPress={() => props.navigation.navigate(NavigationLocations.SHEET,
                                       {
                                           sheet: sheet,
                                       })}>
                            <ColoredText color={AppColors.WHITE}>
                                Open
                            </ColoredText>
                        </RowButton>
                        <RowButton color={AppColors.RED} onPress={() => props.removeSheet(i)}>
                            <ColoredText color={AppColors.WHITE}>
                                X
                            </ColoredText>
                        </RowButton>
                    </RowView>
                </RowView>
            )}
        </BasicView>
    )
}