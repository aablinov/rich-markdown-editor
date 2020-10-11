import Extension from "../lib/Extension";
export default class Node extends Extension {
    get type() {
        return "node";
    }
    get markdownToken() {
        return "";
    }
    toMarkdown(state, node) {
        console.error("toMarkdown not implemented", state, node);
    }
    parseMarkdown() {
        return;
    }
}
//# sourceMappingURL=Node.js.map