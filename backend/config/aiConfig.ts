import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY as string;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });