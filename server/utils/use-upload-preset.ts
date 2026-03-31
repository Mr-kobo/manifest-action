import sharp from 'sharp';
sharp.cache(false);



export default () => {

    const app_config = useAppConfig();

    const getFormattedPreset = (preset: string[] | any) => {
        let presets: any = {};
        if(Array.isArray(preset)){
            preset.forEach((item: 'images' | 'avatar') => {
                Object.assign(presets, app_config.upload_presets[item])
            })
        } else {
             return preset;
        }
        return presets;
    }

    const executePreset = async (path: string, presets: any) => {
        console.log("executePreset")
        let sharpObject = sharp(path);
        const meta = await sharpObject.metadata();
        if(presets.resize) sharpObject.resize(presets.resize);
        if(presets.quality) {
            switch(meta.format) {
                case "jpg":
                case "jpeg" : 
                     sharpObject.jpeg({quality: presets.quality})
                     break;
                case "png":
                     sharpObject.png({compressionLevel: Math.trunc(presets.quality / 10) })
                     break; 
                case "webp":
                     sharpObject.webp({quality: presets.quality})
                     break;                 
            }
        }
        const buffer = await sharpObject.toBuffer();
        return await sharp(buffer).toFile(path);
    } 

    const executeThumb = async (path: string, max: string) => {
        console.log("executeThumb")
        let sharpObject = sharp(path);
        const lastIndex = path.lastIndexOf('.');
        const replacement = '_thumb.';
        const target = path.substring(0, lastIndex) + replacement + path.substring(lastIndex + 1);
        sharpObject.resize({
            height: parseInt(max),
            width: parseInt(max),
            fit: 'inside',
            background: {r: 0, g: 0, b: 0, alpha: 1}
        });
        const buffer = await sharpObject.toBuffer();
        return await sharp(buffer).toFile(target);
    }

    return {
        getFormattedPreset,
        executePreset,
        executeThumb
    }
}
