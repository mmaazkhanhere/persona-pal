import { Redis } from "@upstash/redis"
import { PineconeClient } from "@pinecone-database/pinecone"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { delimiter } from "path"

export type PalKey = {
    palName: string,
    modelName: string,
    userId: string
}

export class MemoryManager {

    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: PineconeClient;

    public constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = new PineconeClient();
    }

    public async init() {
        //initialise the Pinecone client with necessary API keys and environment information
        if (this.vectorDBClient instanceof PineconeClient) {
            await this.vectorDBClient.init({
                apiKey: process.env.PINECONE_API_KEY!,
                environment: process.env.PINECONE_ENVIRONMENT!,
            });
        }
    }

    public async vectorSearch(recentChatHistory: string, companionFileName: string) {
        //this function uses pinecone to perform a similarity search based on provided chat history and companion file name

        const pineconeClient = <PineconeClient>this.vectorDBClient;

        const pineconeIndex = pineconeClient.Index(
            //obtain pinecone index by calling the .Index method on the pinecone client
            process.env.PINECONE_INDEX! || ""
        );

        const vectorStore = await PineconeStore.fromExistingIndex(
            //creates vector store and takes two parameters
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }), // instance of OpenAIEmbeddings which is used for obtaining vector embeddings
            { pineconeIndex } //object containing pinecone index
        );

        const similarDocs = await vectorStore.similaritySearch(recentChatHistory, 2, { fileName: companionFileName })
            //This code performs similitarity search using the vector store we created above and takes three parameters
            //1- recentChatHistory which is the text for which similarit is being searched
            //2- Number of similar documents to recieve which here is 2
            //3- addtional options
            .catch((err) => {
                console.log("Failed to get searcg vector search result: ", err)
            })

        return similarDocs;
    }

    public static async getInstance(): Promise<MemoryManager> {

        if (!MemoryManager.instance) {
            //checks if the MemoryManager class has already created an instance, if not then create new one
            MemoryManager.instance = new MemoryManager();
            await MemoryManager.instance.init();
            /*after creating the instance, the code awaits the initialisation of the MemoryManager instance 
            by calling its init mehtod*/
        }
        return MemoryManager.instance;
    }

    private generateRedisCompanionKey(palKey: PalKey): string {
        return `${palKey.palName}-${palKey.modelName}-${palKey.userId}`;
    }

    public async writeToHistory(text: string, palKey: PalKey) {
        /*This function is responsible for adding a piece of text with a timestamp to a Redis sorted
        set */

        if (!palKey || typeof palKey.palName == "undefined") {
            console.log("Pal key is set incorrectly")

            return "";
        }

        const key = this.generateRedisCompanionKey(palKey);

        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        });

        return result;
    }

    public async readLatestHistory(palKey: PalKey): Promise<string> {
        if (!palKey) {
            console.log("Key is set incorrectly");
            return "";
        }

        const key = this.generateRedisCompanionKey(palKey);
        //generate a redis key for the user;s chat history for calling the private

        let result = await this.history.zrange(key, 0, Date.now(), {
            //async retrieves chat history from the Redis database using the zrange method
            byScore: true
        });

        result = result.slice(-30).reverse();
        const recentChats = result.reverse().join("\n");
        return recentChats;
    }

    public async seedChatHistory(
        /*, the seedChatHistory method allows you to seed the chat history for a specific companion with initial content. 
        It checks if the history already exists, splits the provided content into individual messages, assigns timestamps 
        to each message, and adds them to the Redis database as a sorted set.  */
        seedContent: String,
        delimiter: string = "\n",
        palKey: PalKey
    ) {
        const key = this.generateRedisCompanionKey(palKey);
        //generate a redis key based on the companion key that is used to identify the companions chat history
        if (await this.history.exists(key)) {
            //checks if the chat history for the companion already exist. If so it logs a message
            console.log("User already has chat history");
            return;
        }

        const content = seedContent.split(delimiter);
        /*splits the seed content string into array of individual lines using the specified 
        limiter which by default is a new line character (\n)*/
        let counter = 0;

        for (const line of content) {
            //iterates over each line message in the content array
            await this.history.zadd(key, { score: counter, member: line });
            //uses the zadd method to add each chat message to the sorted set identified by key
            counter += 1;
        }
    }

}