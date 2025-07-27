function App() {
    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: 'white', 
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            color: 'black'
        }}>
            <h1>YourLanguageMate работает!</h1>
            <p>Если вы видите этот текст, значит React работает правильно.</p>
            <button 
                style={{ 
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => alert('Кнопка работает!')}
            >
                Нажми меня
            </button>
        </div>
    );
}

export default App;
