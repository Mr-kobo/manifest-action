import path from 'path';


export default (_storage: string = 'uploads') => {

    const driver_base = useStorage().getMount(_storage)?.driver?.options?.base;

    /**
     * Retrieve path from PATH or URI
     * @param uri 
     */
    const resolve = {
        path: (uri: string, storage?: string): string => {
            const { uploads } = useRuntimeConfig();
            const driver_base = useStorage().getMount(storage || _storage)?.driver?.options?.base;
            return path.join(driver_base, uri.replace(uploads.uri, ''));
        },
        key: (filepath: string, storage?: string) => {
            const driver_base = useStorage().getMount(storage || _storage)?.driver?.options?.base;
            return filepath.replace(driver_base, '');
        },
        uri: (filepath: string, storage?: string): string => {
            const { uploads } = useRuntimeConfig();
            return path.join(uploads.uri, resolve.key(filepath, storage || _storage));
        }
    };

    return {
        driver_base,
        resolve
    };
};