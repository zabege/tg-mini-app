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

// Демо-ответы для каждого языка
const demoResponses = {
    en: [
        "Great! I can see you're learning English. Let me help you improve!",
        "That's a good start! Try to practice speaking English every day.",
        "Excellent progress! Here's a tip: watch English movies with subtitles.",
        "Keep up the good work! Reading English books will help a lot.",
        "You're doing well! Try to think in English instead of translating.",
        "That's a great question! Let me explain this grammar rule...",
        "Your pronunciation is getting better! Keep practicing.",
        "I'm impressed with your vocabulary! Here's a new word to learn...",
        "Remember to use articles (a, an, the) correctly in English.",
        "Your sentence structure is improving! Well done!"
    ],
    ru: [
        "Отлично! Я вижу, что вы изучаете русский язык. Давайте улучшим ваши навыки!",
        "Хорошее начало! Попробуйте практиковать русский каждый день.",
        "Отличный прогресс! Совет: смотрите русские фильмы с субтитрами.",
        "Продолжайте в том же духе! Чтение русских книг очень поможет.",
        "Вы хорошо справляетесь! Попробуйте думать на русском языке.",
        "Отличный вопрос! Давайте разберем это правило грамматики...",
        "Ваше произношение улучшается! Продолжайте практиковаться.",
        "Я впечатлен вашим словарным запасом! Вот новое слово для изучения...",
        "Помните о правильном использовании падежей в русском языке.",
        "Структура ваших предложений улучшается! Молодец!"
    ],
    es: [
        "¡Excelente! Veo que estás aprendiendo español. ¡Te ayudo a mejorar!",
        "¡Buen comienzo! Intenta practicar español todos los días.",
        "¡Excelente progreso! Consejo: mira películas en español con subtítulos.",
        "¡Sigue así! Leer libros en español te ayudará mucho.",
        "¡Lo estás haciendo bien! Intenta pensar en español en lugar de traducir.",
        "¡Excelente pregunta! Te explico esta regla gramatical...",
        "¡Tu pronunciación está mejorando! Sigue practicando.",
        "¡Me impresiona tu vocabulario! Aquí tienes una nueva palabra para aprender...",
        "Recuerda usar correctamente los artículos en español.",
        "¡La estructura de tus oraciones está mejorando! ¡Bien hecho!"
    ]
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
            // Демо-режим - используем заготовленные ответы
            console.log('Используем демо-режим для языка:', language);
            
            // Имитируем задержку для реалистичности
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
            
            // Выбираем случайный ответ из заготовленных
            const responses = demoResponses[language];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            res.json({
                message: randomResponse,
                api: 'demo',
                mode: 'demo'
            });
            return;
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
            
            // При ошибке API переключаемся на демо-режим
            console.log('API недоступен, переключаемся на демо-режим');
            
            const responses = demoResponses[language];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            res.json({
                message: randomResponse,
                api: 'demo',
                mode: 'fallback'
            });
            return;
        }

        const data = await response.json();
        console.log(`Успешный ответ от ${apiName} API`);

        res.json({
            message: data.choices[0].message.content,
            api: apiName,
            mode: 'live'
        });

    } catch (error) {
        console.error('Server error:', error);
        
        // При любой ошибке используем демо-режим
        const { language } = req.body;
        if (language && demoResponses[language]) {
            const responses = demoResponses[language];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            res.json({
                message: randomResponse,
                api: 'demo',
                mode: 'error-fallback'
            });
        } else {
            res.status(500).json({ 
                error: 'Внутренняя ошибка сервера',
                code: 'SERVER_ERROR'
            });
        }
    }
}; 