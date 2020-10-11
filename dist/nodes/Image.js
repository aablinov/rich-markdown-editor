import * as React from "react";
import { Plugin, NodeSelection } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import { setTextSelection } from "prosemirror-utils";
import styled from "styled-components";
import ImageZoom from "react-medium-image-zoom";
import getDataTransferFiles from "../lib/getDataTransferFiles";
import uploadPlaceholderPlugin from "../lib/uploadPlaceholder";
import insertFiles from "../commands/insertFiles";
import Node from "./Node";
const IMAGE_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;
const STYLE = {
    display: "inline-block",
    maxWidth: "100%",
    maxHeight: "75vh",
};
const uploadPlugin = options => new Plugin({
    props: {
        handleDOMEvents: {
            paste(view, event) {
                if ((view.props.editable && !view.props.editable(view.state)) ||
                    !options.uploadImage) {
                    return false;
                }
                if (!event.clipboardData)
                    return false;
                const files = Array.prototype.slice
                    .call(event.clipboardData.items)
                    .map(dt => dt.getAsFile())
                    .filter(file => file);
                if (files.length === 0)
                    return false;
                const { tr } = view.state;
                if (!tr.selection.empty) {
                    tr.deleteSelection();
                }
                const pos = tr.selection.from;
                insertFiles(view, event, pos, files, options);
                return true;
            },
            drop(view, event) {
                if ((view.props.editable && !view.props.editable(view.state)) ||
                    !options.uploadImage) {
                    return false;
                }
                const files = getDataTransferFiles(event).filter(file => /image/i.test(file.type));
                if (files.length === 0) {
                    return false;
                }
                const result = view.posAtCoords({
                    left: event.clientX,
                    top: event.clientY,
                });
                if (result) {
                    insertFiles(view, event, result.pos, files, options);
                    return true;
                }
                return false;
            },
        },
    },
});
export default class Image extends Node {
    constructor() {
        super(...arguments);
        this.handleKeyDown = ({ node, getPos }) => event => {
            if (event.key === "Enter") {
                event.preventDefault();
                const { view } = this.editor;
                const pos = getPos() + node.nodeSize;
                view.focus();
                view.dispatch(setTextSelection(pos)(view.state.tr));
                return;
            }
            if (event.key === "Backspace" && event.target.innerText === "") {
                const { view } = this.editor;
                const $pos = view.state.doc.resolve(getPos());
                const tr = view.state.tr.setSelection(new NodeSelection($pos));
                view.dispatch(tr.deleteSelection());
                view.focus();
                return;
            }
        };
        this.handleBlur = ({ node, getPos }) => event => {
            const alt = event.target.innerText;
            const src = node.attrs.src;
            if (alt === node.attrs.alt)
                return;
            const { view } = this.editor;
            const { tr } = view.state;
            const pos = getPos();
            const transaction = tr.setNodeMarkup(pos, undefined, {
                src,
                alt,
            });
            view.dispatch(transaction);
        };
        this.handleSelect = ({ getPos }) => event => {
            event.preventDefault();
            const { view } = this.editor;
            const $pos = view.state.doc.resolve(getPos());
            const transaction = view.state.tr.setSelection(new NodeSelection($pos));
            view.dispatch(transaction);
        };
        this.component = props => {
            const { theme, isEditable, isSelected } = props;
            const { alt, src } = props.node.attrs;
            return (React.createElement("div", { contentEditable: false, className: "image" },
                React.createElement(ImageWrapper, { className: isSelected ? "ProseMirror-selectednode" : "", onClick: isEditable ? this.handleSelect(props) : undefined },
                    React.createElement(ImageZoom, { image: {
                            src,
                            alt,
                            style: STYLE,
                        }, defaultStyles: {
                            overlay: {
                                backgroundColor: theme.background,
                            },
                        }, shouldRespectMaxDimension: true })),
                (isEditable || alt) && (React.createElement(Caption, { onKeyDown: this.handleKeyDown(props), onBlur: this.handleBlur(props), tabIndex: -1, contentEditable: isEditable, suppressContentEditableWarning: true }, alt))));
        };
    }
    get name() {
        return "image";
    }
    get schema() {
        return {
            inline: true,
            attrs: {
                src: {},
                alt: {
                    default: null,
                },
            },
            content: "text*",
            marks: "",
            group: "inline",
            selectable: true,
            draggable: true,
            parseDOM: [
                {
                    tag: "div[class=image]",
                    getAttrs: (dom) => {
                        const img = dom.getElementsByTagName("img")[0];
                        const caption = dom.getElementsByTagName("p")[0];
                        return {
                            src: img.getAttribute("src"),
                            alt: caption.innerText,
                        };
                    },
                },
            ],
            toDOM: node => {
                return [
                    "div",
                    {
                        class: "image",
                    },
                    ["img", Object.assign(Object.assign({}, node.attrs), { contentEditable: false })],
                    ["p", { class: "caption" }, 0],
                ];
            },
        };
    }
    toMarkdown(state, node) {
        state.write("![" +
            state.esc((node.attrs.alt || "").replace("\n", "") || "") +
            "](" +
            state.esc(node.attrs.src) +
            ")");
    }
    parseMarkdown() {
        return {
            node: "image",
            getAttrs: token => ({
                src: token.attrGet("src"),
                alt: (token.children[0] && token.children[0].content) || null,
            }),
        };
    }
    commands({ type }) {
        return attrs => (state, dispatch) => {
            const { selection } = state;
            const position = selection.$cursor
                ? selection.$cursor.pos
                : selection.$to.pos;
            const node = type.create(attrs);
            const transaction = state.tr.insert(position, node);
            dispatch(transaction);
            return true;
        };
    }
    inputRules({ type }) {
        return [
            new InputRule(IMAGE_INPUT_REGEX, (state, match, start, end) => {
                const [okay, alt, src] = match;
                const { tr } = state;
                if (okay) {
                    tr.replaceWith(start - 1, end, type.create({
                        src,
                        alt,
                    }));
                }
                return tr;
            }),
        ];
    }
    get plugins() {
        return [uploadPlaceholderPlugin, uploadPlugin(this.options)];
    }
}
const ImageWrapper = styled.span `
  line-height: 0;
  display: inline-block;
`;
const Caption = styled.p `
  border: 0;
  display: block;
  font-size: 13px;
  font-style: italic;
  color: ${props => props.theme.textSecondary};
  padding: 2px 0;
  line-height: 16px;
  text-align: center;
  width: 100%;
  min-height: 1em;
  outline: none;
  background: none;
  resize: none;

  &:empty:before {
    color: ${props => props.theme.placeholder};
    content: "Write a caption";
    pointer-events: none;
  }
`;
//# sourceMappingURL=Image.js.map