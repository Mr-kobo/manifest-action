import useUploads from '~~/server/utils/use-uploads';
import useUploadPreset from '~~/server/utils/use-upload-preset';
import { BadRequest } from '~/models/core/errors.model';

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event);
    const path = params['path'];

    if (!path) {
        throw new BadRequest('error.path_is_missing');
    }

    try {
        const { down, meta } = useUploads();
        const file = await down(path as string);
        const meta_files = await meta(path);
        setResponseHeader(event, 'content-type', (meta_files?.contentType as string) || 'image');

        return file;
    } catch (err) {
        console.error(err);
        throw err
    }
});
