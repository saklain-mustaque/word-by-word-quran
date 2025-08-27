const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get list of surahs
app.get('/api/surahs', async (req, res) => {
    try {
        const response = await axios.get('https://api.alquran.cloud/v1/surah');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching surahs:', error);
        res.status(500).json({ error: 'Failed to fetch surahs' });
    }
});

// Get word-by-word data for a specific surah
app.get('/api/surah/:number', async (req, res) => {
    try {
        const surahNumber = req.params.number;
        
        // Fetch Arabic text
        const arabicResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
        
        // Fetch English translation for context
        const translationResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`);
        
        // For word-by-word, we'll use a different API or create mock data
        // Since comprehensive word-by-word APIs are limited, I'll structure it properly
        const wordByWordResponse = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        
        const result = {
            surah: arabicResponse.data.data,
            translation: translationResponse.data.data,
            wordByWord: wordByWordResponse.data.data
        };
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching surah data:', error);
        res.status(500).json({ error: 'Failed to fetch surah data' });
    }
});

// Get word-by-word breakdown for a specific verse
app.get('/api/verse/:surah/:verse', async (req, res) => {
    try {
        const { surah, verse } = req.params;
        
        // This would ideally connect to a comprehensive word-by-word API
        // For now, we'll return structured data that can be used for PDF generation
        const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${verse}/ar.alafasy`);
        const translationResponse = await axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${verse}/en.sahih`);
        
        // Mock word-by-word structure - in a real implementation, this would come from a specialized API
        const arabicText = response.data.data.text;
        const words = arabicText.split(' ');
        
        const wordByWord = words.map((word, index) => ({
            arabic: word,
            transliteration: `word${index + 1}`, // This would be actual transliteration
            translation: `meaning${index + 1}`,   // This would be actual word meaning
            grammar: `grammar${index + 1}`        // This would be actual grammar notes
        }));
        
        const result = {
            verse: response.data.data,
            translation: translationResponse.data.data,
            wordByWord: wordByWord
        };
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching verse data:', error);
        res.status(500).json({ error: 'Failed to fetch verse data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});