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
import { Portal } from "react-portal";
import getTableColMenuItems from "../menus/tableCol";
import getTableRowMenuItems from "../menus/tableRow";
import getTableMenuItems from "../menus/table";
import getFormattingMenuItems from "../menus/formatting";
import FloatingToolbar from "./FloatingToolbar";
import LinkEditor from "./LinkEditor";
import Menu from "./Menu";
import isMarkActive from "../queries/isMarkActive";
import getMarkRange from "../queries/getMarkRange";
import isNodeActive from "../queries/isNodeActive";
import getColumnIndex from "../queries/getColumnIndex";
import getRowIndex from "../queries/getRowIndex";
import createAndInsertLink from "../commands/createAndInsertLink";
function isActive(props) {
    const { view } = props;
    const { selection } = view.state;
    return selection && !selection.empty && !selection.node;
}
export default class SelectionToolbar extends React.Component {
    constructor() {
        super(...arguments);
        this.handleOnCreateLink = async (title) => {
            const { dictionary, onCreateLink, view, onShowToast } = this.props;
            if (!onCreateLink) {
                return;
            }
            const { dispatch, state } = view;
            const { from, to } = state.selection;
            assert(from !== to);
            const href = `creating#${title}…`;
            const markType = state.schema.marks.link;
            dispatch(view.state.tr
                .removeMark(from, to, markType)
                .addMark(from, to, markType.create({ href })));
            createAndInsertLink(view, title, href, {
                onCreateLink,
                onShowToast,
                dictionary,
            });
        };
        this.handleOnSelectLink = ({ href, from, to, }) => {
            const { view } = this.props;
            const { state, dispatch } = view;
            const markType = state.schema.marks.link;
            dispatch(state.tr
                .removeMark(from, to, markType)
                .addMark(from, to, markType.create({ href })));
        };
    }
    render() {
        const _a = this.props, { dictionary, onCreateLink, isTemplate } = _a, rest = __rest(_a, ["dictionary", "onCreateLink", "isTemplate"]);
        const { view } = rest;
        const { state } = view;
        const { selection } = state;
        const isCodeSelection = isNodeActive(state.schema.nodes.code_block)(state);
        if (isCodeSelection) {
            return null;
        }
        const colIndex = getColumnIndex(state.selection);
        const rowIndex = getRowIndex(state.selection);
        const isTableSelection = colIndex !== undefined && rowIndex !== undefined;
        const link = isMarkActive(state.schema.marks.link)(state);
        const range = getMarkRange(selection.$from, state.schema.marks.link);
        let items = [];
        if (isTableSelection) {
            items = getTableMenuItems(dictionary);
        }
        else if (colIndex !== undefined) {
            items = getTableColMenuItems(state, colIndex, dictionary);
        }
        else if (rowIndex !== undefined) {
            items = getTableRowMenuItems(state, rowIndex, dictionary);
        }
        else {
            items = getFormattingMenuItems(state, isTemplate, dictionary);
        }
        if (!items.length) {
            return null;
        }
        return (React.createElement(Portal, null,
            React.createElement(FloatingToolbar, { view: view, active: isActive(this.props) }, link && range ? (React.createElement(LinkEditor, Object.assign({ dictionary: dictionary, mark: range.mark, from: range.from, to: range.to, onCreateLink: onCreateLink ? this.handleOnCreateLink : undefined, onSelectLink: this.handleOnSelectLink }, rest))) : (React.createElement(Menu, Object.assign({ items: items }, rest))))));
    }
}
//# sourceMappingURL=SelectionToolbar.js.map