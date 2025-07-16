const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.listen(3001);

app.get('/status', (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        message: 'Le serveur fonctionne correctement',
        timestamp: Date.now()
    });
});

app.post('/ocr', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Aucune image fournie.' });

    const filePath = path.resolve(req.file.path);

    try {
        const { data: { text } } = await Tesseract.recognize(filePath, 'fra', {
            logger: m => console.log(m) // optionnel : logs OCR
        });

        fs.unlinkSync(filePath); // Nettoyage
        return res.json({ text: text.trim() });
    } catch (error) {
        console.error(error);
        fs.unlinkSync(filePath);
        return res.status(500).json({ error: 'Erreur OCR' });
    }
});

app.listen(3000, () => console.log('✅ OCR API en ligne sur http://localhost:3001'));
