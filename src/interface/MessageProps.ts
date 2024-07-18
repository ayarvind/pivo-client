export interface MessageProps{
    sender :  string,
    receiver: string,
    timestamp : string,
    message:{
        msgId?: string,
        type:'TEXT' | 'FILE' | 'LOCATION' | 'CONTACT',
        content:string,
        fileUrl?: string,
        location?:{
            lat: number,
            lon: number
        },
        contact?:{
            name: string,
            phone: string
        }

    }
}
