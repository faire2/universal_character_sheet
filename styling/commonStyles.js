import styled from "styled-components/native";

export const Preloader = styled.View`
    position: absolute;
    align-items: center;
    justify-content: center;
    background-color: #00edff;
`;

export const BasicView = styled.View`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 35px;
    background-color: aliceblue;
`;

export const BasicInput = styled.TextInput`
    width: 100%;
    margin-bottom: 15px;
    padding-bottom: 15px;  
    align-self: center;
    border-color: #ccc;
    border-bottom-width: 1px;
`;

export const BasicLink = styled.Text`
    color: #3740FE;
    margin-top: 25px;
    text-align: center;
`;

export const BasicText = styled.Text`
    font-size: 15px;
`;

export const RowView = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100px;
`;

export const RowButton = styled.TouchableOpacity`
    margin-left: 10px;
    padding: 10px;
    background-color: ${props => props.color};
    border-radius: 5px;
`;

export const ColoredText = styled(BasicText)`
    color: ${props => props.color};;
`;

export const appColors = Object.freeze({
    RED: "#E22929",
    WHITE: "#FFFFFF",
    BLUE: "#2196F3"
});
