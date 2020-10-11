import * as React from "react";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import styled, { withTheme } from "styled-components";
import theme from "../theme";
function BlockMenuItem({ selected, disabled, onClick, title, shortcut, icon, }) {
    const Icon = icon;
    const ref = React.useCallback(node => {
        if (selected && node) {
            scrollIntoView(node, {
                scrollMode: "if-needed",
                block: "center",
                boundary: parent => {
                    return parent.id !== "block-menu-container";
                },
            });
        }
    }, [selected]);
    return (React.createElement(MenuItem, { selected: selected, onClick: disabled ? undefined : onClick, ref: ref },
        React.createElement(Icon, { color: selected ? theme.black : undefined }),
        "\u00A0\u00A0",
        title,
        React.createElement(Shortcut, null, shortcut)));
}
const MenuItem = styled.button `
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  width: 100%;
  height: 36px;
  cursor: pointer;
  border: none;
  opacity: ${props => (props.disabled ? ".5" : "1")};
  color: ${props => props.selected ? props.theme.black : props.theme.blockToolbarText};
  background: ${props => props.selected ? props.theme.blockToolbarTrigger : "none"};
  padding: 0 16px;
  outline: none;

  &:hover,
  &:active {
    color: ${props => props.theme.black};
    background: ${props => props.selected
    ? props.theme.blockToolbarTrigger
    : props.theme.blockToolbarHoverBackground};
  }
`;
const Shortcut = styled.span `
  color: ${props => props.theme.textSecondary};
  flex-grow: 1;
  text-align: right;
`;
export default withTheme(BlockMenuItem);
//# sourceMappingURL=BlockMenuItem.js.map