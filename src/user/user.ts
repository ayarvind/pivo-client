import axios from 'axios';
import { server, apiKey } from '../../app.json'
import { Account } from 'appwrite';
import { client } from '../utilities/appwrite';
export async function getUser(userId: string) {
    const url = `${server}/getUser`;

    console.log('making request to: ', url,' with userId: ', userId)
    try {
        const response = await axios.post(url, {
            userId
        }, {
            headers: {
                'api-key': apiKey
            }

        })
        console.log('response: ', response.data )
        return response.data;

    } catch (err) {
        console.log(err);
        return { success: false, user: null };
    }
}
export async function getUserId() {
    const account = new Account(client)
    try {
        const { $id } = await account.get();
        return $id;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function updateUser(userId: string, name: string, image: string, bio: string) {
    const url = `${server}/updateUser`;
    try {
        const response = await axios.post(url, {
            userId,
            name,
            image,
            bio
        }, {
            headers: {
                'api-key': apiKey
            }
        })
        return response.data;
    } catch (err) {
        console.log(err);
        return { success: false };
    }
}

export async function doesProfileNeedUpdate(userId: string): Promise<boolean> {
    const user = await getUser(userId);
    if (!user.success) {
        return false;
    }
    return !user.user.name;
}

