
import fs from 'fs';
import mime from 'mime';
import path from 'path';
import { cwd } from 'process';
import { MultiPartData } from 'h3';
import _ from 'lodash';
import { BadRequest, NotFound } from '~/models/core/errors.model';
import { IMedia } from '~/schemas/core/media.schema';
import { randomUUID } from 'crypto';
import useStorageResolver from './use-storage-resolver';

export interface IUploadOptions {
  // subfolder to place the file in
  subfolder?: string;
  // generate a unique name for the file
  unique?: boolean;
}

const defaultConfig: IUploadOptions = {
  subfolder: undefined,
  unique: true,
};

export default () => {
  const { uploads } = useRuntimeConfig();

  const up = async (file: MultiPartData, options?: IUploadOptions): Promise<IMedia> => {
    const opts = _.assign(_.clone(defaultConfig), options || {});
    const { subfolder } = opts;

    if (!file.filename)
      throw new BadRequest({ message: 'UPLOAD.MISSING_FILENAME' });

    const key = randomUUID(); //useGenerateKey(24);
    const ext = path.extname(file.filename);

    const name = _.kebabCase(file.filename);
    const slug = opts.unique ? `${path.basename(name, ext).trim()}_${key}${ext}` : name;
    const uri = path.join(uploads.uri, (subfolder ? subfolder : ''), slug);
    const itemKey = decodeURIComponent((subfolder ? subfolder + ':' : '') + slug);

    try {
      const storage = useStorage('uploads');
      await storage.setItemRaw(itemKey, file.data);
      await storage.setMeta(itemKey, {
        contentType: file.type,
      });
      return { slug, uri, key: itemKey, contentType: file.type || 'unknown' };

      // FS
      // const targetFolder = path.join(path.resolve(), `${uploads.path}${subfolder ? '/' + subfolder : ''}`);
      // const filepath = path.join(targetFolder, slug);
      // if (!fs.existsSync(targetFolder)) {
      //   fs.mkdirSync(targetFolder, { recursive: true });
      // }
      // await new Promise((resolve, reject) => fs.writeFile(filepath, file.data, (err) => err ? reject(err) : resolve({})));
      // const mimetype = file.type || 'unknown';
      // return { slug, uri, contentType: mimetype, key: itemKey };
    } catch (err) {
      console.log('[UPLOADS]', err);
      throw err;
    }
  };

  const down = async (filename: string, options?: IUploadOptions) => {
    try {
      const opts = _.assign(_.clone(defaultConfig), options || {});
      const { subfolder: type } = opts;

      const storage = useStorage('uploads');
      const itemKey = decodeURIComponent((type ? type + ':' : '') + filename);
      // console.log('[DOWNLOAD]', itemKey);
      return await storage.getItemRaw(itemKey, );

      // const filepath = path.join(path.resolve(), `${uploads.path}/${type ? '/' + type : ''}${filename}`);
      // console.log('[DOWNLOAD]', filepath);
      // return await new Promise<Buffer>((resolve, reject) => fs.readFile(filepath, (err, data) => err ? reject(err) : resolve(data)));
    } catch (err) {
      console.log('[UPLOADS]', err);
      throw err;
    }
  };

  const meta = async (filename: string, options?: IUploadOptions) => {
    try {
      const opts = _.assign(_.clone(defaultConfig), options || {});
      const { subfolder: type } = opts;
      const storage = useStorage('uploads');
      const itemKey = decodeURIComponent((type ? type + ':' : '') + filename);
      return await storage.getMeta(itemKey);
    } catch (err) {
      console.log('[UPLOADS]', err);
      throw err;
    }
  };

  const remove = async (filename: string, options?: IUploadOptions) => {
    try {
      const opts = _.assign(_.clone(defaultConfig), options || {});
      const { subfolder: type } = opts;

      const storage = useStorage('uploads');
      const itemKey = decodeURIComponent((type ? type + ':' : '') + filename);
      console.log('[REMOVE]', itemKey);
      return await storage.removeItem(itemKey, { removeMeta: true });

      // const filepath = path.join(path.resolve(), `${uploads.path}/${type ? '/' + type : ''}${filename}`);
      // console.log('[REMOVE]', filepath);
      // return await new Promise<void>((resolve, reject) => fs.rm(filepath, (err) => err ? reject(err) : resolve()));
    } catch (err) {
      console.log('[REMOVE]', err);
      throw err;
    }
  };

  /**
   * Retrieve path from PATH or URI
   * @param uri 
   */
  const { resolve, driver_base } = useStorageResolver();

  /**
   * Check if a file exist using path, uri or slug
   */
  const check = {
    path: async (filepath: string, options?: IUploadOptions) => {
      const exist = fs.existsSync(filepath);
      let media: IMedia | undefined = undefined;
      let stats: fs.Stats | undefined = undefined;
      // retrieve media info
      if (exist) {
        const slug = path.basename(filepath);
        const uri = resolve.uri(filepath);

        stats = await new Promise((resolve, reject) => fs.stat(filepath, (err, result) => err ? reject(err) : resolve(result)));
        // const size = stats?.size || 0;
        const mimetype = (mime as any).getType(filepath) || 'unknown';

        const { subfolder: type } = options || {};
        const key = (type ? type + ':' : '') + slug;

        media = { slug, uri, contentType: mimetype, key };
      }

      return { exist, media, stats };
    },
    uri: async (uri: string) => {
      const filepath = resolve.path(uri);
      return await check.path(filepath);
    },
    slug: async (slug: string, options?: IUploadOptions) => {
      const opts = _.assign(_.clone(defaultConfig), options || {});
      const { subfolder: type } = opts;
      const filepath = path.join(driver_base, (type ? type : ''), slug);
      return await check.path(filepath);
    },
    key: async (key: string, options?: IUploadOptions) => {
      const opts = _.assign(_.clone(defaultConfig), options || {});
      const { subfolder: type } = opts;
      key = (type ? type + ':' : '') + key;
      return await useStorage('uploads').hasItem(key);
    }
  };


  return { up, down, meta, remove, check, resolve };

};