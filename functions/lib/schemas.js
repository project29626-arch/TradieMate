"use strict";
// Structured Output Schema definitions for Gemini API using the @google/genai SDK format
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceNoteAnalysisSchema = exports.DraftMessageSchema = exports.TaskItemSchema = exports.QuoteDraftSchema = exports.QuoteLineItemSchema = void 0;
// 2. Gemini-compatible Schema definitions matching the @google/genai type specs
exports.QuoteLineItemSchema = {
    type: 'OBJECT',
    properties: {
        description: { type: 'STRING', description: 'Description of the material or labor item.' },
        quantity: { type: 'NUMBER', description: 'Quantity of the item.' },
        unitPrice: { type: 'NUMBER', description: 'Unit price of the item in AUD.' },
        totalPrice: { type: 'NUMBER', description: 'Total price of the line item (quantity * unitPrice) in AUD.' }
    },
    required: ['description', 'quantity', 'unitPrice', 'totalPrice']
};
exports.QuoteDraftSchema = {
    type: 'OBJECT',
    properties: {
        lineItems: {
            type: 'ARRAY',
            items: exports.QuoteLineItemSchema,
            description: 'List of labor and material line items.'
        },
        totalAmount: { type: 'NUMBER', description: 'Total sum of all line items in AUD.' }
    },
    required: ['lineItems', 'totalAmount']
};
exports.TaskItemSchema = {
    type: 'OBJECT',
    properties: {
        title: { type: 'STRING', description: 'Title of the task.' },
        dueDate: { type: 'STRING', description: 'Optional ISO date or relative description when the task is due.' },
        assignee: { type: 'STRING', description: 'Assignee of the task (e.g. "tradie", "app").' }
    },
    required: ['title']
};
exports.DraftMessageSchema = {
    type: 'OBJECT',
    properties: {
        channel: { type: 'STRING', enum: ['sms', 'email'], description: 'The channel to send the message through.' },
        recipient: { type: 'STRING', description: 'Recipient name, phone number, or email address.' },
        subject: { type: 'STRING', description: 'Subject of the message, required for emails.' },
        body: { type: 'STRING', description: 'The drafted message body, keeping a friendly, professional Australian tradie tone.' }
    },
    required: ['channel', 'recipient', 'body']
};
exports.VoiceNoteAnalysisSchema = {
    type: 'OBJECT',
    properties: {
        clientName: { type: 'STRING', description: 'Name of the client if mentioned.' },
        jobSummary: { type: 'STRING', description: 'A concise summary of the job description and work done or planned.' },
        quoteDraft: exports.QuoteDraftSchema,
        tasks: {
            type: 'ARRAY',
            items: exports.TaskItemSchema,
            description: 'List of follow-up tasks extracted from the notes.'
        },
        draftMessages: {
            type: 'ARRAY',
            items: exports.DraftMessageSchema,
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
//# sourceMappingURL=schemas.js.map