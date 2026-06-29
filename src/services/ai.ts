import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase/config";
import type { VoiceNoteAnalysis } from "../../functions/src/schemas";

// Initialize Firebase Functions instance
const functions = getFunctions(app);

/**
 * Invokes the processVoiceNote Firebase Cloud Function to analyze unstructured tradie notes.
 * This runs securely on the backend, authenticated via Firebase Auth automatically.
 * 
 * @param noteText Unstructured text or transcription of a voice note from a site.
 * @returns Structured analysis conforming to the VoiceNoteAnalysis interface.
 */
export async function processVoiceNote(noteText: string): Promise<VoiceNoteAnalysis> {
  const analyzeCallable = httpsCallable<{ noteText: string }, VoiceNoteAnalysis>(
    functions,
    "processVoiceNote"
  );

  try {
    const response = await analyzeCallable({ noteText });
    return response.data;
  } catch (error) {
    console.error("Error invoking processVoiceNote cloud function:", error);
    throw error;
  }
}
