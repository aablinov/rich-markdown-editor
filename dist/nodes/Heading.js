import { Plugin } from "prosemirror-state";
import copy from "copy-to-clipboard";
import { Decoration, DecorationSet } from "prosemirror-view";
import { textblockTypeInputRule } from "prosemirror-inputrules";
import { setBlockType } from "prosemirror-commands";
import backspaceToParagraph from "../commands/backspaceToParagraph";
import toggleBlockType from "../commands/toggleBlockType";
import headingToSlug from "../lib/headingToSlug";
import Node from "./Node";
import { ToastType } from "../types";
export default class Heading extends Node {
    constructor() {
        super(...arguments);
        this.className = "heading-name";
        this.handleCopyLink = () => {
            return event => {
                const anchor = event.currentTarget.nextSibling.getElementsByClassName(this.className)[0];
                const hash = `#${anchor.id}`;
                const urlWithoutHash = window.location.href.split("#")[0];
                copy(urlWithoutHash + hash);
                if (this.options.onShowToast) {
                    this.options.onShowToast(this.options.dictionary.linkCopied, ToastType.Info);
                }
            };
        };
    }
    get name() {
        return "heading";
    }
    get defaultOptions() {
        return {
            levels: [1, 2, 3, 4],
        };
    }
    get schema() {
        return {
            attrs: {
                level: {
                    default: 1,
                },
            },
            content: "inline*",
            group: "block",
            defining: true,
            draggable: false,
            parseDOM: this.options.levels.map(level => ({
                tag: `h${level}`,
                attrs: { level },
            })),
            toDOM: node => {
                const button = document.createElement("button");
                button.innerText = "#";
                button.type = "button";
                button.className = "heading-anchor";
                button.addEventListener("click", this.handleCopyLink());
                return [
                    `h${node.attrs.level + (this.options.offset || 0)}`,
                    button,
                    ["span", 0],
                ];
            },
        };
    }
    toMarkdown(state, node) {
        state.write(state.repeat("#", node.attrs.level) + " ");
        state.renderInline(node);
        state.closeBlock(node);
    }
    parseMarkdown() {
        return {
            block: "heading",
            getAttrs: (token) => ({
                level: +token.tag.slice(1),
            }),
        };
    }
    commands({ type, schema }) {
        return (attrs) => {
            return toggleBlockType(type, schema.nodes.paragraph, attrs);
        };
    }
    keys({ type }) {
        const options = this.options.levels.reduce((items, level) => (Object.assign(Object.assign({}, items), {
            [`Shift-Ctrl-${level}`]: setBlockType(type, { level }),
        })), {});
        return Object.assign(Object.assign({}, options), { Backspace: backspaceToParagraph(type) });
    }
    get plugins() {
        return [
            new Plugin({
                props: {
                    decorations: state => {
                        const { doc } = state;
                        const decorations = [];
                        const previouslySeen = {};
                        doc.descendants((node, pos) => {
                            if (node.type.name !== this.name)
                                return;
                            const slug = headingToSlug(node);
                            let id = slug;
                            if (previouslySeen[slug] > 0) {
                                id = headingToSlug(node, previouslySeen[slug]);
                            }
                            previouslySeen[slug] =
                                previouslySeen[slug] !== undefined
                                    ? previouslySeen[slug] + 1
                                    : 1;
                            decorations.push(Decoration.inline(pos, pos + node.nodeSize, {
                                id,
                                class: this.className,
                                nodeName: "a",
                            }));
                        });
                        return DecorationSet.create(doc, decorations);
                    },
                },
            }),
        ];
    }
    inputRules({ type }) {
        return this.options.levels.map(level => textblockTypeInputRule(new RegExp(`^(#{1,${level}})\\s$`), type, () => ({
            level,
        })));
    }
}
//# sourceMappingURL=Heading.js.map