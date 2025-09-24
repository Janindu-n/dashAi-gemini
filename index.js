require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');



const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Initialize Gemini AI (using same model as dash-app)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Initialize Firebase Admin SDK
// This connects to the same Firebase project as the dash-app to ensure
// tickets from both sources end up in the same database
const serviceAccount = require('./dash-24e87-firebase-adminsdk-fbsvc-f43b3eddc8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
});
const db = admin.firestore();

// Conversation sessions
const sessions = new Map();

// System prompt
const SYSTEM_PROMPT = `You are a "DashAI Support Bot", a friendly customer-service AI.

Goal:
0. Greet/Introduce yourself as "I am DashAI by Janindu, helping you have a better experience with your product".
1. Ask up to 5 concise and simple questions to fully understand the customer's issue. You are a general person, not a specialist and customers will be using various products, so make sure to confirm the prouct name
2. After the 5th answer, summarize the issue clearly.
3. Do NOT provide solutions. Do NOT exceed 5 questions.
Only ask one question at a time and wait for the user's reply.

Start by greeting the customer and asking your first diagnostic question.`;

// Webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  return (mode === 'subscribe' && token === VERIFY_TOKEN)
    ? res.status(200).send(challenge)
    : res.sendStatus(403);
});

// Webhook events
app.post('/webhook', async (req, res) => {
  if (req.body.object !== 'page') return res.sendStatus(404);
  
  req.body.entry.forEach(({ messaging })
    =>
    messaging.forEach(event => onMessage(event))
  );
  res.sendStatus(200);
});

async function onMessage(event) {
  if (!event.message || !event.message.text) return;
  
  const psid = event.sender.id;
  const userText = event.message.text.trim();
  console.log(`📩 From ${psid}: "${userText}"`);

  let session = sessions.get(psid);
  
  if (!session) {
    // New conversation - start with system prompt
    session = {
      history: [],
      qcount: 0
    };
    sessions.set(psid, session);
    
    // Start conversation with system prompt
    await sendGeminiQuestion(psid, session, SYSTEM_PROMPT);
    return;
  }

  // Add user message to history
  session.history.push({
    role: 'user',
    parts: [{ text: userText }]
  });
  
  session.qcount += 1;

  // Check if we've reached 5 questions
  if (session.qcount >= 5) {
    await handleTicketCreation(psid, session);
    sessions.delete(psid);
  } else {
    await sendGeminiQuestion(psid, session);
  }
}

async function sendGeminiQuestion(psid, session, systemPrompt = null) {
  try {
    let response;
    
    if (systemPrompt) {
      // First message with system prompt - don't use chat history
      response = await model.generateContent(systemPrompt);
      const botReply = response.response.text().trim();
      
      // Don't add first bot message to history - let user message be first
      await fbSend(psid, botReply);
    } else {
      // Continue chat with history (user message is already added)
      const chat = model.startChat({
        history: session.history
      });
      response = await chat.sendMessage("Ask your next diagnostic question to understand the customer's issue better.");
      const botReply = response.response.text().trim();
      
      // Add bot response to history
      session.history.push({
        role: 'model',
        parts: [{ text: botReply }]
      });
      
      await fbSend(psid, botReply);
    }
    
  } catch (error) {
    console.error('Gemini API error here:', error);
    await fbSend(psid, "I'm having trouble processing your request. Let me connect you with a human agent.");
  }
}

async function handleTicketCreation(psid, session) {
  try {
    // Get issue summary from conversation
    const conversationText = session.history
      .map(msg => `${msg.role}: ${msg.parts[0].text}`)
      .join('\n');
    
    const summaryResult = await model.generateContent(
      `Based on this customer service conversation, provide a concise summary of the customer's issue:\n\n${conversationText}`
    );
    const issue = summaryResult.response.text().trim();
    
    console.log(`📝 Issue summary for ${psid}: ${issue}`);

    // Use Gemini to classify the issue to one of the roles (matching dash-app logic exactly)
    const prompt = `Classify the following customer service issue into one of these categories: "Developer", "Customer Service", or "Finance". If none apply, use "General". Only return the category name.
    Issue: ${issue}`;
    
    const result = await model.generateContent(prompt);
    console.log('Classification result:', result.response.text());
    const category = result.response.text().trim();
    
    console.log(`🏷️  Category: ${category}`);

    // Create Firestore ticket with exact same schema as dash-app/app/api/create-ticket/route.ts
    // This ensures tickets from both messenger bot and web app have identical structure
    const ticketRef = await db.collection('tickets').add({
      issue,
      category,
      assignedToRole: category,
      status: 'new',
      assignedTo: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`✅ Ticket ${ticketRef.id} created in Firestore`);

    // Notify customer
    await fbSend(
      psid,
      `Thank you! I've created Ticket #${ticketRef.id} for your ${category} issue. A specialist will contact you shortly.`
    );
    
  } catch (error) {
    console.error('Ticket creation error:', error);
    await fbSend(psid, "I've logged your request and someone will contact you soon!");
  }
}

async function fbSend(psid, text) {
  try {
    const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    await axios.post(url, {
      recipient: { id: psid },
      message: { text }
    });
    console.log(`✉️  Sent to ${psid}: "${text}"`);
  } catch (error) {
    console.error('Facebook send error ->', error);
  }
}

app.listen(PORT, () =>
  console.log(`🚀 Bot running on http://localhost:${PORT}`)
);
