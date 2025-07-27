const fetch = require('node-fetch');

// DeepSeek API ключ из переменных окружения
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
        // Сначала проверяем, есть ли API ключ
        if (!DEEPSEEK_API_KEY) {
            console.log('DEEPSEEK_API_KEY не настроен');
            return res.json({ 
                status: 'warning', 
                message: 'API ключ не настроен, но сервер работает' 
            });
        }

        // Если есть ключ, проверяем API
        console.log('Проверка DeepSeek API...');
        const response = await fetch('https://api.deepseek.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            }
        });

        if (response.ok) {
            console.log('DeepSeek API работает');
            res.json({ status: 'ok', message: 'API работает' });
        } else {
            console.log('DeepSeek API недоступен:', response.status);
            res.json({ 
                status: 'warning', 
                message: `API недоступен (${response.status}), но сервер работает` 
            });
        }
    } catch (error) {
        console.error('Ошибка проверки API:', error);
        // Даже при ошибке API возвращаем успешный статус сервера
        res.json({ 
            status: 'warning', 
            message: 'Ошибка подключения к API, но сервер работает' 
        });
    }
}; 