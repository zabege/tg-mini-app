import asyncio
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# Токен бота
BOT_TOKEN = "8280169857:AAGHVVwZ77kbFjzuvqPcRKyk96R2U8WsGuc"

async def get_user_id(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда для получения ID пользователя"""
    user = update.effective_user
    user_id = user.id
    username = user.username
    first_name = user.first_name
    last_name = user.last_name
    
    message = f"""
🆔 **Ваш Telegram ID:**

**ID:** `{user_id}`
**Username:** @{username}
**Имя:** {first_name}
**Фамилия:** {last_name}

Скопируйте ID и замените в файле `config.py`
    """
    
    await update.message.reply_text(message, parse_mode='Markdown')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Приветственное сообщение"""
    await update.message.reply_text(
        "🤖 Привет! Отправьте /id чтобы получить ваш Telegram ID"
    )

def main():
    """Запуск бота для получения ID"""
    print("🔍 Запуск бота для получения Telegram ID...")
    print("📱 Найдите бота в Telegram и отправьте /id")
    
    # Создаем приложение
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Добавляем обработчики
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("id", get_user_id))
    
    # Запускаем бота
    print("✅ Бот запущен! Отправьте /id в Telegram")
    application.run_polling()

if __name__ == '__main__':
    main() 