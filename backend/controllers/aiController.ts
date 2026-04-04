import { Request, Response } from "express";
import { aiModel } from "../config/aiConfig";

export const generateAdCopy = async (req: Request, res: Response) => {
    try {
        const { title, platform } = req.body;

        if (!title || !platform) {
            return res.status(400).json({ error: "Title and Platform are required" });
        }

        const prompt = `
      Write a catchy and engaging ad description for a marketing campaign.
      Campaign Title: ${title}
      Platform: ${platform}
      
      The description should be concise, professional, and optimized for the specific platform's audience. 
      Include 2-3 relevant hashtags. Don't include any placeholders or complex formatting.
    `;

        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();

        res.json({ description: generatedText });
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate AI content" });
    }
};