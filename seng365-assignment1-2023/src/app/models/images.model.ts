import {fs} from "mz";
import {getImageMimetype} from "./imageTools";
import {generate} from "rand-token";
import Logger from "../../config/logger";

const filepath = './storage/images/';
const readImage = async (fileName: string) : Promise<[Buffer, string]> => {
    const image = await fs.readFile(filepath + fileName);
    const mimeType = getImageMimetype(fileName);
    return [image, mimeType];
}

const removeImage = async (filename: string): Promise<void> => {
    if(filename) {
        if (await fs.exists(filepath + filename)) {
            await fs.unlink(filepath + filename);
        }
    }
}

const addImage = async (image:any, fileExt: string): Promise<string> => {
    const filename = generate(32) + fileExt;

    try {
        await fs.writeFile(filepath + filename, image);
        return filename;
    } catch (err) {
        Logger.error(err);
        fs.unlink(filepath + filename).catch(err => Logger.error(err));
        throw err;
    }
}

export {readImage, removeImage, addImage};