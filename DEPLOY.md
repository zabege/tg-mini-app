# 🚀 Деплой бота на Railway

## Шаги для деплоя:

### 1. Подготовка
- Убедитесь, что все файлы сохранены
- Проверьте, что `requirements.txt` содержит все зависимости
- Убедитесь, что `Procfile` создан

### 2. Создание репозитория на GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Деплой на Railway
1. Зайдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите "Deploy from GitHub repo"
5. Выберите ваш репозиторий
6. Railway автоматически определит Python проект

### 4. Настройка переменных окружения
В Railway Dashboard:
1. Перейдите в раздел "Variables"
2. Добавьте переменные:
                  - `BOT_TOKEN` = `8280169857:AAFy3fX9gC3GtXv31hyvCRVwhTXKbwX0h4Y`
   - `FOOTBALL_API_KEY` = `2e2ce24f4bf442b5bcb6bc35d920070b`
   - `ALLOWED_USERS` = (оставьте пустым для публичного доступа)

### 5. Запуск
Railway автоматически запустит бота после настройки переменных.

## ✅ Проверка работы
1. Найдите URL вашего приложения в Railway Dashboard
2. Бот должен автоматически начать работать
3. Проверьте в Telegram: `/start`

## 🔧 Возможные проблемы
- Если бот не отвечает, проверьте логи в Railway Dashboard
- Убедитесь, что все переменные окружения настроены правильно
- Проверьте, что webhook не активен (удалите его если нужно) 