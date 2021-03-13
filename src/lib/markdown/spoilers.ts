import customFence from "markdown-it-container";

export default function spoiler(md): void {
  return customFence(md, "spoiler", {
    marker: "!",
    validate: () => true,
  });
}
