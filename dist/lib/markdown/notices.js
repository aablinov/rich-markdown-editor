import customFence from "markdown-it-container";
export default function notice(md) {
    return customFence(md, "notice", {
        marker: ":",
        validate: () => true,
    });
}
//# sourceMappingURL=notices.js.map