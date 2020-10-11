import { findParentNode, findSelectedNodeOfType } from "prosemirror-utils";
const isNodeActive = (type, attrs = {}) => state => {
    const node = findSelectedNodeOfType(type)(state.selection) ||
        findParentNode(node => node.type === type)(state.selection);
    if (!Object.keys(attrs).length || !node) {
        return !!node;
    }
    return node.node.hasMarkup(type, Object.assign(Object.assign({}, node.node.attrs), attrs));
};
export default isNodeActive;
//# sourceMappingURL=isNodeActive.js.map