import logging
import re
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes, ConversationHandler
from config import BOT_TOKEN, ALLOWED_USERS, POINTS_WINNER, POINTS_SCORE, POINTS_BOTH
from database import Database
from football_api import FootballAPI

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Состояния для ConversationHandler
CHOOSING_MATCH, CHOOSING_WINNER, ENTERING_SCORE = range(3)

class FootballBetBot:
    def __init__(self):
        self.db = Database()
        self.football_api = FootballAPI()
        self.user_states = {}  # Для хранения состояния пользователей
    
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /start"""
        user_id = update.effective_user.id
        
        # Проверяем доступ только если список ALLOWED_USERS не пустой
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            await update.message.reply_text("⛔ Доступ запрещен. Бот предназначен только для определенных пользователей.")
            return
        
        # Добавляем пользователя в базу данных
        user = update.effective_user
        self.db.add_user(user.id, user.first_name, user.username or "")
        
        welcome_text = f"""
🤖 **Добро пожаловать в Football Bet Bot!**

Привет, {user.first_name}! Я помогу тебе делать ставки на матчи Real Madrid и Barcelona.

**📋 Доступные команды:**
/calendar - 10 ближайших матчей
/next - Ближайший матч
/bet - Сделать ставку (10 ближайших)
/standings - Таблица результатов
/help - Справка

**🏆 Система баллов:**
• 1 балл за угаданного победителя
• 3 балла за угаданный точный счет
• 4 балла за угаданные и победителя, и счет

