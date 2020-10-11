import * as React from "react";
import { withTheme } from "styled-components";
import ToolbarButton from "./ToolbarButton";
import ToolbarSeparator from "./ToolbarSeparator";
class Menu extends React.Component {
    render() {
        const { view, items } = this.props;
        const { state } = view;
        const Tooltip = this.props.tooltip;
        return (React.createElement("div", null, items.map((item, index) => {
            if (item.name === "separator" && item.visible !== false) {
                return React.createElement(ToolbarSeparator, { key: index });
            }
            if (item.visible === false || !item.icon) {
                return null;
            }
            const Icon = item.icon;
            const isActive = item.active ? item.active(state) : false;
            return (React.createElement(ToolbarButton, { key: index, onClick: () => item.name && this.props.commands[item.name](item.attrs), active: isActive },
                React.createElement(Tooltip, { tooltip: item.tooltip, placement: "top" },
                    React.createElement(Icon, { color: this.props.theme.toolbarItem }))));
        })));
    }
}
export default withTheme(Menu);
//# sourceMappingURL=Menu.js.map