# ⚡ Quick Start Guide

Get your AI Code Reviewer up and running in 5 minutes!

---

## 📋 Prerequisites

- ✅ Node.js v14+ ([Download](https://nodejs.org/))
- ✅ npm or yarn
- ✅ Google Gemini API Key ([Get one free](https://aistudio.google.com/app/apikeys))
- ✅ Git (optional)

---

## 🚀 Installation (5 minutes)

### Step 1: Clone or Download
```bash
# Clone the repository
git clone https://github.com/ankurdotio/code-review.git
cd code-review
```

### Step 2: Backend Setup (2 minutes)
```bash
# Navigate to backend
cd BackEnd

# Install dependencies
npm install

# Create .env file
echo GOOGLE_GEMINI_KEY=your_api_key_here > .env

# Start backend
node server.js
```

✅ Backend runs on `http://localhost:3000`

### Step 3: Frontend Setup (2 minutes)
```bash
# Open new terminal
cd Frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

✅ Frontend runs on `http://localhost:5173`

### Step 4: Open Browser
- Navigate to `http://localhost:5173`
- Start reviewing code! 🎉

---

## 🔑 Getting Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click **"Create API Key"**
3. Copy your API key
4. Paste it in `BackEnd/.env`:
   ```env
   GOOGLE_GEMINI_KEY=your_copied_key_here
   ```

---

## 🎯 First Code Review

1. **Paste code** in the left editor (or use default)
2. **Select language** from dropdown
3. **Click "✨ Review Code"**
4. **Wait for loading spinner**
5. **Read review** on the right panel
6. **Copy review** using copy button

---

## 🎨 Features to Try

### 1. **Change Language**
- Click language dropdown (top of editor)
- Select Python, Java, C++, etc.
- Code highlighting updates automatically

### 2. **Toggle Theme**
- Click "☀️ Light" button in header
- Switch between dark and light modes

### 3. **Code Statistics**
- View lines, characters, words
- Stats update as you type

### 4. **Clear Code**
- Click "🗑️ Clear" button
- Start fresh with new code

### 5. **Copy Review**
- Click "📋 Copy Review" button
- Review copied to clipboard

---

## 💡 Example Code to Review

### JavaScript
```javascript
function findLargest(arr) {
  let max = arr[0]
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return max
}
```

### Python
```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total = total + num
    avg = total / len(numbers)
    return avg
```

### Java
```java
public class Calculator {
  public static int add(int a, int b) {
    return a + b;
  }
}
```

---

## ⚠️ Troubleshooting

### "Cannot connect to backend"
**Solution:**
```bash
# Check if backend is running
# Terminal should show: "Server is running on http://localhost:3000"

# If not running, start it:
cd BackEnd
node server.js
```

### "API Key Error"
**Solution:**
```
1. Check .env file: BackEnd/.env
2. Copy-paste correct API key
3. Restart backend (Ctrl+C, then node server.js)
```

### "Code editor is not working"
**Solution:**
```bash
# Reinstall frontend dependencies
cd Frontend
rm -rf node_modules
npm install
npm run dev
```

### "Getting error 404"
**Solution:**
- Make sure frontend is on `http://localhost:5173`
- Make sure backend is on `http://localhost:3000`
- Check network tab in browser DevTools

---

## 🔧 Common Commands

### Backend
```bash
# Install dependencies
npm install

# Start server
node server.js

# Stop server
Ctrl + C

# Check logs
# Look at terminal output
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Stop dev server
Ctrl + C

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
code-review/
├── BackEnd/
│   ├── src/
│   │   ├── app.js              # Express app
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js               # Server entry
│   ├── .env                    # Your API key here
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx             # Main component
│   │   ├── App.css             # Styles
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── README.md                   # Full documentation
├── IMPROVEMENTS.md             # What's new
├── BEFORE_AFTER.md             # Comparison
└── FUTURE_ENHANCEMENTS.md      # Roadmap
```

---

## 🎓 Next Steps

1. ✅ Review your first code
2. 📚 Read [README.md](./README.md) for detailed info
3. 🎯 Check [IMPROVEMENTS.md](./IMPROVEMENTS.md) for features
4. 🚀 Review [FUTURE_ENHANCEMENTS.md](./FUTURE_ENHANCEMENTS.md) for ideas
5. 🤝 Contribute or share feedback

---

## 💻 System Requirements

| Component | Requirement |
|-----------|-------------|
| Node.js | v14 or higher |
| npm | v6 or higher |
| RAM | 2GB minimum |
| Disk | 500MB |
| Internet | Required (for AI API) |

---

## 🎯 What to Review

Great code review examples:
- ✅ Function implementations
- ✅ API endpoints
- ✅ Component code
- ✅ Utility functions
- ✅ Algorithm implementations
- ✅ Database queries
- ✅ Error handling
- ✅ Performance-critical code

---

## 📊 Review Includes

Your review will contain:
1. **Overall Assessment** - Quick summary
2. **Strengths** ✅ - What's done well
3. **Issues Found** ❌ - Problems identified
4. **Suggestions** 💡 - Improvements with examples
5. **Best Practices** 🚀 - Modern patterns
6. **Performance Tips** ⚡ - Optimizations

---

## 🌐 Supported Languages

- JavaScript/TypeScript
- Python
- Java
- C/C++
- C#
- Go
- Rust
- PHP
- Ruby
- And more!

---

## 💾 Tips

### Save Your Review
```bash
# Copy the review text
# Paste in your favorite editor
# Save as .md file
```

### Share Your Code
```bash
# Copy code from your project
# Paste in editor
# Generate review
# Share results with team
```

### Track Improvements
```bash
# Save original code
# Get review
# Make suggested improvements
# Re-submit improved code
# Compare results
```

---

## 🆘 Need Help?

### Resources
- 📖 [Full README](./README.md)
- 📚 [Improvements Guide](./IMPROVEMENTS.md)
- 🗺️ [Roadmap](./FUTURE_ENHANCEMENTS.md)
- 🔍 [Before/After Comparison](./BEFORE_AFTER.md)

### Contact
- 📧 Create an issue on GitHub
- 💬 Start a discussion
- 🤝 Submit a pull request

---

## 🎉 You're All Set!

Your AI Code Reviewer is now ready to use. Start by:
1. Writing some code (or paste existing)
2. Click the Review button
3. Get instant AI feedback
4. Improve your code!

**Happy Reviewing!** 🚀

---

**Questions?** Check the documentation or open an issue! ✨
