const fetch = require('node-fetch');

// API ключи из переменных окружения
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Status endpoint вызван');

    // Всегда возвращаем успешный статус
    res.json({ 
        status: 'ok',
        message: '✅ Сервер работает (демо-режим)',
        bestApi: 'demo',
        openaiAvailable: false,
        deepseekAvailable: false,
        openaiConfigured: false,
        deepseekConfigured: false
    });
}; 