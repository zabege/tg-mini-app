// Простой тест для проверки работы API
console.log('API chat.js загружен');

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

// Структурированные вопросы для оценки уровня
const assessmentQuestions = {
    ru: [
        "Расскажите о себе: где вы учились, чем увлекаетесь?",
        "Прочитайте и перескажите короткий абзац текста (можно дать текст заранее).",
        "Как вы понимаете разницу между словами «ложить» и «класть»?",
        "Составьте связное предложение с использованием слов «тем не менее», «впрочем», «однако».",
        "Послушайте короткий отрывок (например, новость или диалог) и перескажите, о чём он."
    ],
    en: [
        "Can you introduce yourself and describe your daily routine?",
        "Listen to a short audio clip (e.g., weather forecast) and explain what you understood.",
        "What is the difference between present perfect and past simple? Give examples.",
        "Read a short paragraph and summarize it in your own words.",
        "Make a sentence using the words although, meanwhile, and however."
    ],
    es: [
        "¿Puedes presentarte y contarme cómo es un día típico para ti?",
        "Lee este párrafo corto y dime de qué trata (текст можно дать отдельно).",
        "¿Cuál es la diferencia entre los tiempos pretérito indefinido y pretérito imperfecto?",
        "Escucha este audio breve y dime qué ocurrió.",
        "Forma una oración con aunque, sin embargo, y mientras tanto."
    ]
};

// Функция для получения ответа на вопрос оценки
function getAssessmentResponse(language, character, questionIndex) {
    const responses = {
        ru: {
            male: [
                "Отличный ответ! Я вижу, что у вас хорошая база русского языка. Давайте поработаем над деталями.",
                "Хорошо! Ваше понимание грамматики развивается. Попробуйте использовать больше сложных конструкций.",
                "Интересный подход! Как преподаватель с опытом, я могу предложить несколько альтернативных вариантов.",
                "Молодец! Ваш словарный запас впечатляет. Давайте добавим еще несколько полезных выражений.",
                "Отлично! Ваше произношение улучшается. Продолжайте практиковаться с аудиоматериалами."
            ],
            female: [
                "Прекрасно! Я рада видеть ваш прогресс в изучении русского языка. Вы делаете большие успехи!",
                "Замечательно! Ваш подход к изучению грамматики очень правильный. Продолжайте в том же духе!",
                "Отличная работа! Как ваш преподаватель, я горжусь вашими достижениями. Давайте двигаться дальше!",
                "Великолепно! Ваш словарный запас растет с каждым днем. Вы настоящий пример для других студентов!",
                "Потрясающе! Ваше понимание русского языка становится все глубже. Вы на правильном пути!"
            ]
        },
        en: {
            male: [
                "Excellent answer! I can see you have a solid foundation in English. Let's work on refining the details.",
                "Good work! Your grammar understanding is developing well. Try incorporating more complex structures.",
                "Interesting approach! As an experienced tutor, I can suggest several alternative ways to express this.",
                "Well done! Your vocabulary is impressive. Let's add a few more useful expressions to your repertoire.",
                "Great! Your pronunciation is improving. Keep practicing with audio materials to perfect your accent."
            ],
            female: [
                "Wonderful! I'm so happy to see your progress in English. You're making excellent strides!",
                "Fantastic! Your approach to grammar learning is spot on. Keep up this great work!",
                "Excellent job! As your tutor, I'm proud of your achievements. Let's keep moving forward!",
                "Amazing! Your vocabulary is growing every day. You're a great example for other students!",
                "Outstanding! Your understanding of English is becoming deeper. You're definitely on the right track!"
            ]
        },
        es: {
            male: [
                "¡Excelente respuesta! Veo que tienes una base sólida en español. Trabajemos en refinar los detalles.",
                "¡Buen trabajo! Tu comprensión gramatical se está desarrollando bien. Intenta incorporar estructuras más complejas.",
                "¡Enfoque interesante! Como tutor experimentado, puedo sugerir varias formas alternativas de expresar esto.",
                "¡Bien hecho! Tu vocabulario es impresionante. Agreguemos algunas expresiones útiles más a tu repertorio.",
                "¡Genial! Tu pronunciación está mejorando. Sigue practicando con materiales de audio para perfeccionar tu acento."
            ],
            female: [
                "¡Maravilloso! Estoy tan feliz de ver tu progreso en español. ¡Estás haciendo excelentes avances!",
                "¡Fantástico! Tu enfoque para aprender gramática es perfecto. ¡Sigue con este gran trabajo!",
                "¡Excelente trabajo! Como tu tutora, estoy orgullosa de tus logros. ¡Sigamos avanzando!",
                "¡Increíble! Tu vocabulario crece cada día. ¡Eres un gran ejemplo para otros estudiantes!",
                "¡Extraordinario! Tu comprensión del español se está volviendo más profunda. ¡Definitivamente vas por buen camino!"
            ]
        }
    };
    
    return responses[language][character][questionIndex];
}

