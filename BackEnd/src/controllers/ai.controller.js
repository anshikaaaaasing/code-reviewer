const aiService = require("../services/ai.service")
const reviewDB = require("../database/reviewDB")

// Function to calculate code quality score
const calculateQualityScore = (code, review) => {
  let score = 100;
  const reviewLower = review.toLowerCase();
  
  // Deduct points for issues found
  if (reviewLower.includes('error') || reviewLower.includes('bug')) score -= 25;
  if (reviewLower.includes('security')) score -= 20;
  if (reviewLower.includes('performance')) score -= 15;
  if (reviewLower.includes('bad')) score -= 10;
  if (reviewLower.includes('issue')) score -= 10;
  if (reviewLower.includes('refactor')) score -= 5;
  
  // Bonus points for good practices
  if (reviewLower.includes('good') || reviewLower.includes('excellent')) score += 10;
  if (reviewLower.includes('best practice')) score += 10;
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  return score;
};

// Function to convert score to grade (A-F)
const getGrade = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

// Function to estimate code complexity
const estimateComplexity = (code) => {
  const lines = code.split('\n').length;
  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';
  
  const hasNestedLoop = (code.match(/for.*for/gi) || []).length > 0;
  const hasRecursion = /function.*\(.*\).*{.*return.*\(/.test(code);
  const hasMultipleLoops = (code.match(/for|while/gi) || []).length >= 2;
  
  if (hasRecursion) timeComplexity = 'O(2^n)';
  else if (hasNestedLoop) timeComplexity = 'O(n²)';
  else if (hasMultipleLoops) timeComplexity = 'O(n)';
  
  if (lines > 100) spaceComplexity = 'O(n)';
  
  return { time: timeComplexity, space: spaceComplexity };
};

// Function to detect code language
const detectLanguage = (code) => {
  const lowerCode = code.toLowerCase();
  
  // C (check before C++ and C#)
  if ((lowerCode.includes('#include') && !lowerCode.includes('std::')) || 
      (lowerCode.includes('stdio.h') || lowerCode.includes('stdlib.h') || lowerCode.includes('string.h'))) {
    return 'C';
  }
  
  // C++ (has std:: or iostream)
  if (lowerCode.includes('std::') || (lowerCode.includes('#include') && lowerCode.includes('iostream'))) {
    return 'C++';
  }
  
  // C#
  if (lowerCode.includes('using ') && lowerCode.includes('namespace ')) {
    return 'C#';
  }
  
  // Java
  if (lowerCode.includes('class ') && lowerCode.includes('public ')) {
    return 'Java';
  }
  
  // Python
  if (lowerCode.includes('def ') || lowerCode.includes('import ') || lowerCode.includes('from ')) {
    return 'Python';
  }
  
  // TypeScript/JavaScript
  if (lowerCode.includes('function ') || lowerCode.includes('const ') || lowerCode.includes('let ') || lowerCode.includes('var ')) {
    if (lowerCode.includes('interface ') || lowerCode.includes('type ')) return 'TypeScript';
    return 'JavaScript';
  }
  
  // Go
  if (lowerCode.includes('package ') && lowerCode.includes('func ')) {
    return 'Go';
  }
  
  // Rust
  if (lowerCode.includes('fn ') && lowerCode.includes('mut ')) {
    return 'Rust';
  }
  
  // PHP
  if (lowerCode.includes('<?php') || lowerCode.includes('<?')) {
    return 'PHP';
  }
  
  // Ruby
  if (lowerCode.includes('def ') && lowerCode.includes('end')) {
    return 'Ruby';
  }
  
  // Default to JavaScript if no specific patterns match
  return 'JavaScript';
};

module.exports.getReview = async (req, res) => {
    try {
        const { code, language = 'auto', userId } = req.body;

        // Validation
        if (!code) {
            return res.status(400).json({ 
                error: "Code is required",
                status: "error"
            });
        }

        if (typeof code !== 'string') {
            return res.status(400).json({ 
                error: "Code must be a string",
                status: "error"
            });
        }

        if (code.trim().length === 0) {
            return res.status(400).json({ 
                error: "Code cannot be empty",
                status: "error"
            });
        }

        if (code.length > 50000) {
            return res.status(400).json({ 
                error: "Code exceeds maximum length (50KB)",
                status: "error"
            });
        }

        // Auto-detect language if not specified
        const detectedLanguage = language === 'auto' ? detectLanguage(code) : language;

        console.log(`📝 Reviewing code: ${code.split('\n').length} lines, ${code.length} characters, Language: ${detectedLanguage}`);
        
        const response = await aiService(code);

        if (!response) {
            return res.status(500).json({ 
                error: "Failed to generate review",
                status: "error"
            });
        }

        // Calculate quality score and complexity
        const qualityScore = calculateQualityScore(code, response);
        const grade = getGrade(qualityScore);
        const complexity = estimateComplexity(code);

        // Save review to history if userId is provided
        if (userId) {
            const savedReview = await reviewDB.create({
                userId,
                code,
                language: detectedLanguage,
                review: response,
                qualityScore,
                complexity
            });
        }

        res.status(200).json({
            review: response,
            qualityScore,
            grade,
            complexity,
            language: detectedLanguage
        });

    } catch (error) {
        console.error('❌ Error in getReview:', error.message);
        res.status(500).json({ 
            error: error.message || "Internal server error",
            status: "error"
        });
    }
}

// Get user's review history
module.exports.getReviewHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1 } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const reviews = await reviewDB.getByUserId(userId);
        res.status(200).json({
            success: true,
            total: reviews.length,
            reviews: reviews.slice((page - 1) * 10, page * 10)
        });
    } catch (error) {
        console.error('Error fetching review history:', error);
        res.status(500).json({ error: 'Failed to fetch review history' });
    }
}

// Get single review details
module.exports.getReviewDetails = async (req, res) => {
    try {
        const { reviewId } = req.params;

        if (!reviewId) {
            return res.status(400).json({ error: "Review ID is required" });
        }

        const review = await reviewDB.getById(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.status(200).json({
            success: true,
            review
        });
    } catch (error) {
        console.error('Error fetching review details:', error);
        res.status(500).json({ error: 'Failed to fetch review details' });
    }
}