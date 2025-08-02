# Football Bet Bot

Telegram бот для ставок на футбольные матчи с участием "Реал Мадрида" и "Барселоны".

## 🚀 Деплой на Vercel

### 1. Подготовка проекта

1. Убедитесь, что у вас есть все необходимые файлы:
   - `api/bot.py` - основной файл бота
   - `vercel.json` - конфигурация Vercel
   - `requirements.txt` - зависимости Python
   - `config.py` - конфигурация
   - `database.py` - база данных
   - `football_api.py` - API для футбольных данных

2. Создайте `.env` файл с переменными окружения:
```env
BOT_TOKEN=ваш_токен_бота
FOOTBALL_API_KEY=ваш_ключ_api
ALLOWED_USERS=[]  # Пустой список для доступа всем
```

### 2. Деплой на Vercel

1. **Установите Vercel CLI:**
```bash
npm i -g vercel
```

2. **Войдите в аккаунт Vercel:**
```bash
vercel login
```

3. **Деплой проекта:**
```bash
vercel
```

4. **Настройте переменные окружения в Vercel Dashboard:**
   - Перейдите в настройки проекта
   - Добавьте переменные:
     - `BOT_TOKEN`
     - `FOOTBALL_API_KEY`
     - `ALLOWED_USERS` (пустой массив `[]`)

### 3. Настройка Webhook

После деплоя получите URL вашего приложения и установите webhook:

1. **Получите URL приложения** (например: `https://your-app.vercel.app`)

2. **Установите webhook:**
```
https://your-app.vercel.app/set-webhook
```

3. **Или вручную через API:**
```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app.vercel.app/webhook"}'
```

## 🎯 Команды бота

- `/start` - приветствие и инструкция
- `/calendar` - 10 ближайших матчей
- `/next` - ближайший матч
- `/bet` - сделать ставку
- `/standings` - таблица результатов
- `/help` - справка

## 💰 Система баллов

- **1 балл** за угаданного победителя или ничью
- **3 балла** за угаданный точный счет
- **4 балла** за угаданные и победителя, и счет
- **0 баллов** если ничего не угадано

## 🏗️ Структура проекта

```
├── api/
│   └── bot.py          # Основной файл бота для Vercel
├── config.py           # Конфигурация
├── database.py         # База данных (JSON)
├── football_api.py     # API для футбольных данных
├── requirements.txt    # Зависимости Python
├── vercel.json         # Конфигурация Vercel
└── README.md           # Документация
```

## 🔧 Локальная разработка

1. **Установите зависимости:**
```bash
pip install -r requirements.txt
```

2. **Создайте `.env` файл:**
```env
BOT_TOKEN=ваш_токен_бота
FOOTBALL_API_KEY=ваш_ключ_api
ALLOWED_USERS=[]
```

3. **Запустите бота:**
```bash
python api/bot.py
```

## 📝 Примечания

- Бот использует JSON файл для хранения данных (подходит для Vercel)
- Webhook автоматически устанавливается при первом запросе к `/set-webhook`
- Все команды работают через webhook (не polling)
- База данных сохраняется в файл `bot_data.json`

## 🚨 Ограничения Vercel

- **Холодный старт:** Первый запрос может быть медленным
- **Таймаут:** Функции ограничены 10 секундами
- **Память:** Ограниченная память для выполнения
- **Файловая система:** Только для чтения (кроме `/tmp`)

## 🔄 Обновления

Для обновления бота на Vercel:
```bash
vercel --prod
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что webhook установлен правильно
3. Проверьте переменные окружения
4. Убедитесь, что бот не заблокирован в Telegram 

### **Шаг 6: Проверьте переменные окружения в Vercel Dashboard**

**ВАЖНО:** Вам нужно вручную добавить переменные окружения в Vercel Dashboard:

1. **Откройте** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Найдите** проект `tg-mini-19evivghx-evgeniis-projects-0adade2a`
3. **Перейдите** в **Settings** → **Environment Variables**
4. **Добавьте** каждую переменную:

#### **Переменная 1:**
- **Name:** `BOT_TOKEN`
- **Value:** `8280169857:AAGHVVwZ77kbFjzuvqPcRKyk96R2U8WsGuc`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

#### **Переменная 2:**
- **Name:** `FOOTBALL_API_KEY`
- **Value:** `2e2ce24f4bf442b5bcb6bc35d920070b`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

#### **Переменная 3:**
- **Name:** `ALLOWED_USERS`
- **Value:** `[]`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

### **Шаг 7: После добавления переменных**

После того как вы добавите переменные в Vercel Dashboard:

1. **Перезапустите деплой** в Vercel Dashboard:
   - Перейдите в **Deployments**
   - Найдите последний деплой
   - Нажмите **⋮** → **Redeploy**

2. **Или через CLI:**
```bash
<code_block_to_apply_changes_from>
```

3. **Проверьте бота в Telegram:**
   - Отправьте команду `/start`
   - Бот должен ответить

### **Шаг 8: Проверка через браузер**

Попробуйте открыть в браузере:
```
https://tg-mini-19evivghx-evgeniis-projects-0adade2a.vercel.app/
```

Вы должны увидеть:
```json
{"status": "ok", "message": "Football Bet Bot is running!"}
```

**Главная проблема:** Переменные окружения не настроены в Vercel Dashboard. После их добавления бот заработает! 🚀 