// Vercel serverless function
module.exports = async (req, res) => {
    console.log('API chat.js вызван, метод:', req.method);
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        return res.json({ 
            message: 'API chat работает!',
            timestamp: new Date().toISOString(),
            status: 'ok'
        });
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

        // Получаем прогресс оценки
        const assessmentProgress = req.body.assessmentProgress || { currentQuestion: 0, completed: false };
        console.log('Получен прогресс оценки:', assessmentProgress);
        
        // Определяем, нужно ли дать следующий вопрос для оценки
        const userMessages = messages.filter(msg => msg.role === 'user');
        const shouldGiveAssessment = !assessmentProgress.completed && userMessages.length > 0; // Всегда даем следующий вопрос, если оценка не завершена
        console.log('Должен дать оценку:', shouldGiveAssessment, 'Завершена:', assessmentProgress.completed, 'Сообщений пользователя:', userMessages.length);
        
        let responseContent;
        let newAssessmentProgress = { ...assessmentProgress };
        
        if (shouldGiveAssessment) {
            // Даем следующий вопрос для оценки
            const questionIndex = assessmentProgress.currentQuestion;
            console.log('Даем вопрос оценки, индекс:', questionIndex);
            
            if (questionIndex < 5) {
                const question = assessmentQuestions[language][questionIndex];
                const assessmentResponse = getAssessmentResponse(language, character, questionIndex);
                
                responseContent = `Отлично! Вот следующий вопрос для оценки вашего уровня:\n\n**${question}**\n\n${assessmentResponse}`;
                
                // Обновляем прогресс
                newAssessmentProgress.currentQuestion = questionIndex + 1;
                if (newAssessmentProgress.currentQuestion >= 5) {
                    newAssessmentProgress.completed = true;
                    responseContent += `\n\n🎉 Поздравляю! Вы завершили оценку уровня. Теперь я лучше понимаю ваш уровень и могу предложить более персонализированные материалы для изучения.`;
                }
                console.log('Обновленный прогресс:', newAssessmentProgress);
            } else {
                // Если все вопросы заданы, используем обычные ответы
                const responses = demoResponses[language][character];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                responseContent = randomResponse;
                console.log('Все вопросы заданы, используем обычные ответы');
            }
        } else {
            // Используем обычные демо-ответы только если оценка завершена
            const responses = demoResponses[language][character];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            responseContent = randomResponse;
            console.log('Оценка завершена, используем обычные ответы');
        }
        
        res.json({
            message: responseContent,
            api: 'demo',
            mode: 'demo',
            character: character,
            assessmentProgress: newAssessmentProgress
        });

    } catch (error) {
        console.error('Server error:', error);
        
        // При любой ошибке используем скорринговые вопросы
        const { language, character } = req.body;
        const assessmentProgress = req.body.assessmentProgress || { currentQuestion: 0, completed: false };
        
        if (language && character && !assessmentProgress.completed) {
            // Даем следующий скорринговый вопрос
            const questionIndex = assessmentProgress.currentQuestion;
            if (questionIndex < 5) {
                const question = assessmentQuestions[language][questionIndex];
                const assessmentResponse = getAssessmentResponse(language, character, questionIndex);
                
                const responseContent = `Отлично! Вот следующий вопрос для оценки вашего уровня:\n\n**${question}**\n\n${assessmentResponse}`;
                
                const newAssessmentProgress = { 
                    currentQuestion: questionIndex + 1, 
                    completed: questionIndex + 1 >= 5 
                };
                
                res.json({
                    message: responseContent,
                    api: 'demo',
                    mode: 'error-fallback',
                    character: character,
                    assessmentProgress: newAssessmentProgress
                });
            } else {
                // Если все вопросы заданы, используем обычные ответы
                const responses = demoResponses[language][character];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                res.json({
                    message: randomResponse,
                    api: 'demo',
                    mode: 'error-fallback',
                    character: character,
                    assessmentProgress: { currentQuestion: 5, completed: true }
                });
            }
        } else {
            res.status(500).json({ 
                error: 'Внутренняя ошибка сервера',
                code: 'SERVER_ERROR'
            });
        }
    }
}; 