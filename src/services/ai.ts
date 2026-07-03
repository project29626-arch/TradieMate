import type { VoiceNoteAnalysis, QuoteLineItem } from "./schemas";

/**
 * Invokes the Gemini API or falls back to a smart mock generator to analyze unstructured tradie notes.
 * This runs client-side for ease of setup, utilizing VITE_GEMINI_API_KEY from .env.local.
 * 
 * @param noteText Unstructured text or transcription of a voice note from a site.
 * @param businessProfile Optional profile of the tradie's business for context.
 * @returns Structured analysis conforming to the VoiceNoteAnalysis interface.
 */
export async function processVoiceNote(
  noteText: string,
  businessProfile?: any
): Promise<VoiceNoteAnalysis> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== "" && apiKey !== "YOUR_GEMINI_API_KEY_HERE") {
    try {
      const callOutFee = businessProfile?.defaultCallOutFee ? Number(businessProfile.defaultCallOutFee) : 95;
      const labourRate = businessProfile?.defaultLabourRate ? Number(businessProfile.defaultLabourRate) : 120;
      const gstRegistered = businessProfile?.gstRegistered || false;
      const tradeType = businessProfile?.tradeType || 'General Trade';
      const businessName = businessProfile?.name || businessProfile?.businessName || 'TradieMate User';

      const prompt = `You are TradieMate AI, an intelligent administrative assistant for Australian tradespeople (tradies).
Your job is to analyze the unstructured site notes or transcribed voice notes from a tradie.

Context of the tradie's business:
- Business Name: ${businessName}
- Trade Type: ${tradeType}
- Default Labour Rate: $${labourRate} / hour
- Default Call-out Fee: $${callOutFee}
- GST Registered: ${gstRegistered ? 'Yes (Always add 10% GST to calculations in the final quote)' : 'No (GST is 0%)'}

Analyze the note text, extract key details, draft professional client communications (SMS/email in a friendly, helpful Australian tradie tone), create follow-up task lists, and compile a draft quote with line items (materials and labor) if pricing or materials or hours are mentioned.
Use the default rates provided above for pricing if specific rates are not mentioned in the notes.
Identify any missing crucial details needed to complete the quote.

Important Guidelines:
1. **Australian Slang & Terminology:** Be aware of local trade vocabulary: 'dunny' is toilet, 'sparky' is electrician, 'chippy' is carpenter, 'GPO' is double power point, 'RCD' is safety switch, 'ute' is utility truck. If the notes say Reece or Bunnings, they are suppliers.
2. **Tone of Voice:** Keep the message drafts (SMS/Email) in a friendly, helpful, straight-talk Aussie tradie tone. Start with "G'day [Client Name]" and close with "Cheers, [Tradie Name/Business Name]". Make it professional yet conversational.
3. **Strict Australian Spelling:** Strictly use Australian spelling across all text and quote descriptions: e.g. "Labour" (not "Labor"), "Colour" (not "Color"), "Organise" (not "Organize"), "Licence" (not "License" as noun).
4. **GST Math:** If GST Registered is Yes, then the quote totalAmount must include the 10% GST. Ensure you calculate this correctly.

Here is a reference example of a high-quality analysis:
For site notes: "Went to Peter's place in Richmond. Checked out the leaking dunny. Needs a new inlet valve. Spent about 2 hours fixing it. Used a standard Caroma inlet valve from Reece."
The output should look like this:
{
  "clientName": "Peter",
  "jobSummary": "Toilet Leak Repair at Richmond",
  "missingInformation": ["Peter's last name", "Peter's phone number", "Site street address"],
  "quoteDraft": {
    "lineItems": [
      {
        "description": "Plumbing Service Call-out Fee",
        "quantity": 1,
        "unitPrice": 95.00,
        "totalPrice": 95.00
      },
      {
        "description": "Caroma Toilet Inlet Valve",
        "quantity": 1,
        "unitPrice": 45.00,
        "totalPrice": 45.00
      },
      {
        "description": "Plumbing Labour (Toilet repair & testing)",
        "quantity": 2,
        "unitPrice": 120.00,
        "totalPrice": 240.00
      }
    ],
    "totalAmount": 418.00
  },
  "tasks": [
    {
      "title": "Procure Caroma inlet valve from Reece",
      "assignee": "tradie"
    },
    {
      "title": "Repair toilet inlet valve and test for leaks",
      "assignee": "tradie"
    }
  ],
  "draftMessages": [
    {
      "channel": "sms",
      "recipient": "Peter",
      "body": "G'day Peter, just drafted up the quote for the toilet leak repair in Richmond. Total is $418.00 (inc. GST). I've got the Caroma valve sorted. Let me know if you'd like us to go ahead. Cheers, [Tradie Name]"
    },
    {
      "channel": "email",
      "recipient": "Peter",
      "subject": "Quote for Toilet Repair - Richmond",
      "body": "G'day Peter,\n\nThanks for getting in touch with us. Here is the quote for repairing the leaking toilet at your property in Richmond. We will supply and install a new Caroma inlet valve and test the system. The total cost is $418.00 (inc. GST). Please review the details and let us know if you'd like to proceed.\n\nCheers,\n[Tradie Name]\n[Business Name]"
    }
  ]
}

Voice note text:
"""
${noteText}
"""`;

      // Call the Gemini REST API with structured JSON output configurations
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                clientName: { type: "STRING", description: "Name of the client if mentioned." },
                jobSummary: { type: "STRING", description: "A concise summary of the job description and work done or planned." },
                quoteDraft: {
                  type: "OBJECT",
                  properties: {
                    lineItems: {
                      type: "ARRAY",
                      items: {
                        type: "OBJECT",
                        properties: {
                          description: { type: "STRING", description: "Description of the material or labor item. Australian spelling." },
                          quantity: { type: "NUMBER", description: "Quantity of the item." },
                          unitPrice: { type: "NUMBER", description: "Unit price of the item in AUD." },
                          totalPrice: { type: "NUMBER", description: "Total price of the line item (quantity * unitPrice) in AUD." }
                        },
                        required: ["description", "quantity", "unitPrice", "totalPrice"]
                      },
                      description: "List of labor and material line items."
                    },
                    totalAmount: { type: "NUMBER", description: "Total sum of all line items in AUD." }
                  },
                  required: ["lineItems", "totalAmount"]
                },
                tasks: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING", description: "Title of the task." },
                      dueDate: { type: "STRING", description: "Optional ISO date or relative description when the task is due." },
                      assignee: { type: "STRING", description: "Assignee of the task (e.g. 'tradie', 'app')." }
                    },
                    required: ["title"]
                  },
                  description: "List of follow-up tasks extracted from the notes."
                },
                draftMessages: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      channel: { type: "STRING", enum: ["sms", "email"], description: "The channel to send the message through." },
                      recipient: { type: "STRING", description: "Recipient name, phone number, or email address." },
                      subject: { type: "STRING", description: "Subject of the message, required for emails." },
                      body: { type: "STRING", description: "The drafted message body, keeping a friendly, professional Australian tradie tone." }
                    },
                    required: ["channel", "recipient", "body"]
                  },
                  description: "Drafted SMS/email templates to send to the client."
                },
                missingInformation: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "List of details missing that are required to complete the quote/job (e.g. missing price, missing email, missing materials dimensions)."
                }
              },
              required: ["jobSummary", "tasks", "draftMessages", "missingInformation"]
            }
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error("Empty response received from Gemini API.");
      }

      // Parse the JSON returned by Gemini
      const analysis: VoiceNoteAnalysis = JSON.parse(textResponse);
      return analysis;

    } catch (error) {
      console.error("Error calling Gemini API directly. Falling back to Smart Mock...", error);
      // Fallback if API fails
    }
  }

  // Smart Mock Generator (Fallback when API Key is missing or request fails)
  console.log("Using Smart Mock Generator for note analysis...");
  return runSmartMockGenerator(noteText, businessProfile);
}

