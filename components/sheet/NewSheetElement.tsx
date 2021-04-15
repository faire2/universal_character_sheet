import React, {useState} from "react";
import {
    AppColors,
    BasicInput,
    BasicText,
    ColoredText,
    RowButton,
    RowView,
    ViewWithWidth
} from "../../common/styling/commonStyles";
import styled from "styled-components/native";
import CheckBox from "expo-checkbox";

export default function NewSheetElement() {
    const [fieldName, setFieldName] = useState<string>("");
    const [fieldValue, setFieldValue] = useState<string>("");
    const [controlled, setControlled] = useState<boolean>(false);
    const [controlledVisible, setControlledVisible] = useState(false);

    function onValueChange(val: string) {
        setFieldValue(val);
        let isNum = /^\d+$/.test(val);
        setControlledVisible(isNum);
    }

    return (
        <Container>
            <NewEntryLabel>New entry:</NewEntryLabel>
            <ViewWithWidthAndMargin width={15}>
                <BasicInput placeholder={"Name"} value={fieldName} onChangeText={(val: string) => setFieldName(val)}/>
            </ViewWithWidthAndMargin>
            <BasicText> - </BasicText>
            <ViewWithWidthAndMargin width={15}>
                <BasicInput placeholder={"Value"} value={fieldValue}
                            onChangeText={(val: string) => onValueChange(val)}/>
            </ViewWithWidthAndMargin>
            {controlledVisible ?
                <RowView>
                    <NewEntryLabel>Controlled:</NewEntryLabel>
                    <CheckBox value={controlled} onValueChange={(val) => setControlled(val)}/>
                </RowView>
                : null
            }
            <RowButton color={AppColors.BLUE}>
                <ButtonText color={AppColors.WHITE}>
                    Add
                </ButtonText>
            </RowButton>
            <BasicText>
                {controlled}
            </BasicText>
        </Container>
    )
}

const Container = styled(RowView)`
  margin-top: 10px;
  justify-content: center;
  align-self: flex-start;
`;

const NewEntryLabel = styled(BasicText)`
  font-size: smaller;
  text-align: right;
  padding-left: 5px;
  padding-right: 5px;
`;

const ButtonText = styled(ColoredText)`
  font-size: smaller;
`;

const ViewWithWidthAndMargin = styled(ViewWithWidth)<{ width: number }>`
  margin-left: 10px;
`;