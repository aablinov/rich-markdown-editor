var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import assert from "assert";
import * as React from "react";
import LinkEditor from "./LinkEditor";
import FloatingToolbar from "./FloatingToolbar";
import createAndInsertLink from "../commands/createAndInsertLink";
function isActive(props) {
    const { view } = props;
    const { selection } = view.state;
    const paragraph = view.domAtPos(selection.$from.pos);
    return props.isActive && !!paragraph.node;
}
export default class LinkToolbar extends React.Component {
    constructor() {
        super(...arguments);
        this.menuRef = React.createRef();
        this.state = {
            left: -1000,
            top: undefined,
        };
        this.handleClickOutside = ev => {
            if (ev.target &&
                this.menuRef.current &&
                this.menuRef.current.contains(ev.target)) {
                return;
            }
            this.props.onClose();
        };
        this.handleOnCreateLink = async (title) => {
            const { dictionary, onCreateLink, view, onClose, onShowToast } = this.props;
            onClose();
            this.props.view.focus();
            if (!onCreateLink) {
                return;
            }
            const { dispatch, state } = view;
            const { from, to } = state.selection;
            assert(from === to);
            const href = `creating#${title}…`;
            dispatch(view.state.tr
                .insertText(title, from, to)
                .addMark(from, to + title.length, state.schema.marks.link.create({ href })));
            createAndInsertLink(view, title, href, {
                onCreateLink,
                onShowToast,
                dictionary,
            });
        };
        this.handleOnSelectLink = ({ href, title, }) => {
            const { view, onClose } = this.props;
            onClose();
            this.props.view.focus();
            const { dispatch, state } = view;
            const { from, to } = state.selection;
            assert(from === to);
            dispatch(view.state.tr
                .insertText(title, from, to)
                .addMark(from, to + title.length, state.schema.marks.link.create({ href })));
        };
    }
    componentDidMount() {
        window.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount() {
        window.removeEventListener("mousedown", this.handleClickOutside);
    }
    render() {
        const _a = this.props, { onCreateLink, onClose } = _a, rest = __rest(_a, ["onCreateLink", "onClose"]);
        const selection = this.props.view.state.selection;
        return (React.createElement(FloatingToolbar, Object.assign({ ref: this.menuRef, active: isActive(this.props) }, rest), isActive(this.props) && (React.createElement(LinkEditor, Object.assign({ from: selection.from, to: selection.to, onCreateLink: onCreateLink ? this.handleOnCreateLink : undefined, onSelectLink: this.handleOnSelectLink, onRemoveLink: onClose }, rest)))));
    }
}
//# sourceMappingURL=LinkToolbar.js.map