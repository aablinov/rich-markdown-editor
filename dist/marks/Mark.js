import { toggleMark } from "prosemirror-commands";
import Extension from "../lib/Extension";
export default class Mark extends Extension {
    get type() {
        return "mark";
    }
    get markdownToken() {
        return "";
    }
    get toMarkdown() {
        return {};
    }
    parseMarkdown() {
        return {};
    }
    commands({ type }) {
        return () => toggleMark(type);
    }
}
//# sourceMappingURL=Mark.js.map