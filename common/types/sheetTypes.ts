import firebase from "firebase";
import {elementType} from "../constants/elementType";

export type Firestore = firebase.firestore.Firestore;

export interface ISheet {
    sheetName: string,
    timeStamp: number,
    fieldsArray: IElementUnion[],
    id?: string
}

// SHEET ELEMENTS
interface _IElement {
    name: string
}

export interface ISection extends _IElement{
    value: Array<IElementUnion>,
    type: elementType.SECTION,
}

export interface IText extends _IElement{
    value: string,
    type: elementType.TEXT,
}

export interface IControlledNumber extends _IElement {
    value: number,
    type: elementType.CONTROLLED_NUMBER,
}

export type IElementUnion = ISection | IText | IControlledNumber
