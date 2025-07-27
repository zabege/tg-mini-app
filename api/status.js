const fetch = require('node-fetch');

// OpenAI API ключ из переменных окружения
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

    try {
        if (!OPENAI_API_KEY) {
            return res.status(500).json({ 
                status: 'error', 
                message: 'API key not configured' 
            });
        }

        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        if (response.ok) {
            res.json({ status: 'ok', message: 'API работает' });
        } else {
            res.status(response.status).json({ 
                status: 'error', 
                message: `API недоступен: ${response.status}` 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Ошибка подключения к API' 
        });
    }
}; 