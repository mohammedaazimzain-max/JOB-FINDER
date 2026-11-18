
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

        // Handle CORS preflight requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        // Allow only POST requests
        if (request.method !== "POST") {
            return Response.json(
                { error: "Method not allowed" },
                { status: 405, headers: corsHeaders }
            );
        }

        // Check API key
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

            // Validate incoming information
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
You are an expert job skills analyst.

Compare the candidate's skills with the job requirements.

JOB INFORMATION:
${JSON.stringify(job)}

CANDIDATE SKILLS:
${JSON.stringify(skills)}

Identify:

1. matchingSkills:
Skills the candidate already possesses that are relevant to the job.

2. missingSkills:
Skills required by the job that the candidate does not possess.

3. improvementAdvice:
Practical advice explaining how the candidate can develop the missing skills.

IMPORTANT RULES:
- Only include skills genuinely relevant to the job.
- Do not classify a skill as missing if the candidate already has it.
- Do not invent job requirements.
- Return valid JSON only.
- Do not include Markdown formatting or code fences.

Use exactly this JSON structure:

{
  "matchingSkills": ["React", "JavaScript"],
  "missingSkills": ["TypeScript", "Node.js"],
  "improvementAdvice": [
    {
      "skill": "TypeScript",
      "advice": "Learn TypeScript fundamentals and practise typing React components."
    },
    {
      "skill": "Node.js",
      "advice": "Learn server-side JavaScript and build a small REST API."
    }
  ]
}
                `
            });

            stage = "Parsing Gemini response";

            // Convert Gemini's JSON response into a JavaScript object
            const explanation = JSON.parse(response.text);

            // Send structured data to the frontend
            return Response.json(
                {
                    explanation: explanation
                },
                {
                    headers: corsHeaders
                }
            );

        } catch (error) {

            console.error(
                `Gemini API error during: ${stage}`,
                error
            );

            return Response.json(
                {
                    error: "Unable to generate the AI explanation."
                },
                {
                    status: 500,
                    headers: corsHeaders
                }
            );
        }
    }
};
