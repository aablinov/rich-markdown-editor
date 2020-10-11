export default function getMarkAttrs(state, type) {
    const { from, to } = state.selection;
    let marks = [];
    state.doc.nodesBetween(from, to, (node) => {
        marks = [...marks, ...node.marks];
        if (node.content) {
            node.content.forEach(content => {
                marks = [...marks, ...content.marks];
            });
        }
    });
    const mark = marks.find(markItem => markItem.type.name === type.name);
    if (mark) {
        return mark.attrs;
    }
    return {};
}
//# sourceMappingURL=getMarkAttrs.js.map