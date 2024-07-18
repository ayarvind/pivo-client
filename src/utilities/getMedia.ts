import SupabaseStorageManager, { Chunk } from "../utilities/media";

export default async function getMedia(fileName: string, userId: string) {
    const ssm = new SupabaseStorageManager('pivo_storage')
   console.log(fileName, userId)
    const media =  await ssm.combineChunks(userId, fileName)
    return media;
}