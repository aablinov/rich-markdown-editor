import escape from "lodash/escape";
import slugify from "slugify";
function safeSlugify(text) {
    return `h-${escape(slugify(text, {
        remove: /[!"#$%&'\.()*+,\/:;<=>?@\[\]\\^_`{|}~]/g,
        lower: true,
    }))}`;
}
export default function headingToSlug(node, index = 0) {
    const slugified = safeSlugify(node.textContent);
    if (index === 0)
        return slugified;
    return `${slugified}-${index}`;
}
//# sourceMappingURL=headingToSlug.js.map