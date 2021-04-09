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
    padding: 5px;
    background-color: aliceblue;
`;

export const RowView = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const ColumnView = styled.View`
    display: flex;
    flex-direction: column;
`;

export const ViewWithWidth = styled.View<{width: number}>`
    width: ${props => props.width}vw;
`;

export const BasicInput = styled.TextInput<{value: string}>`
    width: 100%;
    align-self: center;
    border-color: #ccc;
    border-bottom-width: 1px;
    padding: 2%;
`;

export const BasicLink = styled.Text`
    color: #3740FE;
    margin-top: 25px;
    text-align: center;
`;

export const BasicText = styled.Text`
    font-size: 15px;
`;

export const Text25 = styled(BasicText)`
  padding-left: 5vw;
  width: 25%;
`;

export const Text50 = styled(BasicText)`
  padding-left: 5vw;
  width: 50%;
`;

export const Text75 = styled(BasicText)`
  padding-left: 5vw;
  width: 75%;
`;

export const Line = styled.View`
  border-width: 0.5px;
  border-color: rgba(13,214,207,0.33);
  margin-top: 2vw;
`;

export const RowButton = styled.TouchableOpacity<{color: AppColors}>`
    margin-left: 10px;
    padding: 5px;
    background-color: ${props => props.color};
    border-radius: 5px;
`;

export const SquareButton = styled(RowButton)`
    width: 25px;
    height: 25px;
    align-items: center;
    justify-content: center;
`;

export const WideButton = styled(RowButton)`
  position: relative;
  margin-left: 0;
  margin-top: 2vw;
  width: 100%;
  text-align: center;
`;

export const CircleButton = styled.TouchableOpacity<{color: AppColors}>`
  width: 2vw;
  height: 2vw;
  border-radius: 2vw;
  background-color: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding-top: 0.1vw;
`;

export const ColoredText = styled(BasicText)<{color: AppColors}>`
    color: ${props => props.color};
`;

export enum AppColors {
    RED = "#E22929",
    WHITE = "#FFFFFF",
    BLUE = "#2196F3",
}
