# Rig Veda Mandala 4 Explorer

A full-stack web application for exploring the sacred hymns of Mandala 4 from the Rig Veda, built for the Rig Veda Hackathon.

## 🌟 Features

- **Interactive Sukta Browser**: Explore all suktas in Mandala 4 with deity and rishi information
- **Multi-view Text Display**: View verses in English translation, Sanskrit (Devanagari + IAST), or both
- **AI-Powered Summaries**: Generate contextual summaries of suktas using AI
- **Rich Visualizations**: Word frequency charts and deity mention analysis
- **Responsive Design**: Mobile-friendly interface with smooth animations
- **Sanskrit Typography**: Proper Devanagari font rendering

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API serving Mandala 4 data from JSON files
- AI integration endpoints for text summarization
- Visualization data processing with word frequency and deity analysis
- CORS enabled for frontend communication

### Frontend (React + Tailwind CSS)
- Modern React application with React Router for navigation
- Tailwind CSS for responsive, beautiful styling
- Framer Motion for smooth animations and transitions
- Recharts for interactive data visualizations
- Custom Sanskrit font integration

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000` and proxy API calls to the backend.

## 🚀 Development

### Running Both Services
1. Start the backend server:
   ```bash
   cd backend && npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend && npm run dev
   ```

### API Endpoints

- `GET /api/mandala/4` - List all suktas in Mandala 4
- `GET /api/mandala/4/sukta/:id` - Get full mantra data for a specific sukta
- `POST /api/ai/summarize` - Generate AI summary for a sukta
- `GET /api/visualize/sukta/:id` - Get visualization data (word frequency, deity mentions)
- `GET /health` - Health check endpoint

### Data Structure

The application uses a structured JSON format for Rig Veda data:

```json
{
  "mandala": 4,
  "suktas": [
    {
      "sukta": 1,
      "deity": "Agni",
      "rishi": "Vamadeva",
      "mantras": [
        {
          "verse": 1,
          "sanskrit_devanagari": "त्वां हि अग्ने सदमित् समन्यवो...",
          "sanskrit_iast": "tvāṃ hí agne sádamit samanyávo...",
          "english_griffith": "Agni, we invoke thee..."
        }
      ]
    }
  ]
}
```

## 🎨 Design Features

- **Typography**: Inter for UI, Crimson Text for English translations, Noto Sans Devanagari for Sanskrit
- **Color System**: Sacred blues and Vedic ambers with comprehensive shade variations
- **Responsive Grid**: Adaptive layouts for mobile, tablet, and desktop
- **Micro-interactions**: Hover states, loading animations, and smooth transitions
- **Accessibility**: Proper contrast ratios and semantic HTML structure

## 🔮 AI Integration

The app includes mock AI summarization functionality. To enable real AI features:

1. Add your API keys to `.env`:
   ```
   OPENAI_API_KEY=your_openai_key
   # OR
   GEMINI_API_KEY=your_gemini_key
   ```

2. Uncomment the AI service code in `backend/server.js`

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend (Render/Railway)
The backend is ready for deployment on Node.js hosting platforms. Ensure environment variables are set in production.

## 📊 Sample Data

The application includes sample data with 3 suktas from Mandala 4:
- Sukta 1: Agni (Vamadeva) - 3 verses
- Sukta 2: Agni (Vamadeva) - 4 verses  
- Sukta 3: Agni (Vamadeva) - 3 verses

## 🙏 Attribution

- **Sanskrit Text**: VedaWeb (Universität zu Köln)
- **English Translation**: R.T.H. Griffith (1896) — Public Domain
- **Summaries**: AI-generated (demonstration purposes)

## 📄 License

This project is created for educational purposes as part of the Rig Veda Hackathon. The Sanskrit texts and English translations are in the public domain.

## 🛠️ Tech Stack

**Backend**:
- Node.js
- Express.js
- CORS middleware
- dotenv for configuration

**Frontend**:
- React 18
- React Router DOM
- Tailwind CSS
- Framer Motion
- Recharts
- Vite build tool

## 🤝 Contributing

This project was built for the Rig Veda Hackathon. Contributions and improvements are welcome!

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**: Ensure Node.js is installed and run `npm install` in the backend directory
2. **Frontend API calls failing**: Make sure the backend server is running on port 5000
3. **Sanskrit fonts not loading**: Check your internet connection for Google Fonts
4. **Build errors**: Clear node_modules and reinstall dependencies

### Development Tips

- Use the browser's dev tools to inspect API calls
- Check the console for any JavaScript errors
- Ensure proper CORS headers for cross-origin requests
- Test responsive design using browser dev tools