import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenAI } from "@google/genai";
import { VoiceNoteAnalysisSchema } from "./schemas";

/**
 * Firebase Cloud Function to process and analyze voice notes or text notes from tradies.
 * It uses the Google Gemini API (gemini-2.5-flash) with structured JSON outputs.
 */
export const processVoiceNote = onCall({
  secrets: ["GEMINI_API_KEY"],
  cors: true
}, async (request) => {
  // 1. Ensure the user is authenticated via Firebase Auth
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // 2. Validate input arguments
  const { noteText } = request.data;
  if (!noteText || typeof noteText !== "string") {
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with a 'noteText' string."
    );
  }

  // 3. Verify Gemini API Key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error("GEMINI_API_KEY environment variable is not set.");
    throw new HttpsError(
      "failed-precondition",
      "The Gemini API key is not configured on the server."
    );
  }

  try {
    // 4. Initialize the Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    // 5. Construct the prompt with specialized tradie rules
    const prompt = `You are TradieMate AI, an intelligent administrative assistant for Australian tradespeople (tradies).
Your job is to analyze the following unstructured site notes or transcribed voice notes from a tradie. 
Extract key details, draft professional client communications (SMS/email in a friendly, helpful Australian tradie tone), create follow-up task lists, and compile a draft quote with line items (materials and labor) if pricing or materials are mentioned.
Identify any missing crucial details needed to complete the quote.

Voice note text:
"""
${noteText}
"""`;

    logger.info("Sending request to Gemini API using model gemini-2.5-flash...");
    
    // 6. Call the Gemini API requesting a structured JSON response matching our schema
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: VoiceNoteAnalysisSchema,
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text was returned from the Gemini API.");
    }

    // 7. Parse and return the structured JSON data
    const analysis = JSON.parse(resultText);
    logger.info("Successfully analyzed voice note with Gemini API.");
    return analysis;

  } catch (error: any) {
    logger.error("Error calling Gemini API:", error);
    throw new HttpsError(
      "internal",
      error.message || "An error occurred while processing the voice note with AI."
    );
  }
});
