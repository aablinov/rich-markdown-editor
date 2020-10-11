import { TrashIcon, InsertAboveIcon, InsertBelowIcon } from "outline-icons";
export default function tableRowMenuItems(state, index, dictionary) {
    return [
        {
            name: "addRowAfter",
            tooltip: dictionary.addRowBefore,
            icon: InsertAboveIcon,
            attrs: { index: index - 1 },
            active: () => false,
            visible: index !== 0,
        },
        {
            name: "addRowAfter",
            tooltip: dictionary.addRowAfter,
            icon: InsertBelowIcon,
            attrs: { index },
            active: () => false,
        },
        {
            name: "separator",
        },
        {
            name: "deleteRow",
            tooltip: dictionary.deleteRow,
            icon: TrashIcon,
            active: () => false,
        },
    ];
}
//# sourceMappingURL=tableRow.js.map