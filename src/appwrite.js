import {Client , Databases , ID, Query} from "appwrite"

const client = new Client()

client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)


const databases = new Databases(client)

async function saveToLeaderboard(name , wpm){
    try {
        const response = await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            ID.unique(),
            {"name" : name , "wpm": wpm}
        )
        return response
        
    } catch (error) {
        return error
        
    }
}

async function getLeaderboard(){
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            [
                Query.limit(50)
            ]
        )
        return response
        // console.log(response);
        
    } catch (error) {
        console.log(error);
        return error
    }
}


export {saveToLeaderboard , getLeaderboard}