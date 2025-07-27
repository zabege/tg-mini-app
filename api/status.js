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
        console.log('OpenAI API ключ настроен:', !!OPENAI_API_KEY);
        console.log('DeepSeek API ключ настроен:', !!DEEPSEEK_API_KEY);
        
        // Сначала просто проверяем, что сервер отвечает
        let status = 'ok';
        let message = '✅ Сервер работает';
        let bestApi = null;
        let openaiWorking = false;
        let deepseekWorking = false;

        // Проверяем OpenAI API только если есть ключ
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
        }

        // Проверяем DeepSeek API только если есть ключ
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
        }

        // Определяем лучший доступный API
        if (openaiWorking) {
            bestApi = 'openai';
            message = '✅ OpenAI API работает';
        } else if (deepseekWorking) {
            bestApi = 'deepseek';
            message = '✅ DeepSeek API работает';
        } else if (OPENAI_API_KEY || DEEPSEEK_API_KEY) {
            status = 'warning';
            message = '⚠️ API ключи настроены, но API недоступны';
        } else {
            status = 'warning';
            message = '⚠️ API ключи не настроены';
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
        // Даже при ошибке возвращаем успешный статус сервера
        res.json({ 
            status: 'warning', 
            message: '⚠️ Ошибка проверки API, но сервер работает',
            error: error.message
        });
    }
}; 