/**
 * Parses unstructured notes and creates a realistic JSON structure conforming to VoiceNoteAnalysis.
 */
function runSmartMockGenerator(noteText: string, businessProfile?: any): VoiceNoteAnalysis {
  const text = noteText.trim();
  const lowerText = text.toLowerCase();
  
  // 1. Try to extract client name
  let clientName = "";
  // Check typical sentence structures like "John at...", "Call Mike...", "Quote for Sarah..."
  const nameMatch = text.match(/(?:for|to|call|client|customer|at)\s+([A-Z][a-zA-Z]+)/);
  if (nameMatch && nameMatch[1]) {
    clientName = nameMatch[1];
  } else {
    // Fallback names
    const commonNames = ["John", "David", "Sarah", "Alex", "Steve", "Mike", "Peter", "Chris", "Emma", "Paul"];
    for (const name of commonNames) {
      if (lowerText.includes(name.toLowerCase())) {
        clientName = name;
        break;
      }
    }
  }

  // 2. Formulate Job Summary
  let jobSummary = "Site work inspection and quote preparation.";
  if (text.length > 5 && text.length < 100) {
    jobSummary = text;
  } else if (text.length >= 100) {
    jobSummary = text.substring(0, 97) + "...";
  }

  // 3. Draft Line Items
  const callOutFee = businessProfile?.defaultCallOutFee ? Number(businessProfile.defaultCallOutFee) : 95;
  const labourRate = businessProfile?.defaultLabourRate ? Number(businessProfile.defaultLabourRate) : 120;

  // Estimate hours
  let hours = 2; // Default
  const hourMatch = lowerText.match(/(\d+)\s*(?:hour|hr|hrs)/);
  if (hourMatch && hourMatch[1]) {
    hours = Number(hourMatch[1]);
  } else if (lowerText.includes("half day")) {
    hours = 4;
  } else if (lowerText.includes("full day")) {
    hours = 8;
  }

  // Estimate materials
  let materialName = "Materials and Consumables";
  let materialCost = 150;
  if (lowerText.includes("leak") || lowerText.includes("pipe") || lowerText.includes("tap")) {
    materialName = "Plumbing Materials (Pipes, Seals, Copper Fittings)";
    materialCost = 135;
  } else if (lowerText.includes("light") || lowerText.includes("wire") || lowerText.includes("switch") || lowerText.includes("downlight")) {
    materialName = "Electrical Materials (LED Downlights, Cable, Junction Boxes)";
    materialCost = 180;
  } else if (lowerText.includes("door") || lowerText.includes("lock") || lowerText.includes("timber")) {
    materialName = "Timber & Hardware Supplies";
    materialCost = 210;
  }

  const lineItems: QuoteLineItem[] = [
    {
      description: "Standard Service Call-out Fee",
      quantity: 1,
      unitPrice: callOutFee,
      totalPrice: callOutFee
    },
    {
      description: `Trade Labour (Labour Rate - Est. ${hours} hrs)`,
      quantity: hours,
      unitPrice: labourRate,
      totalPrice: labourRate * hours
    },
    {
      description: materialName,
      quantity: 1,
      unitPrice: materialCost,
      totalPrice: materialCost
    }
  ];

  const totalAmount = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // 4. Generate Tasks
  const tasks = [
    {
      title: `Procure materials: ${materialName}`,
      assignee: "tradie",
      completed: false
    },
    {
      title: `Send drafted quote to ${clientName || 'client'} for approval`,
      assignee: "app",
      completed: false
    },
    {
      title: "Schedule job date on calendar upon client deposit",
      assignee: "tradie",
      completed: false
    }
  ];

  // 5. Generate Draft Messages
  const tradieName = businessProfile?.name || businessProfile?.businessName || "your local tradie";
  const smsBody = `Hi ${clientName || 'there'}, this is ${tradieName}. Just drafted the quote for the work we discussed: ${jobSummary.toLowerCase()}. Total is $${totalAmount.toFixed(2)} (inc. GST if applicable). Will email the full PDF. Let me know if you want to lock it in! Cheers.`;
  
  const emailBody = `Hi ${clientName || 'Customer'},

Thanks for getting in touch with us at ${tradieName}.

We have put together a quote for the following work:
- ${jobSummary}

Pricing breakdown:
- Service Call-out Fee: $${callOutFee.toFixed(2)}
- Labour: ${hours} hours @ $${labourRate.toFixed(2)}/hr
- Materials: ${materialName} - $${materialCost.toFixed(2)}

Total Quote Amount: $${totalAmount.toFixed(2)} (AUD)

Please review the details and let us know if you have any questions or are happy to proceed with booking the job.

Best regards,
${tradieName}`;

  const draftMessages = [
    {
      channel: 'sms' as const,
      recipient: clientName || "Client",
      body: smsBody
    },
    {
      channel: 'email' as const,
      recipient: clientName || "Client",
      subject: `Quote from ${tradieName} for ${jobSummary.substring(0, 30)}`,
      body: emailBody
    }
  ];

  // 6. Generate Missing Information Warnings
  const missingInformation: string[] = [];
  if (!clientName) {
    missingInformation.push("Client name was not explicitly identified in the notes.");
  }
  if (!lowerText.includes("phone") && !lowerText.includes("contact")) {
    missingInformation.push("Client contact number is missing.");
  }
  if (!lowerText.includes("email") && !lowerText.includes("@")) {
    missingInformation.push("Client email address is missing.");
  }
  if (!lowerText.includes("street") && !lowerText.includes("road") && !lowerText.includes("st") && !lowerText.includes("rd")) {
    missingInformation.push("Job site address is missing or incomplete.");
  }

  return {
    clientName: clientName || undefined,
    jobSummary,
    quoteDraft: {
      lineItems,
      totalAmount
    },
    tasks,
    draftMessages,
    missingInformation
  };
}
