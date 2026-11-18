
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export default {
    async fetch(request) {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "https://mohammedaazimzain-max.github.io",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        if (request.method !== "POST") {
            return Response.json(
                { error: "Method not allowed" },
                { status: 405, headers: corsHeaders }
            );
        }
 
        if (!process.env.GEMINI_API_KEY) {
            return Response.json(
                { error: "Gemini API key is not configured." },
                { status: 500, headers: corsHeaders }
            );
        }
        let stage = "Reading request body";
        try {
            const requestData = await request.json();
            const { job, skills } = requestData;

            if (!job || !skills) {
                return Response.json(
                    { error: "Please provide both job and skills." },
                    { status: 400, headers: corsHeaders }
                );
            }
            stage = "Calling Gemini API";
            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: `
                    Compare the candidate's skills with the job requirements.

                    Job information:
                    ${JSON.stringify(job)}

                    Candidate skills:
                    ${JSON.stringify(skills)}

                    Explain:
                    1. Which skills match.
                    2. Which skills are missing.
                    3. How the candidate could improve.

                    Keep the explanation clear, practical, and concise.
                `
            });

            return Response.json(
                { explanation: response.text },
                { headers: corsHeaders }
            );

        } catch (error) {
            console.error(`Gemini API error during: ${stage}`, error);

            return Response.json(
                { error: "Unable to generate the AI explanation." },
                { status: 500, headers: corsHeaders }
            );
        }
    }
};
