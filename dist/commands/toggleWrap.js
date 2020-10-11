import { wrapIn, lift } from "prosemirror-commands";
import isNodeActive from "../queries/isNodeActive";
export default function toggleWrap(type, attrs) {
    return (state, dispatch) => {
        const isActive = isNodeActive(type)(state);
        if (isActive) {
            return lift(state, dispatch);
        }
        return wrapIn(type, attrs)(state, dispatch);
    };
}
//# sourceMappingURL=toggleWrap.js.map