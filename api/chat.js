// Демо-ответы для каждого языка
const demoResponses = {
    en: {
        male: [
            "Great! I can see you're learning English. As your tutor Alex, I'm here to help you improve your skills step by step.",
            "That's a good start! Remember, practice makes perfect. Let's work on your pronunciation together.",
            "Excellent progress! Here's a tip from me: try to think in English instead of translating from your native language.",
            "Keep up the good work! I've been teaching for 5 years and I can see you have real potential.",
            "You're doing well! Let's focus on building your confidence in speaking English naturally.",
            "That's a great question! As an experienced tutor, I always encourage my students to ask questions.",
            "Your vocabulary is expanding nicely! Here's a new useful phrase you can practice: 'I'd like to...'",
            "I'm impressed with your dedication! Remember, consistency is key in language learning.",
            "Your grammar is improving! Let's work on some common English expressions next.",
            "Well done! I love seeing my students make progress. What would you like to practice next?"
        ],
        female: [
            "Hello! I'm Maria, your friendly English tutor. I'm excited to help you on your language learning journey!",
            "That's wonderful! I believe everyone can learn a language with the right approach and support.",
            "You're making great progress! Let me share a helpful tip: try watching English movies with subtitles.",
            "Keep going! I've been teaching for 3 years and I love seeing students grow in confidence.",
            "You're doing fantastic! Let's work on making your English sound more natural and fluent.",
            "What a thoughtful question! I always encourage my students to be curious about the language.",
            "Your speaking skills are developing beautifully! Here's a fun expression to try: 'That sounds great!'",
            "I'm so proud of your effort! Remember, every small step counts in language learning.",
            "Your understanding is getting stronger! Let's practice some everyday conversation skills.",
            "Excellent work! I love how you're embracing the learning process. What interests you most about English?"
        ]
    },
    ru: {
        male: [
            "Отлично! Я Алекс, ваш преподаватель русского языка. Я вижу, что вы серьезно относитесь к обучению.",
            "Хорошее начало! За 5 лет преподавания я понял, что регулярность - ключ к успеху.",
            "Отличный прогресс! Мой совет: попробуйте думать на русском языке, а не переводить.",
            "Продолжайте в том же духе! Я всегда рад видеть, как мои студенты развиваются.",
            "Вы хорошо справляетесь! Давайте сосредоточимся на улучшении вашего произношения.",
            "Отличный вопрос! Как опытный преподаватель, я ценю любознательность студентов.",
            "Ваш словарный запас растет! Вот полезная фраза для практики: 'Мне нравится...'",
            "Я впечатлен вашей настойчивостью! Помните, что терпение - важная часть обучения.",
            "Ваша грамматика улучшается! Давайте разберем некоторые сложные конструкции.",
            "Молодец! Я люблю видеть прогресс своих студентов. Что бы вы хотели изучить дальше?"
        ],
        female: [
            "Привет! Я Мария, ваш дружелюбный преподаватель русского языка. Рада помочь вам в изучении!",
            "Это замечательно! Я верю, что каждый может выучить язык при правильном подходе.",
            "Вы делаете отличные успехи! Мой совет: смотрите русские фильмы с субтитрами.",
            "Продолжайте! За 3 года преподавания я поняла, как важно поддерживать студентов.",
            "Вы справляетесь прекрасно! Давайте сделаем вашу речь более естественной и плавной.",
            "Какой интересный вопрос! Я всегда поощряю любознательность своих студентов.",
            "Ваши разговорные навыки развиваются красиво! Попробуйте фразу: 'Это звучит здорово!'",
            "Я так горжусь вашими усилиями! Помните, каждый маленький шаг важен в изучении языка.",
            "Ваше понимание становится крепче! Давайте попрактикуемся в повседневном общении.",
            "Отличная работа! Мне нравится, как вы погружаетесь в процесс обучения. Что вас больше всего интересует в русском языке?"
        ]
    },
    es: {
        male: [
            "¡Excelente! Soy Alex, tu tutor de español. Veo que te tomas en serio el aprendizaje del idioma.",
            "¡Buen comienzo! En 5 años de enseñanza he aprendido que la constancia es la clave del éxito.",
            "¡Excelente progreso! Mi consejo: intenta pensar en español en lugar de traducir.",
            "¡Sigue así! Siempre me alegra ver cómo mis estudiantes se desarrollan.",
            "¡Lo estás haciendo bien! Concentrémonos en mejorar tu pronunciación.",
            "¡Excelente pregunta! Como tutor experimentado, valoro la curiosidad de mis estudiantes.",
            "¡Tu vocabulario está creciendo! Aquí tienes una frase útil para practicar: 'Me gusta...'",
            "¡Me impresiona tu perseverancia! Recuerda que la paciencia es importante en el aprendizaje.",
            "¡Tu gramática está mejorando! Vamos a revisar algunas construcciones complejas.",
            "¡Bien hecho! Me encanta ver el progreso de mis estudiantes. ¿Qué te gustaría estudiar a continuación?"
        ],
        female: [
            "¡Hola! Soy Maria, tu tutora amigable de español. ¡Estoy emocionada de ayudarte en tu viaje de aprendizaje!",
            "¡Eso es maravilloso! Creo que todos pueden aprender un idioma con el enfoque correcto.",
            "¡Estás progresando mucho! Mi consejo: mira películas en español con subtítulos.",
            "¡Continúa! En 3 años de enseñanza he aprendido lo importante que es apoyar a los estudiantes.",
            "¡Lo estás haciendo fantástico! Vamos a hacer que tu español suene más natural y fluido.",
            "¡Qué pregunta tan interesante! Siempre animo a mis estudiantes a ser curiosos sobre el idioma.",
            "¡Tus habilidades de habla se están desarrollando hermosamente! Prueba esta expresión: '¡Eso suena genial!'",
            "¡Estoy tan orgullosa de tu esfuerzo! Recuerda, cada pequeño paso cuenta en el aprendizaje.",
            "¡Tu comprensión se está fortaleciendo! Vamos a practicar algunas habilidades de conversación cotidiana.",
            "¡Excelente trabajo! Me encanta cómo abrazas el proceso de aprendizaje. ¿Qué te interesa más del español?"
        ]
    }
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
        const { messages, language, character } = req.body;
        
        if (!messages || !language || !character) {
            return res.status(400).json({ error: 'Missing messages, language, or character' });
        }

        console.log('Chat endpoint вызван для языка:', language, 'персонажа:', character);

        // Всегда используем демо-режим
        console.log('Используем демо-режим для языка:', language, 'персонажа:', character);
        
        // Имитируем задержку для реалистичности
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Выбираем случайный ответ из заготовленных для конкретного персонажа
        const responses = demoResponses[language][character];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        res.json({
            message: randomResponse,
            api: 'demo',
            mode: 'demo',
            character: character
        });

    } catch (error) {
        console.error('Server error:', error);
        
        // При любой ошибке используем демо-режим
        const { language, character } = req.body;
        if (language && character && demoResponses[language] && demoResponses[language][character]) {
            const responses = demoResponses[language][character];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            res.json({
                message: randomResponse,
                api: 'demo',
                mode: 'error-fallback',
                character: character
            });
        } else {
            res.status(500).json({ 
                error: 'Внутренняя ошибка сервера',
                code: 'SERVER_ERROR'
            });
        }
    }
}; 