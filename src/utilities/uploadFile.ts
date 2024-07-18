import RNFS from 'react-native-fs';
import SupabaseStorageManager, { Chunk } from '../utilities/media';

export async function uploadMedia(file: any, userId: string, fileName: string) {
    const chunkSize = 6 * 1024; // 6KB chunk size to account for base64 expansion
    const fileSize = file.fileSize;
    const supabaseStorageManager = new SupabaseStorageManager('pivo_storage');

    console.log((fileSize / 1024), 'KB fileSize');
    console.log('total chunks:', Math.ceil(fileSize / chunkSize));

    let start = 0;
    const chunks: string[] = [];

    try {
        // Read entire file as base64
        const fileEncoded = await RNFS.readFile(file.uri, 'base64');
        
        while (start < fileEncoded.length) {
            const end = Math.min(fileEncoded.length, start + chunkSize);
            const chunk = fileEncoded.substring(start, end);
            chunks.push(chunk);
            start = end;
        }

        console.log(`Total chunks to upload: ${chunks.length}`);

        const uploadPromises = chunks.map((chunk, index) => {
            const fileChunk: Chunk = {
                chunk,
                index,
                totalChunks: chunks.length,
                fileName,
            };
            return supabaseStorageManager.uploadFile(fileChunk, userId);
        });

        const responses = await Promise.all(uploadPromises);

        console.log('Upload responses:', responses);

        // Clean up temporary files after upload
        await RNFS.unlink(file.uri);

        return {
            data: responses,
            error: null,
        };

    } catch (error) {
        console.error('Upload failed:', error);

        try {
            // Clean up on error
            await RNFS.unlink(file.uri);
        } catch (cleanupError) {
            console.error('Cleanup failed:', cleanupError);
        }

        return {
            data: null,
            error,
        };
    }
}
