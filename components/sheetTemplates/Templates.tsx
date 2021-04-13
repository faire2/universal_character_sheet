import React from "react";
import {AppColors, BasicText, BasicView, ColoredText, RowButton, RowView} from "../../common/styling/commonStyles";
import {StackScreenProps} from "@react-navigation/stack/lib/typescript/src/types";
import {getSheetTemplate, SheetTemplate} from "./sheetTemplatesFunctions";
import {NavigationLocations, RootStackParamList} from "../../common/navigation/NavigationStack";
import {addSheet} from "../../store/sheetsSlice";
import {ISheet} from "../sheet/sheetTypes";
import {useDispatch} from "react-redux";
import {useDb} from "../../firebase/context/DbContext";
import {collections} from "../../common/constants/collections";
import {useAppSelector} from "../../store";
import {selectUser} from "../../store/userSlice";

type Props = StackScreenProps<RootStackParamList, NavigationLocations.TEMPLATES>

export default function Templates({navigation}: Props) {
    const dispatch = useDispatch();
    const {db} = useDb();
    const user = useAppSelector(state => selectUser(state));

    async function handleTemplateChoice(template: SheetTemplate) {
        const newSheet: ISheet = getSheetTemplate(template);
        const sheetId = await db.collection(collections.USERS).doc(user.uid).collection(collections.SHEETS).doc().id;
        newSheet.id = sheetId;
        await dispatch(addSheet({sheet: newSheet}));
        // we do not know the newly created sheet id so we change state and get it from useEffect on next reload
        navigation.navigate(NavigationLocations.SHEET, {sheetId: sheetId});
    }

    return (
        <BasicView>
            {Object.keys(SheetTemplate).map((key, i) =>
                <TemplateRow templateName={SheetTemplate[key]} key={i} handleTemplateChoice={handleTemplateChoice}/>
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