import customFence from "markdown-it-container";

export default function spoiler(md): void {
  return customFence(md, "spoiler", {
    marker: "!",
    validate: () => true,
    render: function(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<div class="spoiler-block">\n`;
      } else {
        // closing tag
        return "</div>\n";
      }
    },
  });
}
