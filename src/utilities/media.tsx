import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto';
import { supabaseUrl, supabaseKey } from '../../app.json';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials are not provided.");

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Chunk {
    chunk: string,
    index: number,
    totalChunks: number,
    fileName: string,
}

export interface FileProps {
    userId: string,
    fileName: string,
}

class SupabaseStorageManager {
    private bucket: string;

    constructor(bucketName: string) {
        this.bucket = bucketName;
    }

    async uploadFile(file: Chunk, userId: string) {
        const _file = file.fileName.split('.');
        const filePath = `${userId}/${_file[0]}/${Date.now()}-${file.index}`;
        const fileBuffer = Buffer.from(file.chunk, 'base64');  // Convert base64 chunk to Buffer
        const { data, error } = await supabase.storage.from(this.bucket).upload(filePath, fileBuffer, {
            contentType: `image/${_file[1]}`,
        });
        if (error) {
            console.log(error);
            throw new Error(`Upload failed for chunk ${file.index}`);
        }
        return data;
    }

    async getSignedUrls(file: FileProps) {
        const _file = file.fileName.split('.');
        const filePath = `${file.userId}/${_file[0]}/`;

        const { data, error } = await supabase.storage.from(this.bucket).list(filePath);
        if (error) {
            console.log(error);
            throw new Error("Error listing file parts");
        }

        if (!data || data.length === 0) {
            throw new Error("No file parts found");
        }

        const signedUrls = [];
        for (const part of data) {
            const { data: urlData, error: urlError } = await supabase.storage.from(this.bucket).createSignedUrl(`${filePath}${part.name}`, 60); // URL valid for 60 seconds
            if (urlError) {
                console.log(urlError);
                throw new Error("Error creating signed URL");
            }
            signedUrls.push(urlData?.signedUrl);
        }

        return signedUrls;
    }

    async deleteMedia(file: FileProps) {
        const _file = file.fileName.split('.');
        const filePath = `${file.userId}/${_file[0]}/`;

        const { data, error } = await supabase.storage.from(this.bucket).remove([filePath]);
        if (error) {
            console.log(error);
            throw new Error("Error deleting media");
        }
        return data;
    }

    async replaceMedia(oldFile: FileProps, newFile: Chunk, userId: string) {
        await this.deleteMedia(oldFile);
        await this.uploadFile(newFile, userId);
    }

    async combineChunks(userId: string, fileName: string) {
        if(!fileName) return 
        try {
            // Get signed URLs for the file chunks
            const signedUrls = await this.getSignedUrls({ userId, fileName });

            // Ensure the signed URLs are sorted by index
            const sortedSignedUrls = signedUrls.sort((a: string | undefined, b: string | undefined) => {
                const indexA = parseInt((a ?? '').split('-').pop()?.split('?')[0] ?? '');
                const indexB = parseInt((b ?? '').split('-').pop()?.split('?')[0] ?? '');
                return indexA - indexB;
            });

            // Log the temporary directory path
            console.log('Temporary Directory Path:', RNFS.TemporaryDirectoryPath);

            // Download all chunks
            const downloadPromises = sortedSignedUrls.map((url, index) => {
                const filePath = `${RNFS.TemporaryDirectoryPath}/${fileName?.split('.')[0]}_${index}`;
                return RNFS.downloadFile({
                    fromUrl: url as string,
                    toFile: filePath
                }).promise.then(() => {
                    console.log(`Downloaded chunk to ${filePath}`);
                    return filePath;
                });
            });

            // Wait for all chunks to be downloaded
            const filePaths = await Promise.all(downloadPromises);

            // Combine all files into one
            const combinedFilePath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
            for (const filePath of filePaths) {
                // Read the content of each chunk and append to the combined file
                const chunkContent = await RNFS.readFile(filePath, 'base64');
                await RNFS.appendFile(combinedFilePath, chunkContent, 'base64');
            }

            console.log("Files combined successfully into:", combinedFilePath);

            // Optionally remove individual chunk files
            await Promise.all(filePaths.map(async filePath => {
                await RNFS.unlink(filePath);
                console.log(`Deleted chunk file at ${filePath}`);
            }));

            // Verify if the files are deleted
            const remainingFiles = await Promise.all(filePaths.map(filePath => RNFS.exists(filePath)));
            remainingFiles.forEach((exists, index) => {
                if (exists) {
                    console.log(`File still exists at ${filePaths[index]}`);
                } else {
                    console.log(`File successfully deleted at ${filePaths[index]}`);
                }
            });

            return combinedFilePath;
        } catch (error) {
            console.error("Error combining chunks:", error);
            throw error;
        }
    }
}

export default SupabaseStorageManager;
