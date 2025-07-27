import React, { useState } from 'react';

// Добавим тип для поддерживаемых языков
type SupportedLanguage = 'en' | 'ru' | 'es';

// Добавим view для чата
enum View {
    MAIN_MENU = 4,
    CHAT = 5,
}

function App() {
    const [view, setView] = useState<View>(View.MAIN_MENU);
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage | null>(null);
    const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
    const [userInput, setUserInput] = useState('');

    // Тестовые вопросы для определения уровня
    const testPrompts: Record<SupportedLanguage, string> = {
        en: 'Let\'s start! Please answer: How long have you been learning English? Can you introduce yourself in English?',
        ru: 'Начнем! Пожалуйста, ответьте: Как давно вы изучаете русский язык? Можете представиться по-русски?',
        es: '¡Empecemos! Por favor, responda: ¿Cuánto tiempo lleva aprendiendo español? ¿Puede presentarse en español?',
    };

    // При выборе языка — переход в чат и отправка первого сообщения
    const handleLanguageClick = (lang: SupportedLanguage) => {
        setSelectedLanguage(lang);
        setView(View.CHAT);
        setChatMessages([
            { role: 'assistant', content: testPrompts[lang] }
        ]);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!userInput.trim()) return;

        const newMessage = { role: 'user', content: userInput };
        setChatMessages(prev => [...prev, newMessage]);
        setUserInput('');

        // Симуляция ответа ChatGPT
        setTimeout(() => {
            const response = { role: 'assistant', content: 'Спасибо за ваш ответ! Я помогу вам изучать язык.' };
            setChatMessages(prev => [...prev, response]);
        }, 1000);
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f5f5f5', 
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            {view === View.MAIN_MENU && (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    marginTop: 40 
                }}>
                    <h1 style={{ 
                        fontSize: 32, 
                        fontWeight: 700, 
                        marginBottom: 24,
                        color: '#333'
                    }}>
                        YourLanguageMate
                    </h1>
                    <h2 style={{ 
                        fontSize: 20, 
                        marginBottom: 16,
                        color: '#666'
                    }}>
                        Выберите язык для обучения:
                    </h2>
                    <div style={{ width: 240 }}>
                        <button 
                            style={{ 
                                width: '100%', 
                                padding: 12, 
                                marginBottom: 8, 
                                fontSize: 18,
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                cursor: 'pointer'
                            }} 
                            onClick={() => handleLanguageClick('en')}
                        >
                            Английский
                        </button>
                        <button 
                            style={{ 
                                width: '100%', 
                                padding: 12, 
                                marginBottom: 8, 
                                fontSize: 18,
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                cursor: 'pointer'
                            }} 
                            onClick={() => handleLanguageClick('ru')}
                        >
                            Русский
                        </button>
                        <button 
                            style={{ 
                                width: '100%', 
                                padding: 12, 
                                fontSize: 18,
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                cursor: 'pointer'
                            }} 
                            onClick={() => handleLanguageClick('es')}
                        >
                            Испанский
                        </button>
                    </div>
                </div>
            )}
            {view === View.CHAT && selectedLanguage && (
                <div style={{ 
                    maxWidth: 480, 
                    margin: '40px auto', 
                    border: '1px solid #eee', 
                    borderRadius: 12, 
                    padding: 24, 
                    background: '#fff' 
                }}>
                    <h2 style={{ 
                        textAlign: 'center', 
                        marginBottom: 16,
                        color: '#333'
                    }}>
                        Чат: {selectedLanguage === 'en' ? 'Английский' : selectedLanguage === 'ru' ? 'Русский' : 'Испанский'}
                    </h2>
                    <div style={{ 
                        minHeight: 120, 
                        marginBottom: 16,
                        maxHeight: 300,
                        overflowY: 'auto'
                    }}>
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} style={{ 
                                marginBottom: 12, 
                                textAlign: msg.role === 'assistant' ? 'left' : 'right' 
                            }}>
                                <span style={{ 
                                    background: msg.role === 'assistant' ? '#f0f0f0' : '#d1e7dd', 
                                    borderRadius: 8, 
                                    padding: 8, 
                                    display: 'inline-block',
                                    maxWidth: '80%'
                                }}>
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
                        <input
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            placeholder="Введите сообщение..."
                            style={{ 
                                flex: 1, 
                                padding: 8, 
                                borderRadius: 6, 
                                border: '1px solid #ccc' 
                            }}
                        />
                        <button 
                            type="submit" 
                            style={{ 
                                padding: '8px 16px', 
                                borderRadius: 6, 
                                background: '#007bff', 
                                color: '#fff', 
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Отправить
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default App;
