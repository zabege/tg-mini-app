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

    try {
        console.log('Проверка доступности API...');
        
        // Проверяем OpenAI API
        let openaiWorking = false;
        if (OPENAI_API_KEY) {
            try {
                console.log('Тестирование OpenAI API...');
                const openaiResponse = await fetch('https://api.openai.com/v1/models', {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    }
                });
                openaiWorking = openaiResponse.ok;
                console.log('OpenAI API статус:', openaiResponse.status, openaiWorking ? 'работает' : 'не работает');
            } catch (error) {
                console.log('OpenAI API ошибка:', error.message);
            }
        } else {
            console.log('OpenAI API ключ не настроен');
        }

        // Проверяем DeepSeek API
        let deepseekWorking = false;
        if (DEEPSEEK_API_KEY) {
            try {
                console.log('Тестирование DeepSeek API...');
                const deepseekResponse = await fetch('https://api.deepseek.com/v1/models', {
                    headers: {
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                    }
                });
                deepseekWorking = deepseekResponse.ok;
                console.log('DeepSeek API статус:', deepseekResponse.status, deepseekWorking ? 'работает' : 'не работает');
            } catch (error) {
                console.log('DeepSeek API ошибка:', error.message);
            }
        } else {
            console.log('DeepSeek API ключ не настроен');
        }

        // Определяем лучший доступный API
        let bestApi = null;
        let status = 'error';
        let message = '';

        if (openaiWorking) {
            bestApi = 'openai';
            status = 'ok';
            message = '✅ OpenAI API работает';
        } else if (deepseekWorking) {
            bestApi = 'deepseek';
            status = 'ok';
            message = '✅ DeepSeek API работает';
        } else if (OPENAI_API_KEY || DEEPSEEK_API_KEY) {
            status = 'warning';
            message = '⚠️ API ключи настроены, но API недоступны';
        } else {
            status = 'error';
            message = '❌ API ключи не настроены';
        }

        console.log('Выбранный API:', bestApi);
        console.log('Финальный статус:', status, message);

        res.json({ 
            status: status,
            message: message,
            bestApi: bestApi,
            openaiAvailable: openaiWorking,
            deepseekAvailable: deepseekWorking,
            openaiConfigured: !!OPENAI_API_KEY,
            deepseekConfigured: !!DEEPSEEK_API_KEY
        });

    } catch (error) {
        console.error('Общая ошибка проверки API:', error);
        res.json({ 
            status: 'error', 
            message: 'Ошибка проверки API',
            error: error.message
        });
    }
}; 