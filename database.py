import sqlite3
import json
from datetime import datetime
from config import DATABASE_PATH

class Database:
    def __init__(self):
        self.db_path = DATABASE_PATH
        self.init_database()
    
    def init_database(self):
        """Инициализация базы данных и создание таблиц"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Таблица пользователей
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    telegram_id INTEGER PRIMARY KEY,
                    username TEXT,
                    first_name TEXT,
                    last_name TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Таблица матчей
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS matches (
                    id INTEGER PRIMARY KEY,
                    api_match_id INTEGER UNIQUE,
                    home_team TEXT NOT NULL,
                    away_team TEXT NOT NULL,
                    match_date TIMESTAMP NOT NULL,
                    tournament TEXT,
                    status TEXT DEFAULT 'SCHEDULED',
                    home_score INTEGER,
                    away_score INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Таблица ставок
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS bets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    match_id INTEGER,
                    predicted_winner TEXT NOT NULL,
                    predicted_home_score INTEGER NOT NULL,
                    predicted_away_score INTEGER NOT NULL,
                    points_earned INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (telegram_id),
                    FOREIGN KEY (match_id) REFERENCES matches (id)
                )
            ''')
            
            # Таблица результатов пользователей
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_stats (
                    user_id INTEGER PRIMARY KEY,
                    total_points INTEGER DEFAULT 0,
                    correct_winners INTEGER DEFAULT 0,
                    correct_scores INTEGER DEFAULT 0,
                    total_bets INTEGER DEFAULT 0,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (telegram_id)
                )
            ''')
            
            conn.commit()
    
    def add_user(self, telegram_id, username=None, first_name=None, last_name=None):
        """Добавление нового пользователя"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO users (telegram_id, username, first_name, last_name)
                VALUES (?, ?, ?, ?)
            ''', (telegram_id, username, first_name, last_name))
            
            # Создаем запись в статистике пользователя
            cursor.execute('''
                INSERT OR IGNORE INTO user_stats (user_id)
                VALUES (?)
            ''', (telegram_id,))
            
            conn.commit()
    
    def get_user(self, telegram_id):
        """Получение информации о пользователе"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE telegram_id = ?', (telegram_id,))
            return cursor.fetchone()
    
    def add_match(self, api_match_id, home_team, away_team, match_date, tournament):
        """Добавление нового матча"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO matches 
                (api_match_id, home_team, away_team, match_date, tournament)
                VALUES (?, ?, ?, ?, ?)
            ''', (api_match_id, home_team, away_team, match_date, tournament))
            conn.commit()
            return cursor.lastrowid
    
    def get_upcoming_matches(self):
        """Получение предстоящих матчей"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM matches 
                WHERE status = 'SCHEDULED' AND match_date > datetime('now')
                ORDER BY match_date ASC
            ''')
            return cursor.fetchall()
    
    def get_match(self, match_id):
        """Получение информации о матче"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM matches WHERE id = ?', (match_id,))
            return cursor.fetchone()
    
    def add_bet(self, user_id, match_id, predicted_winner, predicted_home_score, predicted_away_score):
        """Добавление ставки"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO bets (user_id, match_id, predicted_winner, predicted_home_score, predicted_away_score)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, match_id, predicted_winner, predicted_home_score, predicted_away_score))
            conn.commit()
            return cursor.lastrowid
    
    def get_user_bet(self, user_id, match_id):
        """Получение ставки пользователя на конкретный матч"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM bets WHERE user_id = ? AND match_id = ?
            ''', (user_id, match_id))
            return cursor.fetchone()
    
    def update_match_result(self, match_id, home_score, away_score, status='FINISHED'):
        """Обновление результата матча"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE matches 
                SET home_score = ?, away_score = ?, status = ?
                WHERE id = ?
            ''', (home_score, away_score, status, match_id))
            conn.commit()
    
    def calculate_bet_points(self, bet_id):
        """Расчет баллов за ставку"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Получаем ставку и результат матча
            cursor.execute('''
                SELECT b.*, m.home_score, m.away_score 
                FROM bets b 
                JOIN matches m ON b.match_id = m.id 
                WHERE b.id = ?
            ''', (bet_id,))
            
            bet_data = cursor.fetchone()
            if not bet_data:
                return 0
            
            # Определяем победителя матча
            if bet_data[10] > bet_data[11]:  # home_score > away_score
                actual_winner = 'home'
            elif bet_data[10] < bet_data[11]:  # home_score < away_score
                actual_winner = 'away'
            else:
                actual_winner = 'draw'
            
            points = 0
            
            # Проверяем угаданного победителя
            if bet_data[4] == actual_winner:  # predicted_winner
                points += 1
            
            # Проверяем угаданный счет
            if bet_data[5] == bet_data[10] and bet_data[6] == bet_data[11]:  # predicted scores
                points += 3
            
            # Обновляем баллы в ставке
            cursor.execute('''
                UPDATE bets SET points_earned = ? WHERE id = ?
            ''', (points, bet_id))
            
            # Обновляем статистику пользователя
            user_id = bet_data[1]
            cursor.execute('''
                UPDATE user_stats 
                SET total_points = total_points + ?,
                    correct_winners = correct_winners + ?,
                    correct_scores = correct_scores + ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            ''', (
                points,
                1 if bet_data[4] == actual_winner else 0,
                1 if bet_data[5] == bet_data[10] and bet_data[6] == bet_data[11] else 0,
                user_id
            ))
            
            conn.commit()
            return points
    
    def get_standings(self):
        """Получение таблицы результатов"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT u.username, u.first_name, u.last_name, us.*
                FROM user_stats us
                JOIN users u ON us.user_id = u.telegram_id
                ORDER BY us.total_points DESC, us.correct_scores DESC
            ''')
            return cursor.fetchall()
    
    def get_user_stats(self, user_id):
        """Получение статистики конкретного пользователя"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM user_stats WHERE user_id = ?
            ''', (user_id,))
            return cursor.fetchone() 