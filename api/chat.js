const fetch = require('node-fetch');

// API ключи из переменных окружения
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Системные промпты для разных языков
const systemPrompts = {
    en: 'You are a helpful English language tutor. Help the user learn English by providing clear explanations, corrections, and encouragement. Keep responses concise but informative.',
    ru: 'Вы - помощник по изучению русского языка. Помогайте пользователю изучать русский язык, давая четкие объяснения, исправления и поддержку. Держите ответы краткими, но информативными.',
    es: 'Eres un tutor de español útil. Ayuda al usuario a aprender español proporcionando explicaciones claras, correcciones y aliento. Mantén las respuestas concisas pero informativas.'
};

// Функция для проверки доступности API
async function checkApiAvailability() {
    let openaiWorking = false;
    let deepseekWorking = false;

    // Проверяем OpenAI
    if (OPENAI_API_KEY) {
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
            });
            openaiWorking = response.ok;
        } catch (error) {
            console.log('OpenAI API недоступен:', error.message);
        }
    }

    // Проверяем DeepSeek
    if (DEEPSEEK_API_KEY) {
        try {
            const response = await fetch('https://api.deepseek.com/v1/models', {
                headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` }
            });
            deepseekWorking = response.ok;
        } catch (error) {
            console.log('DeepSeek API недоступен:', error.message);
        }
    }

    // Возвращаем лучший доступный API
    if (openaiWorking) return 'openai';
    if (deepseekWorking) return 'deepseek';
    return null;
}

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

        // Проверяем доступность API
        const bestApi = await checkApiAvailability();
        
        if (!bestApi) {
            return res.status(503).json({ 
                error: 'Все API недоступны. Проверьте настройки ключей.',
                code: 'NO_API_AVAILABLE'
            });
        }

        // Подготавливаем сообщения для API
        const messagesForAPI = [
            { role: 'system', content: systemPrompts[language] },
            ...messages
        ];

        let response;
        let apiName;

        if (bestApi === 'openai') {
            console.log('Используем OpenAI API...');
            apiName = 'OpenAI';
            response = await fetch('https://api.openai.com/v1/chat/completions', {
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
        } else {
            console.log('Используем DeepSeek API...');
            apiName = 'DeepSeek';
            response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: messagesForAPI,
                    max_tokens: 500,
                    temperature: 0.7
                })
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`${apiName} API Error:`, response.status, errorText);
            
            if (response.status === 429) {
                return res.status(429).json({ 
                    error: 'Превышен лимит запросов. Попробуйте позже.',
                    code: 'RATE_LIMIT',
                    api: apiName
                });
            } else if (response.status === 401) {
                return res.status(401).json({ 
                    error: 'Ошибка авторизации API',
                    code: 'AUTH_ERROR',
                    api: apiName
                });
            } else {
                return res.status(response.status).json({ 
                    error: `Ошибка ${apiName} API: ${response.status}`,
                    code: 'API_ERROR',
                    api: apiName
                });
            }
        }

        const data = await response.json();
        console.log(`Успешный ответ от ${apiName} API`);

        res.json({
            message: data.choices[0].message.content,
            api: apiName
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Внутренняя ошибка сервера',
            code: 'SERVER_ERROR'
        });
    }
}; 