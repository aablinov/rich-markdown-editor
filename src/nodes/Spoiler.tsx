import { wrappingInputRule } from "prosemirror-inputrules";
import toggleWrap from "../commands/toggleWrap";
import { NextIcon } from "outline-icons";
import * as React from "react";
import ReactDOM from "react-dom";
import Node from "./Node";

export default class Spoiler extends Node {
  get name() {
    return "container_spoiler";
  }

  get schema() {
    return {
      attrs: {
        style: {
          default: "closed",
        },
      },
      content: "block+",
      group: "block",
      defining: true,
      draggable: false,
      parseDOM: [
        {
          tag: "div.spoiler-block",
          preserveWhitespace: "full",
          contentElement: "div:last-child",
        },
      ],
      toDOM: node => {
        const isReadMode = this.editor.props.readOnly;

        const icon = document.createElement("div");
        icon.className = "icon";
        const component = <NextIcon />;
        ReactDOM.render(component, icon);

        if (!isReadMode) {
          return [
            "div",
            { class: "spoiler-block" },
            icon,
            ["div", { class: "content" }, 0],
          ];
        }

        const isOpened = node.attrs.style === "opened";
        const title = document.createElement("div");
        title.className = "title";
        title.innerText = node.content.content[0].textContent;
        title.addEventListener("click", this.handleVisibleChange(node));
        icon.addEventListener("click", this.handleVisibleChange(node));
        icon.style.cursor = "pointer";

        if (isOpened) icon.style.transform = "rotate(90deg)";

        if (isOpened) {
          return [
            "div",
            { class: `spoiler-block ${node.attrs.style}` },
            icon,
            ["div", { class: "content" }, 0],
          ];
        } else {
          return [
            "div",
            { class: `spoiler-block ${node.attrs.style}` },
            ["div", { style: "display: flex;" }, icon, title],
          ];
        }
      },
    };
  }

  handleVisibleChange = node => event => {
    const { view } = this.editor;
    const { tr } = view.state;
    const element = event.target;
    const { top, left } = element.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (result) {
      const transaction = tr.setNodeMarkup(result.inside, undefined, {
        style: node.attrs.style === "opened" ? "closed" : "opened",
      });
      view.dispatch(transaction);
    }
  };

  commands({ type }) {
    return attrs => toggleWrap(type, attrs);
  }

  inputRules({ type }) {
    return [wrappingInputRule(/^!!!$/, type)];
  }

  toMarkdown(state, node) {
    state.write("\n!!!\n");
    state.renderContent(node);
    state.ensureNewLine();
    state.write("!!!");
    state.closeBlock(node);
  }

  parseMarkdown() {
    return {
      block: "container_spoiler",
    };
  }
}