Начни с команды /calendar чтобы увидеть ближайшие матчи!
        """
        
        await update.message.reply_text(welcome_text, parse_mode='Markdown')
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /help"""
        user_id = update.effective_user.id
        
        # Проверяем доступ только если список ALLOWED_USERS не пустой
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            return
        
        help_text = """
🤖 **Football Bet Bot - Помощь**

📋 **Доступные команды:**

/start - Начать работу с ботом
/calendar - 10 ближайших матчей
/next - Ближайший матч
/bet - Разместить ставку (10 ближайших матчей)
/standings - Показать таблицу результатов
/help - Показать эту справку

🎯 **Как делать ставки:**
1. Используйте /bet для выбора матча
2. Выберите предполагаемого победителя
3. Введите предполагаемый счет (например: 2:1)

💰 **Система баллов:**
• 1 балл за угаданного победителя
• 3 балла за угаданный точный счет
• 4 балла за угаданные и победителя, и счет

⚽ Ставки принимаются только на предстоящие матчи!
        """
        
        await update.message.reply_text(help_text, parse_mode='Markdown')
    
    async def matches(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /matches"""
        user_id = update.effective_user.id
        
        # Проверяем доступ только если список ALLOWED_USERS не пустой
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            return
        
        await update.message.reply_text("🔍 Получаю список матчей...")
        
        # Получаем матчи из API
        matches = self.football_api.get_real_barcelona_matches()
        
        if not matches:
            await update.message.reply_text("❌ Не удалось получить список матчей. Попробуйте позже.")
            return
        
        # Сохраняем матчи в базу данных
        for match in matches:
            match_info = self.football_api.format_match_info(match)
            self.db.add_match(
                match_info['id'],
                match_info['home_team'],
                match_info['away_team'],
                match_info['match_date'],
                match_info['tournament']
            )
        
        # Формируем сообщение со списком матчей
        matches_text = "📅 **Предстоящие матчи Real Madrid vs Barcelona:**\n\n"
        
        for i, match in enumerate(matches, 1):
            match_info = self.football_api.format_match_info(match)
            matches_text += f"{i}. **{match_info['home_team']} vs {match_info['away_team']}**\n"
            matches_text += f"   📅 {match_info['formatted_date']}\n"
            matches_text += f"   🏆 {match_info['tournament']}\n\n"
        
        matches_text += "Используйте /bet для размещения ставки на любой из этих матчей!"
        
        await update.message.reply_text(matches_text, parse_mode='Markdown')
    
    async def calendar(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /calendar - показывает 10 ближайших матчей"""
        user_id = update.effective_user.id
        
        # Проверяем доступ только если список ALLOWED_USERS не пустой
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            return
        
        try:
            # Получаем 10 ближайших матчей
            matches = self.football_api.get_next_matches(10)
            
            if not matches:
                await update.message.reply_text("❌ Не удалось получить матчи.")
                return
            
            # Формируем текст
            calendar_text = "📅 **10 ближайших матчей:**\n\n"
            
            for i, match in enumerate(matches, 1):
                home_team = match['homeTeam']['name']
                away_team = match['awayTeam']['name']
                match_date = datetime.fromisoformat(match['utcDate'].replace('Z', '+00:00'))
                formatted_date = match_date.strftime('%d.%m.%Y %H:%M')
                competition = match['competition']['name']
                
                # Добавляем эмодзи для команд
                if 'Real Madrid' in home_team or 'Real Madrid' in away_team:
                    team_emoji = "⚪"
                elif 'Barcelona' in home_team or 'Barcelona' in away_team:
                    team_emoji = "🔵"
                else:
                    team_emoji = "⚽"
                
                calendar_text += f"{i}. {team_emoji} **{home_team} vs {away_team}**\n"
                calendar_text += f"   📅 {formatted_date} | 🏆 {competition}\n\n"
            
            await update.message.reply_text(calendar_text, parse_mode='Markdown')
            
        except Exception as e:
            print(f"Ошибка при получении календаря: {e}")
            await update.message.reply_text("❌ Произошла ошибка при получении календаря.")
    
    async def next_match(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /next - показывает ближайший матч"""
        user_id = update.effective_user.id
        
        # Проверяем доступ только если список ALLOWED_USERS не пустой
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            return
        
        try:
            # Получаем ближайший матч
            match = self.football_api.get_nearest_match()
            
            if not match:
                await update.message.reply_text("❌ Не удалось получить ближайший матч.")
                return
            
            # Формируем информацию о матче
            home_team = match['homeTeam']['name']
            away_team = match['awayTeam']['name']
            match_date = datetime.fromisoformat(match['utcDate'].replace('Z', '+00:00'))
            formatted_date = match_date.strftime('%d.%m.%Y %H:%M')
            competition = match['competition']['name']
            
            # Вычисляем время до матча
            now = datetime.now(match_date.tzinfo)
            time_until = match_date - now
            
            if time_until.days > 0:
                time_text = f"через {time_until.days} дней"
            elif time_until.seconds > 3600:
                hours = time_until.seconds // 3600
                time_text = f"через {hours} часов"
            else:
                minutes = time_until.seconds // 60
                time_text = f"через {minutes} минут"
            
            next_match_text = f"""
⚽ **БЛИЖАЙШИЙ МАТЧ**

🏟️ **{home_team} vs {away_team}**
📅 **Дата:** {formatted_date}
⏰ **До матча:** {time_text}
🏆 **Турнир:** {competition}

🎯 Готовы сделать ставку? Используйте /bet!
            """
            
            await update.message.reply_text(next_match_text, parse_mode='Markdown')
            
        except Exception as e:
            print(f"Ошибка при получении ближайшего матча: {e}")
            await update.message.reply_text("❌ Произошла ошибка при получении ближайшего матча.")
    
    async def bet(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /bet - показывает 10 ближайших матчей для ставок"""
        user_id = update.effective_user.id
        
        # Проверяем доступ только если список ALLOWED_USERS не пустой
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            return
        
        try:
            # Получаем 10 ближайших матчей для ставок
            matches = self.football_api.get_upcoming_matches_for_betting(10)
            
            if not matches:
                await update.message.reply_text("❌ Нет доступных матчей для ставок. Попробуйте позже.")
                return
            
            # Создаем клавиатуру с матчами
            keyboard = []
            for match in matches:
                home_team = match['homeTeam']['name']
                away_team = match['awayTeam']['name']
                match_date = datetime.fromisoformat(match['utcDate'].replace('Z', '+00:00'))
                formatted_date = match_date.strftime('%d.%m %H:%M')
                competition = match['competition']['name']
                
                match_text = f"{home_team} vs {away_team} - {formatted_date}"
                keyboard.append([InlineKeyboardButton(match_text, callback_data=f"match_{match['id']}")])
            
            keyboard.append([InlineKeyboardButton("❌ Отмена", callback_data="cancel")])
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(
                "⚽ **Выберите матч для ставки (10 ближайших):**",
                reply_markup=reply_markup,
                parse_mode='Markdown'
            )
            
            return CHOOSING_MATCH
            
        except Exception as e:
            print(f"Ошибка при получении матчей для ставок: {e}")
            await update.message.reply_text("❌ Произошла ошибка при получении матчей.")
            return ConversationHandler.END
    
    async def button_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик нажатий на кнопки"""
        query = update.callback_query
        await query.answer()
        
        user_id = update.effective_user.id
        
        # Проверяем доступ только если список ALLOWED_USERS не пустой
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            return
        
        if query.data == "cancel":
            await query.edit_message_text("❌ Ставка отменена.")
            return ConversationHandler.END
        
        if query.data.startswith("match_"):
            match_id = int(query.data.split("_")[1])
            
            # Получаем матч из API данных
            matches = self.football_api.get_upcoming_matches_for_betting(10)
            match = None
            
            for m in matches:
                if m['id'] == match_id:
                    match = m
                    break
            
            if not match:
                await query.edit_message_text("❌ Матч не найден.")
                return ConversationHandler.END
            
            # Сохраняем выбранный матч в контексте
            context.user_data['selected_match'] = match
            
            # Создаем клавиатуру для выбора победителя
            home_team = match['homeTeam']['name']
            away_team = match['awayTeam']['name']
            
            keyboard = [
                [InlineKeyboardButton(f"🏠 {home_team} (Домашняя)", callback_data="winner_home")],
                [InlineKeyboardButton("🤝 Ничья", callback_data="winner_draw")],
                [InlineKeyboardButton(f"✈️ {away_team} (Гостевая)", callback_data="winner_away")],
                [InlineKeyboardButton("❌ Отмена", callback_data="cancel")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            match_date = datetime.fromisoformat(match['utcDate'].replace('Z', '+00:00'))
            formatted_date = match_date.strftime('%d.%m.%Y %H:%M')
            competition = match['competition']['name']
            
            await query.edit_message_text(
                f"⚽ **{home_team} vs {away_team}**\n\n"
                f"📅 {formatted_date}\n"
                f"🏆 {competition}\n\n"
                "🎯 **Кто победит?**",
                reply_markup=reply_markup,
                parse_mode='Markdown'
            )
            
            return CHOOSING_WINNER
        
        elif query.data.startswith("winner_"):
            winner = query.data.split("_")[1]
            context.user_data['predicted_winner'] = winner
            
            match = context.user_data['selected_match']
            
            await query.edit_message_text(
                f"⚽ **{match['homeTeam']['name']} vs {match['awayTeam']['name']}**\n\n"
                f"🎯 Победитель: {self._get_winner_text(winner, match)}\n\n"
                "📊 **Введите предполагаемый счет (например: 2:1):**",
                parse_mode='Markdown'
            )
            
            return ENTERING_SCORE
    
    def _get_winner_text(self, winner, match):
        """Получение текстового представления победителя"""
        if winner == 'home':
            return f"🏠 {match['homeTeam']['name']}"
        elif winner == 'away':
            return f"✈️ {match['awayTeam']['name']}"
        else:
            return "🤝 Ничья"
    
    async def handle_score_input(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик ввода счета"""
        user_id = update.effective_user.id
        
        # Проверяем доступ только если список ALLOWED_USERS не пустой
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            return ConversationHandler.END
        
        score_text = update.message.text.strip()
        
        # Проверяем формат счета
        if not re.match(r'^\d+:\d+$', score_text):
            await update.message.reply_text(
                "❌ Неверный формат счета. Используйте формат X:Y (например: 2:1)"
            )
            return ENTERING_SCORE
        
        home_score, away_score = map(int, score_text.split(':'))
        
        if home_score < 0 or away_score < 0:
            await update.message.reply_text("❌ Счет не может быть отрицательным.")
            return ENTERING_SCORE
        
        # Сохраняем ставку в базу данных
        match = context.user_data['selected_match']
        predicted_winner = context.user_data['predicted_winner']
        
        # Сначала сохраняем матч в базу данных, если его там нет
        self.db.add_match(
            match['id'],
            match['homeTeam']['name'],
            match['awayTeam']['name'],
            match['utcDate'],
            match['competition']['name']
        )
        
        bet_id = self.db.add_bet(
            user_id,
            match['id'],
            predicted_winner,
            home_score,
            away_score
        )
        
        # Формируем подтверждение ставки
        match_date = datetime.fromisoformat(match['utcDate'].replace('Z', '+00:00'))
        formatted_date = match_date.strftime('%d.%m.%Y %H:%M')
        
        confirmation_text = f"""
✅ **Ставка размещена успешно!**

⚽ **Матч:** {match['homeTeam']['name']} vs {match['awayTeam']['name']}
📅 **Дата:** {formatted_date}
🏆 **Турнир:** {match['competition']['name']}

🎯 **Ваш прогноз:**
• Победитель: {self._get_winner_text(predicted_winner, match)}
• Счет: {home_score}:{away_score}

💰 **Возможные баллы:**
• 1 балл за угаданного победителя
• 3 балла за угаданный точный счет
• 4 балла за угаданные и победителя, и счет

Используйте /standings для просмотра таблицы результатов!
        """
        
        await update.message.reply_text(confirmation_text, parse_mode='Markdown')
        
        # Очищаем данные пользователя
        context.user_data.clear()
        
        return ConversationHandler.END
    
    async def standings(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Обработчик команды /standings"""
        user_id = update.effective_user.id
        
        # Проверяем доступ только если список ALLOWED_USERS не пустой
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            return
        
        standings = self.db.get_standings()
        
        if not standings:
            await update.message.reply_text("📊 Пока нет данных для таблицы результатов.")
            return
        
        standings_text = "🏆 **Таблица результатов:**\n\n"
        
        for i, (user_id, username, total_points, correct_winners, correct_scores, total_bets) in enumerate(standings, 1):
            display_name = username or f"Пользователь {user_id}"
            
            standings_text += f"{i}. **{display_name}**\n"
            standings_text += f"   📊 Всего баллов: {total_points}\n"
            standings_text += f"   ✅ Угаданных победителей: {correct_winners}\n"
            standings_text += f"   🎯 Угаданных счетов: {correct_scores}\n"
            standings_text += f"   📝 Всего ставок: {total_bets}\n\n"
        
        await update.message.reply_text(standings_text, parse_mode='Markdown')
    
    async def cancel(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Отмена операции"""
        await update.message.reply_text("❌ Операция отменена.")
        return ConversationHandler.END

def main():
    """Основная функция запуска бота"""
    if not BOT_TOKEN:
        print("❌ Ошибка: BOT_TOKEN не установлен в переменных окружения")
        return
    
    bot = FootballBetBot()
    
    # Создаем приложение
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Добавляем обработчики команд
    application.add_handler(CommandHandler("start", bot.start))
    application.add_handler(CommandHandler("help", bot.help_command))
    application.add_handler(CommandHandler("matches", bot.matches))
    application.add_handler(CommandHandler("calendar", bot.calendar))
    application.add_handler(CommandHandler("next", bot.next_match))
    application.add_handler(CommandHandler("standings", bot.standings))
    
    # Добавляем ConversationHandler для ставок
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("bet", bot.bet)],
        states={
            CHOOSING_MATCH: [CallbackQueryHandler(bot.button_handler)],
            CHOOSING_WINNER: [CallbackQueryHandler(bot.button_handler)],
            ENTERING_SCORE: [MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_score_input)]
        },
        fallbacks=[CommandHandler("cancel", bot.cancel)]
    )
    
    application.add_handler(conv_handler)
    
    # Запускаем бота
    print("🤖 Football Bet Bot запущен...")
    application.run_polling()

if __name__ == '__main__':
    main() 