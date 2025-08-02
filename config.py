import os
from dotenv import load_dotenv

load_dotenv()

# Telegram Bot Token
BOT_TOKEN = "8280169857:AAGHVVwZ77kbFjzuvqPcRKyk96R2U8WsGuc"

# Разрешенные пользователи (Telegram ID)
# Убрали ограничения - теперь любой пользователь может использовать бота
ALLOWED_USERS = []  # Пустой список означает доступ для всех

# API для футбольных данных
FOOTBALL_API_KEY = os.getenv('FOOTBALL_API_KEY', '')
FOOTBALL_API_BASE_URL = 'https://api.football-data.org/v4'

# Команды Real Madrid и Barcelona
REAL_MADRID_ID = 86  # ID Real Madrid в API
BARCELONA_ID = 81    # ID Barcelona в API

# Система баллов
POINTS_WINNER = 1     # Балл за угаданного победителя
POINTS_SCORE = 3      # Баллы за угаданный счет
POINTS_BOTH = 4       # Баллы за угаданные и победителя, и счет

# Настройки базы данных
DATABASE_PATH = 'football_bets.db'

# Настройки уведомлений
NOTIFICATION_BEFORE_MATCH = 60  # минуты до матча 