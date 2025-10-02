const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend port
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret:"rigveda",
  resave:false,
  saveUninitialized:true,
  cookie: {maxAge : 10 * 60 * 1000}, // 10 minutes
}));

// Import data
const mandala4Data = require('./data/mandala4.json');

// Helper function to calculate word frequency
function calculateWordFrequency(text) {
  const stopwords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'must', 'shall', 'can', 'a', 'an', 'as', 'if', 'when', 'where', 'who',
    'whom', 'whose', 'which', 'that', 'this', 'these', 'those', 'i', 'you',
    'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.has(word));

  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

// Helper function to find deity mentions
function findDeityMentions(sukta) {
  const deities = ['agni', 'indra', 'soma', 'vayu', 'surya', 'vishnu', 'rudra', 'maruts','ushas','varuna','mitra','brihaspati','tvastar','parjanya','yama','apam napat','ashvini'];
  const mentions = {};
  
  sukta.mantras.forEach(mantra => {
    const text = mantra.english_griffith.toLowerCase();
    // console.log('text:', text);
    
    deities.forEach(deity => {
      if (text.includes(deity)) {
        mentions[deity] = (mentions[deity] || 0) + 1;
      }
    });
  });

  return Object.entries(mentions)
    .map(([deity, count]) => ({ deity, count }));
}

// Routes
app.get('/api/mandala/4', (req, res) => {
  try {
    console.log("namaste");
    const suktasList = mandala4Data.suktas.map(sukta => ({
      sukta: sukta.sukta,
      deity_english: sukta.deity_english,
      deity_sanskrit: sukta.deity_sanskrit,
      rishi_english: sukta.rishi_english,
      rishi_sanskrit: sukta.rishi_sanskrit,
      mantraCount: sukta.mantras.length
    }));
    
    res.json({
      mandala: 4,
      suktas: suktasList
    });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
});

app.get('/api/mandala/4/sukta/:id', (req, res) => {
  try {
    const suktaId = parseInt(req.params.id);
    const sukta = mandala4Data.suktas.find(s => s.sukta === suktaId);
    
    if (!sukta) {
      return res.status(404).json({ error: 'Sukta not found' });
    }
    
    res.json(sukta);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sukta data' });
  }
});

app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { mandala, sukta } = req.body;
    
    if (!mandala || !sukta) {
      return res.status(400).json({ error: 'Mandala and sukta are required' });
    }

    const suktaData = mandala4Data.suktas.find(s => s.sukta === sukta);
    if (!suktaData) {
      return res.status(404).json({ error: 'Sukta not found' });
    }

    // Combine all English translations
    const englishText = suktaData.mantras
      .map(mantra => mantra.sanskrit_devanagari)
      .join(' ');
    console.log(englishText);

    // Mock AI summary (replace with actual AI API call)
    // For production, uncomment and configure your preferred AI service:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Summarize this Rig Veda text in 2-3 sentences: ${englishText}`
        }],
        max_tokens: 150
      })
    });
    */

    const genAI =new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({model : "models/gemini-flash-latest"});

    const prompt = `Summarize the sukta based on the sanskrit sukta : ${englishText}`;

    // Mock summary for demo
    const mockSummary = `This sukta (${sukta}) from Mandala 4 is dedicated to ${suktaData.deity} and composed by ${suktaData.rishi}. It contains ${suktaData.mantras.length} verses that invoke divine blessings and express reverence through sacred hymns. The text emphasizes themes of worship, protection, and spiritual connection with the divine forces.`;
    const response = await model.generateContent(prompt);

    const answer = response.response.candidates[0].content.parts[0].text;
    console.log("answer:",answer);
    

    res.json({
      summary: answer,
      deity: suktaData.deity_english,
      rishi: suktaData.rishi_english,
      mantraCount: suktaData.mantras.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

app.get('/api/visualize/sukta/:id', (req, res) => {
  try {
    const suktaId = parseInt(req.params.id);
    console.log('visualize suktaId:', suktaId);
    
    const sukta = mandala4Data.suktas.find(s => s.sukta === suktaId);
    
    if (!sukta) {
      return res.status(404).json({ error: 'Sukta not found' });
    }

    // Calculate word frequency from English translations
    const allText = sukta.mantras
      .map(mantra => mantra.english_griffith)
      .join(' ');
    
    const wordFrequency = calculateWordFrequency(allText);
    const deityMentions = findDeityMentions(sukta);

    res.json({
      suktaId,
      wordFrequency,
      deityMentions,
      mantraCount: sukta.mantras.length
    });
  } catch (error) {
    console.log('error:', error);
    
    res.status(500).json({ error: 'Failed to generate visualization data' });
  }
});

app.post('/api/ai/quiz',async (req,res)=>{
  try{
    console.log('quiz is beaing generated');
    
    const suktaID = parseInt(req.body.suktaId)
    console.log('suktaID:', suktaID);
    
    
    if (!suktaID) {
      console.log('Sukta ID is missing in request body');
      
      return res.status(400).json({ error: "Sukta ID is required" });
    }

    const sukta = mandala4Data.suktas.find(s => s.sukta === suktaID);
    if (!sukta) {
      console.log('Sukta not found for ID:', suktaID);
      
      return res.status(404).json({ error: "Sukta not found" });
    }

    const genAI =new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({model : "models/gemini-flash-latest"});

    const sanskritText = sukta.mantras.map(m => m.sanskrit_devanagari).join(' ');
    const englishText = sukta.mantras.map(m => m.english_griffith).join(' ');

    const prompt = `
          You are an expert Sanskrit scholar and quiz maker.
      Given this Rigveda Sukta ${sukta.sukta} from Mandala 4:
      
      Deity: ${sukta.deity}
      Rishi: ${sukta.rishi}
      Sanskrit: ${sanskritText}
      English: ${englishText}

      Create a quiz of 5 multiple choice questions about this sukta.
      Include questions about the deity, rishi, content, and meaning.
      
      Format the result as valid JSON array:
      [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A"
        }
      ]

      Only produce the JSON array without any extra text or formatting.`;

    const response = await model.generateContent(prompt);
    let quizText = response.response.candidates[0].content.parts[0].text;
    quizText = quizText.replace(/```json/g, '').replace(/```/g, '').trim();

    const quizJson = JSON.parse(quizText);

    req.session.quiz = { suktaId: parseInt(suktaID), questions: quizJson };
    const quizForUser = quizJson.map(q => ({
      question: q.question,
      options: q.options
    }));

    res.json({ quiz: quizForUser });
  }
  catch(error){
    console.log('error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

app.post('/api/ai/quiz/submit', (req, res) => {
  try {
    const { answers } = req.body;
    const quizData = req.session.quiz;

    if (!quizData) return res.status(400).json({ error: "No quiz found in session" });

    const quiz = quizData.questions;
    let score = 0;
    const results = [];

    quiz.forEach((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) score++;
      
      results.push({
        question: q.question,
        userAnswer: answers[i],
        correctAnswer: q.correctAnswer,
        isCorrect
      });
    });

    res.json({ 
      score, 
      total: quiz.length,
      results 
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Rig Veda API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});