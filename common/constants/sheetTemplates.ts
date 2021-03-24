import {elementType} from "./elementType";
import {ISheet} from "../types/sheetTypes";
import cloneDeep from 'lodash/cloneDeep';


export function getSheetTemplate(sheetTemplate: template): ISheet {
    switch (sheetTemplate) {
        case template.PF2E:
            return cloneDeep(_PF2E);
    }
}

const _PF2E: ISheet = {
    sheetName: "Pathfinder 2e character sheet",
    timeStamp: Date.now(),
    fieldsArray:
        [
            {
                name: "Character name",
                value: "",
                type: elementType.TEXT
            },
            {
                type: elementType.TEXT,
                name: "Ancestry:",
                value: "",
            },
            {
                type: elementType.TEXT,
                name: "Heritage:",
                value: "",
            },
            {
                type: elementType.TEXT,
                name: "Background:",
                value: "",
            },
            {
                type: elementType.SECTION,
                name: "Characteristics:",
                value: [
                    {
                        type: elementType.CONTROLLED_NUMBER,
                        name: "Hitpoints:",
                        value: 0,
                    },
                    {
                        type: elementType.TEXT,
                        name: "Speed:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Armor class:",
                        value: "",
                    },
                ],
            },
            {
                type: elementType.SECTION,
                name: "Attacks:",
                value: [],
            },
            {
                type: elementType.SECTION,
                name: "Skills:",
                value: [
                    {
                        type: elementType.TEXT,
                        name: "Acrobatics:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Athletics:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Crafting:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Deception:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Diplomacy:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Intimidation:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Lore:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Medicine:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Nature:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Occultism:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Performance:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Religion:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Society:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Stealth:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Survival:",
                        value: "",
                    },
                    {
                        type: elementType.TEXT,
                        name: "Thievery:",
                        value: "",
                    },
                ],
            }
        ]
};

export enum template {
    PF2E,
}