// Structured Output Schema definitions for Gemini API using the @google/genai SDK format

// 1. TypeScript interfaces representing the output structure for compile-time safety
export interface QuoteLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface QuoteDraft {
  lineItems: QuoteLineItem[];
  totalAmount: number;
}

export interface TaskItem {
  title: string;
  dueDate?: string;
  assignee?: string;
}

export interface DraftMessage {
  channel: 'sms' | 'email';
  recipient: string;
  subject?: string;
  body: string;
}

export interface VoiceNoteAnalysis {
  clientName?: string;
  jobSummary: string;
  quoteDraft?: QuoteDraft;
  tasks: TaskItem[];
  draftMessages: DraftMessage[];
  missingInformation: string[];
}

// 2. Gemini-compatible Schema definitions matching the @google/genai type specs
export const QuoteLineItemSchema = {
  type: 'OBJECT',
  properties: {
    description: { type: 'STRING', description: 'Description of the material or labor item.' },
    quantity: { type: 'NUMBER', description: 'Quantity of the item.' },
    unitPrice: { type: 'NUMBER', description: 'Unit price of the item in AUD.' },
    totalPrice: { type: 'NUMBER', description: 'Total price of the line item (quantity * unitPrice) in AUD.' }
  },
  required: ['description', 'quantity', 'unitPrice', 'totalPrice']
};

export const QuoteDraftSchema = {
  type: 'OBJECT',
  properties: {
    lineItems: {
      type: 'ARRAY',
      items: QuoteLineItemSchema,
      description: 'List of labor and material line items.'
    },
    totalAmount: { type: 'NUMBER', description: 'Total sum of all line items in AUD.' }
  },
  required: ['lineItems', 'totalAmount']
};

export const TaskItemSchema = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING', description: 'Title of the task.' },
    dueDate: { type: 'STRING', description: 'Optional ISO date or relative description when the task is due.' },
    assignee: { type: 'STRING', description: 'Assignee of the task (e.g. "tradie", "app").' }
  },
  required: ['title']
};

export const DraftMessageSchema = {
  type: 'OBJECT',
  properties: {
    channel: { type: 'STRING', enum: ['sms', 'email'], description: 'The channel to send the message through.' },
    recipient: { type: 'STRING', description: 'Recipient name, phone number, or email address.' },
    subject: { type: 'STRING', description: 'Subject of the message, required for emails.' },
    body: { type: 'STRING', description: 'The drafted message body, keeping a friendly, professional Australian tradie tone.' }
  },
  required: ['channel', 'recipient', 'body']
};

export const VoiceNoteAnalysisSchema = {
  type: 'OBJECT',
  properties: {
    clientName: { type: 'STRING', description: 'Name of the client if mentioned.' },
    jobSummary: { type: 'STRING', description: 'A concise summary of the job description and work done or planned.' },
    quoteDraft: QuoteDraftSchema,
    tasks: {
      type: 'ARRAY',
      items: TaskItemSchema,
      description: 'List of follow-up tasks extracted from the notes.'
    },
    draftMessages: {
      type: 'ARRAY',
      items: DraftMessageSchema,
      description: 'Drafted SMS/email templates to send to the client.'
    },
    missingInformation: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'List of details missing that are required to complete the quote/job (e.g. missing price, missing email, missing materials dimensions).'
    }
  },
  required: ['jobSummary', 'tasks', 'draftMessages', 'missingInformation']
};
