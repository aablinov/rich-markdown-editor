import { TrashIcon } from "outline-icons";
export default function tableMenuItems(dictionary) {
    return [
        {
            name: "deleteTable",
            tooltip: dictionary.deleteTable,
            icon: TrashIcon,
            active: () => false,
        },
    ];
}
//# sourceMappingURL=table.js.map