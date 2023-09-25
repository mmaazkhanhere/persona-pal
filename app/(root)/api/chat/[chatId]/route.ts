import { MemoryManager } from "@/lib/memory";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { LangChainStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { Replicate } from "langchain/llms/replicate"
import { CallbackManager } from "langchain/callbacks"

export const POST = async (request: NextRequest, { params }: { params: { chatId: string } }) => {
    try {

        const prompt = await request.json(); //the data we are recieving is actually a prompt
        const user = await currentUser();

        if (!user) {
            //if no authorised exists, return unauthorised response
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const pal = await prismadb.pal.update({
            where: {
                id: params.chatId
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id
                    }
                }
            }
        });

        if (!pal) {
            return new NextResponse("Pal not found", { status: 404 });
        };

        const name = pal.id;
        const pal_file_name = name + ".txt";

        const palKey = {
            palName: name!,
            userId: user.id,
            modelName: "llama2-13b"
        }

        const memoryManager = await MemoryManager.getInstance();

        const records = await memoryManager.readLatestHistory(palKey);

        if (records.length === 0) {
            await memoryManager.seedChatHistory(pal.seed, "\n\n", palKey);
        }

        await memoryManager.writeToHistory("User: " + prompt + "\n", palKey);

        const recentChatHistory = await memoryManager.readLatestHistory(palKey);

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            pal_file_name
        )

        let relevantHistory = "";
        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }

        const { handlers } = LangChainStream();

        const model = new Replicate({
            model:
                "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        model.verbose = true;

        const resp = String(
            await model
                .call(
                    `
            ONLY generate simple sentences without prefix of who is speaking. DO NOT use ${pal.name}: prefix. 

            ${pal.instructions}

            Below are relevant details about ${pal.name}'s past and the conversation you are in.
            ${relevantHistory}


            ${recentChatHistory}\n${pal.name}:`
                )
                .catch(console.error)
        );

        const cleaned = resp.replaceAll(",", "");
        const chunks = cleaned.split("\n");
        const response = chunks[0];

        await memoryManager.writeToHistory("" + response.trim(), palKey);

        var Readable = require("stream").Readable;

        let s = new Readable;
        s.push(response);
        s.push(null);

        if (response !== undefined && response.length > 1) {
            memoryManager.writeToHistory("" + response.trim(), palKey);

            await prismadb.pal.update({
                where: {
                    id: params.chatId
                },
                data: {
                    messages: {
                        create: {
                            content: response.trim(),
                            role: "pal",
                            userId: user.id
                        }
                    }
                }
            });
        }

        return new StreamingTextResponse(s);

    } catch (error) {
        console.log("[CHAT_POST_ERROR]", error);
    }
}