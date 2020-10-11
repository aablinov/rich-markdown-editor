import headingToSlug from "./headingToSlug";
export default function getHeadings(view) {
    const headings = [];
    const previouslySeen = {};
    view.state.doc.forEach(node => {
        if (node.type.name === "heading") {
            const id = headingToSlug(node);
            let name = id;
            if (previouslySeen[id] > 0) {
                name = headingToSlug(node, previouslySeen[id]);
            }
            previouslySeen[id] =
                previouslySeen[id] !== undefined ? previouslySeen[id] + 1 : 1;
            headings.push({
                title: node.textContent,
                level: node.attrs.level,
                id: name,
            });
        }
    });
    return headings;
}
//# sourceMappingURL=getHeadings.js.map