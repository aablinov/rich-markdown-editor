import uploadPlaceholderPlugin, { findPlaceholder, } from "../lib/uploadPlaceholder";
import { ToastType } from "../types";
const insertFiles = function (view, event, pos, files, options) {
    const images = files.filter(file => /image/i.test(file.type));
    if (images.length === 0)
        return;
    const { dictionary, uploadImage, onImageUploadStart, onImageUploadStop, onShowToast, } = options;
    if (!uploadImage) {
        console.warn("uploadImage callback must be defined to handle image uploads.");
        return;
    }
    event.preventDefault();
    if (onImageUploadStart)
        onImageUploadStart();
    const { schema } = view.state;
    let complete = 0;
    for (const file of images) {
        const id = {};
        const { tr } = view.state;
        tr.setMeta(uploadPlaceholderPlugin, {
            add: { id, file, pos },
        });
        view.dispatch(tr);
        uploadImage(file)
            .then(src => {
            const pos = findPlaceholder(view.state, id);
            if (pos === null)
                return;
            const transaction = view.state.tr
                .replaceWith(pos, pos, schema.nodes.image.create({ src }))
                .setMeta(uploadPlaceholderPlugin, { remove: { id } });
            view.dispatch(transaction);
        })
            .catch(error => {
            console.error(error);
            const transaction = view.state.tr.setMeta(uploadPlaceholderPlugin, {
                remove: { id },
            });
            view.dispatch(transaction);
            if (onShowToast) {
                onShowToast(dictionary.imageUploadError, ToastType.Error);
            }
        })
            .finally(() => {
            complete++;
            if (complete === images.length) {
                if (onImageUploadStop)
                    onImageUploadStop();
            }
        });
    }
};
export default insertFiles;
//# sourceMappingURL=insertFiles.js.map