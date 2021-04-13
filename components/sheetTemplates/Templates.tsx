import React from "react";
import {AppColors, BasicText, BasicView, ColoredText, RowButton, RowView} from "../../common/styling/commonStyles";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {getSheetTemplate, SheetTemplate} from "./sheetTemplatesFunctions";
import {NavigationLocations, RootStackParamList} from "../../common/navigation/NavigationStack";
import {addSheet, selectAllSheets} from "../../store/sheetsSlice";
import {ISheet} from "../sheet/sheetTypes";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../store";

type Props = StackScreenProps<RootStackParamList, NavigationLocations.TEMPLATES>

export default function Templates({navigation}: Props) {
    const dispatch = useDispatch();
    const sheets: ISheet[] = useAppSelector(selectAllSheets);

    async function handleTemplateChoice (template: SheetTemplate) {
        const newSheet: ISheet = getSheetTemplate(template);
        await dispatch(addSheet({sheet: newSheet}));
        // we do not know the newly created sheet id here so we assume that it is the last sheet in the array
        const lastSheetId = sheets[sheets.length - 1].id;
        if (lastSheetId) {
            navigation.navigate(NavigationLocations.SHEET, {sheetId: lastSheetId});
        } else {throw new Error("Unable to determine new sheet's id.")}
    }

    return (
        <BasicView>
            {Object.keys(SheetTemplate).map((key, i) =>
                <TemplateRow templateName={SheetTemplate[key]} key={i} handleTemplateChoice={handleTemplateChoice} />
            )}
        </BasicView>
    )
}

interface ITemplateRow {
    templateName: SheetTemplate,
    handleTemplateChoice: (sheetTemplate: SheetTemplate) => Promise<void>,
}

const TemplateRow = ({templateName, handleTemplateChoice}: ITemplateRow) => (
    <RowView>
        <BasicText>
            {templateName}
        </BasicText>
        <RowButton color={AppColors.BLUE} onPress={() => handleTemplateChoice(templateName)}>
            <ColoredText color={AppColors.WHITE}>Create</ColoredText>
        </RowButton>
    </RowView>
);