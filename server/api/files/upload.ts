import useUploads from '~~/server/utils/use-uploads';
import useUploadPreset from '~~/server/utils/use-upload-preset';
import { NotFound } from '~/models/core/errors.model';

export default defineEventHandler(async (event) => {

    // [Guard] 
    await useGuard(event, [{
        auth: true,
    }]);

    const { getFormattedPreset, executePreset, executeThumb } = useUploadPreset();
    const multipart = await readMultipartFormData(event);

    if (multipart && multipart.some(r => r.name === 'files')) {
        const files = multipart.filter(r => r.name === 'files');
        const preset = multipart.find(r => r.name === 'preset');
        const type = multipart.find(r => r.name === 'type');
        const thumb = multipart.find(r => r.name === 'thumb');
        const result = [];

        let formattedPreset: any = {};
        if (preset && preset.data) {
            // preset can be array of string (preset come from config) or
            // transform object come from front end
            formattedPreset = getFormattedPreset(JSON.parse(preset.data.toString()));
        }
        for (let file of files) {
            // test size
            if (formattedPreset.size < file.data.toString().length) throw createError({ statusCode: 413, message: 'error.filesize' });
            // test type
            if (formattedPreset.accept && !formattedPreset.accept.includes(file.type)) throw createError({ statusCode: 415, message: 'error.filetype' });

            // upload file
            const { up, resolve } = useUploads();
            const uploadFile = await up(file, { subfolder: type?.data.toString() });

            // make file transformation if needed by presets
            if (formattedPreset.resize || formattedPreset.quality) {
                console.log("call preset", resolve.path(uploadFile.uri));
                await executePreset(resolve.path(uploadFile.uri), formattedPreset);
            }

            // want thumb ?
            if (thumb && thumb.data) {
                await executeThumb(resolve.path(uploadFile.uri), thumb.data.toString());
            }

            result.push(uploadFile);
        }
        return { success: true, file: result };
    }
    throw new NotFound({ message: 'error.filenotfound' });
});
