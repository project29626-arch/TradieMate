"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVoiceNote = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const genai_1 = require("@google/genai");
const schemas_1 = require("./schemas");
/**
 * Firebase Cloud Function to process and analyze voice notes or text notes from tradies.
 * It uses the Google Gemini API (gemini-2.5-flash) with structured JSON outputs.
 */
exports.processVoiceNote = (0, https_1.onCall)({
    secrets: ["GEMINI_API_KEY"],
    cors: true
}, async (request) => {
    // 1. Ensure the user is authenticated via Firebase Auth
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    // 2. Validate input arguments
    const { noteText } = request.data;
    if (!noteText || typeof noteText !== "string") {
        throw new https_1.HttpsError("invalid-argument", "The function must be called with a 'noteText' string.");
    }
    // 3. Verify Gemini API Key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        logger.error("GEMINI_API_KEY environment variable is not set.");
        throw new https_1.HttpsError("failed-precondition", "The Gemini API key is not configured on the server.");
    }
    try {
        // 4. Initialize the Google Gen AI SDK
        const ai = new genai_1.GoogleGenAI({ apiKey });
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
                responseSchema: schemas_1.VoiceNoteAnalysisSchema,
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
    }
    catch (error) {
        logger.error("Error calling Gemini API:", error);
        throw new https_1.HttpsError("internal", error.message || "An error occurred while processing the voice note with AI.");
    }
});
//# sourceMappingURL=index.js.map