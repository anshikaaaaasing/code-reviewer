# 💻 AI Code Reviewer

A modern, full-stack code review application powered by **Google Gemini AI**. Get professional, detailed code reviews with suggestions for improvements, best practices, and optimization opportunities.

## ✨ Features

- **🤖 AI-Powered Reviews** - Powered by Google Gemini 2.0 Flash
- **🎨 Beautiful UI** - Modern dark/light theme with smooth animations
- **📝 Multi-Language Support** - Review code in 10+ programming languages
- **⚡ Real-time Reviews** - Get instant feedback on your code
- **📊 Code Statistics** - View code metrics (lines, characters, words)
- **📋 Copy Reviews** - Easily copy review results to clipboard
- **🔒 Input Validation** - Robust error handling and validation
- **⏳ Loading States** - Visual feedback during processing
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🌓 Theme Toggle** - Switch between dark and light modes

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikeys))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ankurdotio/code-review.git
cd code-review
```

2. **Backend Setup**
```bash
cd BackEnd
npm install
```

Create a `.env` file in the `BackEnd` folder:
```env
GOOGLE_GEMINI_KEY=your_api_key_here
NODE_ENV=development
```

Start the backend:
```bash
node server.js
```
Backend runs on `http://localhost:3000`

3. **Frontend Setup** (new terminal)
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

4. **Open in Browser**
Navigate to `http://localhost:5173` and start reviewing code!

## 📁 Project Structure

```
code-review/
├── BackEnd/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── controllers/
│   │   │   └── ai.controller.js   # Request handling
│   │   ├── routes/
│   │   │   └── ai.routes.js       # API routes
│   │   └── services/
│   │       └── ai.service.js      # AI integration
│   ├── server.js                  # Server entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx                # Main component
│   │   ├── App.css                # Styles
│   │   └── main.jsx               # React entry point
│   ├── index.html                 # HTML template
│   ├── vite.config.js             # Vite configuration
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### POST `/ai/get-review`
Get a code review for your code.

**Request:**
```json
{
  "code": "function sum() { return 1 + 1; }"
}
```

**Response:**
```json
{
  "text": "## Overall Assessment\n✅ Good code...",
  "status": "success"
}
```

**Error Response:**
```json
{
  "error": "Code is required",
  "status": "error"
}
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **PrismJS** - Syntax highlighting
- **Highlight.js** - Code highlighting

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Google Generative AI** - AI integration
- **CORS** - Cross-origin support
- **Dotenv** - Environment variables

## 🎯 Usage Guide

1. **Paste or write code** in the left editor
2. **Select the language** (JavaScript, Python, Java, etc.)
3. **View code statistics** (lines, characters, words)
4. **Click "✨ Review Code"** to get started
5. **Wait for the AI analysis** (shown with loading spinner)
6. **Read the detailed review** on the right panel
7. **Copy the review** using the copy button

## 💡 Review Includes

- **Overall Assessment** - Quick summary of code quality
- **Strengths** ✅ - What's done well
- **Issues Found** ❌ - Problems and concerns
- **Suggestions** 💡 - Specific improvements with examples
- **Best Practices** 🚀 - Modern patterns to adopt
- **Performance Tips** ⚡ - Optimization opportunities

## 🔒 Security & Validation

- Input size limit: 50KB per request
- Code validation and sanitization
- Error handling for API failures
- Rate limiting support
- CORS protection
- XSS protection

## 🌈 Theme Support

The application supports both **dark** and **light** themes:
- Click the theme toggle button (☀️ / 🌙) in the header
- Preference persists during session
- Beautiful gradients and color schemes for both themes

## 📱 Responsive Design

Works seamlessly on:
- 💻 Desktop (1920x1080 and above)
- 🖥️ Laptop (1366x768)
- 📱 Tablets (768px+)
- 📲 Mobile devices with optimized layout

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on `http://localhost:3000`
- Check CORS configuration in `app.js`

### "API Key Error"
- Verify `GOOGLE_GEMINI_KEY` is set in `.env`
- Get a new key from [Google AI Studio](https://aistudio.google.com/app/apikeys)

### "Rate limit exceeded"
- Wait a few seconds before retrying
- Reduce code size if possible

### "Empty review response"
- Check internet connection
- Verify API key is valid
- Try with smaller code sample

## 📈 Future Enhancements

- [ ] User authentication
- [ ] Review history/saved reviews
- [ ] Code comparison tool
- [ ] Multiple file support
- [ ] Team collaboration features
- [ ] Custom review templates
- [ ] Export reviews (PDF, Word)
- [ ] Chrome extension
- [ ] VS Code extension

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 👨‍💻 Author

Created with ❤️ by [Ankur Dotio](https://github.com/ankurdotio)

---

**Made with ❤️ | Powered by Google Gemini AI**
