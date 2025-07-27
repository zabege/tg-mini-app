const fetch = require('node-fetch');

// OpenAI API ключ из переменных окружения
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('ОШИБКА: OPENAI_API_KEY не установлен в переменных окружения');
}

// Системные промпты для разных языков
const systemPrompts = {
    en: 'You are a helpful English language tutor. Help the user learn English by providing clear explanations, corrections, and encouragement. Keep responses concise but informative.',
    ru: 'Вы - помощник по изучению русского языка. Помогайте пользователю изучать русский язык, давая четкие объяснения, исправления и поддержку. Держите ответы краткими, но информативными.',
    es: 'Eres un tutor de español útil. Ayuda al usuario a aprender español proporcionando explicaciones claras, correcciones y aliento. Mantén las respuestas concisas pero informativas.'
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, language } = req.body;
        
        if (!messages || !language) {
            return res.status(400).json({ error: 'Missing messages or language' });
        }

        if (!OPENAI_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Подготавливаем сообщения для OpenAI
        const messagesForAPI = [
            { role: 'system', content: systemPrompts[language] },
            ...messages
        ];

        console.log('Отправка запроса к OpenAI API...');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messagesForAPI,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API Error:', response.status, errorText);
            
            if (response.status === 429) {
                return res.status(429).json({ 
                    error: 'Превышен лимит запросов. Попробуйте позже.',
                    code: 'RATE_LIMIT'
                });
            } else if (response.status === 401) {
                return res.status(401).json({ 
                    error: 'Ошибка авторизации API',
                    code: 'AUTH_ERROR'
                });
            } else {
                return res.status(response.status).json({ 
                    error: `Ошибка API: ${response.status}`,
                    code: 'API_ERROR'
                });
            }
        }

        const data = await response.json();
        console.log('Успешный ответ от OpenAI API');

        res.json({
            message: data.choices[0].message.content
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Внутренняя ошибка сервера',
            code: 'SERVER_ERROR'
        });
    }
}; 