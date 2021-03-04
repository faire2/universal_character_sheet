import React from "react";
import {appColors, BasicText, BasicView, ColoredText, RowButton, RowView} from "../../styling/commonStyles";
import {View} from "react-native-web";

export const Sheets = props =>
    <BasicView>
        {props.sheetsNames.map((sheet, i) =>
            <RowView>
                <View style={{flex: 4}}>
                    <BasicText key={i}>
                        {sheet.name}
                    </BasicText>
                </View>
                <RowView style={{flex: 2}}>
                    <RowButton color={appColors.BLUE}>
                        <ColoredText color={appColors.WHITE}>
                            AAA
                        </ColoredText>
                    </RowButton>
                    <RowButton color={appColors.RED} onPress={() => props.removeSheet(i)}>
                        <ColoredText color={appColors.WHITE}>
                            BBBBBBB
                        </ColoredText>
                    </RowButton>
                </RowView>
            </RowView>
        )}
    </BasicView>