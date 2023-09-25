/* this code is part of a chat application or conversational agent system that handles user inputs, 
interacts with a natural language processing model (Replicate), manages chat history, and sends 
responses in a streaming manner. It also includes security measures like user authentication and 
rate limiting. */

import dotenv from "dotenv";
import { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import prismadb from "@/lib/prismadb";

dotenv.config({ path: `.env` }); //dotenv library is used to load environment variables from .env

export async function POST(
    //takes two parameters
    request: Request, //incoming http request
    { params }: { params: { chatId: string } } //params containing route parameter (here chatId)
) {
    try {
        const { prompt } = await request.json();/*parse the JSON body of the incoming request to extract
        the prompt */
        const user = await currentUser(); //gets the detail about the user

        if (!user || !user.firstName || !user.id) {
            //checks for user authentication. If no user, 401 status response
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const identifier = request.url + "-" + user.id;//generate a unique identifier for rate limiting purposes


        //update the chat companion's message in database
        const companion = await prismadb.pal.update({
            where: {
                /*Condition that must be met to identify the record that is to be updated. In this case, it is 
                identifying the companion record with specific id value */
                id: params.chatId
            },
            data: {
                //defines the updates to be applied t the identified record
                messages: {
                    create: { //create new message
                        content: prompt, //prompt is the content
                        role: "user", //specifies the role of the sender
                        userId: user.id, //user id is set to the currently authenticated user
                    },
                },
            }
        });

        if (!companion) {
            //return a 404 status if companion doesnt exist
            return new NextResponse("Companion not found", { status: 404 });
        }

        //generate filesname and keys for managing the chat history
        const name = companion.id;
        const companion_file_name = name + ".txt";

        //define a companion key for chat history management
        const palKey = {
            palName: name!,
            userId: user.id,
            modelName: "llama2-13b",
        };
        //initialise a memory manager instance for managing chat history
        const memoryManager = await MemoryManager.getInstance();

        //read the latest chat history records
        const records = await memoryManager.readLatestHistory(palKey);

        //seet chat history if no records exist
        if (records.length === 0) {
            await memoryManager.seedChatHistory(companion.seed, "\n\n", palKey);
        }

        //write the user;s input to chat history
        await memoryManager.writeToHistory("User: " + prompt + "\n", palKey);

        // Query Pinecone for similarchat
        const recentChatHistory = await memoryManager.readLatestHistory(palKey);

        // Right now the preamble is included in the similarity search, but that
        // shouldn't be an issue

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            companion_file_name
        );

        //prepare relevant chat history for input to the language model
        let relevantHistory = "";
        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }

        //initialise langchain handlers
        const { handlers } = LangChainStream();

        // Call Replicate for inference
        const model = new Replicate({
            model:
                "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        // Turn verbose on for debugging
        model.verbose = true;

        //perfrom ingerence using the language model
        const resp = String(
            await model
                .call(
                    `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 

        ${companion.instructions}

        Below are relevant details about ${companion.name}'s past and the conversation you are in.
        ${relevantHistory}


        ${recentChatHistory}\n${companion.name}:`
                )
                .catch(console.error)
        );

        //clean and process the response
        const cleaned = resp.replaceAll(",", ""); /*Replaces all occurences of commas in the resp with an empty string
        effectively removing all commas from the text */
        const chunks = cleaned.split("\n"); /*Splits the cleaned string into an array of substrings using the newline character(\n)
        as demitter. Breaks text into multiple chunks wherever there is a newline character */
        const response = chunks[0]; /*assign the first element of the chunk to response variable */

        await memoryManager.writeToHistory("" + response.trim(), palKey);

        //creates a readable stream for the response
        var Readable = require("stream").Readable;

        let s = new Readable();
        s.push(response);
        s.push(null);

        //check if the response is not undefined and has a length greater than 1
        if (response !== undefined && response.length > 1) {
            //write response to chat history
            memoryManager.writeToHistory("" + response.trim(), palKey);

            //update the chat companion's message in the database
            await prismadb.pal.update({
                where: {
                    //specifies the condition that identifies the companion record to be updated
                    id: params.chatId
                },
                data: {
                    //an object that specifies the updates to be applied to the identified companion record
                    messages: {
                        create: {
                            content: response.trim(), //specifies the content that is derived from the response
                            role: "pal", //role of the sender
                            userId: user.id, //associates the message with a particular user
                        },
                    },
                }
            });
        }

        return new StreamingTextResponse(s);

    } catch (error) {
        console.log("[CHAT_POST ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};