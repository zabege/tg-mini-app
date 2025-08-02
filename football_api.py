import requests
import json
from datetime import datetime, timedelta
from config import FOOTBALL_API_KEY, FOOTBALL_API_BASE_URL, REAL_MADRID_ID, BARCELONA_ID

class FootballAPI:
    def __init__(self):
        self.api_key = FOOTBALL_API_KEY
        self.base_url = FOOTBALL_API_BASE_URL
        self.headers = {
            'X-Auth-Token': self.api_key
        } if self.api_key else {}
    
    def get_team_matches(self, team_id, days=30):
        """Получение матчей команды на ближайшие дни"""
        if not self.api_key:
            return self._get_demo_matches()
        
        try:
            # Получаем матчи команды
            url = f"{self.base_url}/teams/{team_id}/matches"
            params = {
                'dateFrom': datetime.now().strftime('%Y-%m-%d'),
                'dateTo': (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d'),
                'status': 'SCHEDULED'
            }
            
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            
            data = response.json()
            return data.get('matches', [])
            
        except requests.RequestException as e:
            print(f"Ошибка API: {e}")
            return self._get_demo_matches()
    
    def get_real_barcelona_matches(self):
        """Получение матчей Real Madrid и Barcelona с августа 2025 по июль 2026"""
        if not self.api_key:
            return self._get_demo_matches()
        
        try:
            all_matches = []
            
            # Получаем матчи Real Madrid
            print("🔍 Получаю матчи Real Madrid...")
            real_madrid_matches = self._get_team_matches(REAL_MADRID_ID, "2025-08-01", "2026-07-31")
            all_matches.extend(real_madrid_matches)
            
            # Получаем матчи Barcelona
            print("🔍 Получаю матчи Barcelona...")
            barcelona_matches = self._get_team_matches(BARCELONA_ID, "2025-08-01", "2026-07-31")
            all_matches.extend(barcelona_matches)
            
            # Убираем дубликаты (матчи между Real Madrid и Barcelona)
            unique_matches = []
            seen_match_ids = set()
            
            for match in all_matches:
                match_id = match['id']
                if match_id not in seen_match_ids:
                    seen_match_ids.add(match_id)
                    unique_matches.append(match)
            
            # Сортируем по дате
            unique_matches.sort(key=lambda x: x['utcDate'])
            
            print(f"✅ Найдено {len(unique_matches)} матчей")
            return unique_matches
            
        except requests.RequestException as e:
            print(f"Ошибка API: {e}")
            return self._get_demo_matches()
    
    def _get_team_matches(self, team_id, date_from, date_to):
        """Получение матчей команды за период"""
        url = f"{self.base_url}/teams/{team_id}/matches"
        params = {
            'dateFrom': date_from,
            'dateTo': date_to,
            'status': 'SCHEDULED'
        }
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        return data.get('matches', [])
    
    def get_match_result(self, match_id):
        """Получение результата матча"""
        if not self.api_key:
            return None
        
        try:
            url = f"{self.base_url}/matches/{match_id}"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            data = response.json()
            match = data.get('match', {})
            
            if match.get('status') == 'FINISHED':
                return {
                    'home_score': match['score']['fullTime']['home'],
                    'away_score': match['score']['fullTime']['away']
                }
            
            return None
            
        except requests.RequestException as e:
            print(f"Ошибка получения результата матча: {e}")
            return None
    
    def _get_demo_matches(self):
        """Демо-данные матчей для тестирования (август 2025 - июль 2026)"""
        demo_matches = [
            {
                'id': 1,
                'homeTeam': {'name': 'Real Madrid'},
                'awayTeam': {'name': 'Atletico Madrid'},
                'utcDate': '2025-08-15T20:00:00Z',
                'competition': {'name': 'La Liga'},
                'status': 'SCHEDULED'
            },
            {
                'id': 2,
                'homeTeam': {'name': 'Barcelona'},
                'awayTeam': {'name': 'Sevilla'},
                'utcDate': '2025-08-22T21:00:00Z',
                'competition': {'name': 'La Liga'},
                'status': 'SCHEDULED'
            },
            {
                'id': 3,
                'homeTeam': {'name': 'Real Madrid'},
                'awayTeam': {'name': 'Barcelona'},
                'utcDate': '2025-09-06T20:00:00Z',
                'competition': {'name': 'La Liga'},
                'status': 'SCHEDULED'
            },
            {
                'id': 4,
                'homeTeam': {'name': 'Barcelona'},
                'awayTeam': {'name': 'Valencia'},
                'utcDate': '2025-09-20T21:00:00Z',
                'competition': {'name': 'La Liga'},
                'status': 'SCHEDULED'
            },
            {
                'id': 5,
                'homeTeam': {'name': 'Real Madrid'},
                'awayTeam': {'name': 'Villarreal'},
                'utcDate': '2025-10-04T20:00:00Z',
                'competition': {'name': 'La Liga'},
                'status': 'SCHEDULED'
            },
            {
                'id': 6,
                'homeTeam': {'name': 'Barcelona'},
                'awayTeam': {'name': 'Real Madrid'},
                'utcDate': '2025-10-18T21:00:00Z',
                'competition': {'name': 'Copa del Rey'},
                'status': 'SCHEDULED'
            },
            {
                'id': 7,
                'homeTeam': {'name': 'Real Madrid'},
                'awayTeam': {'name': 'Athletic Bilbao'},
                'utcDate': '2025-11-01T20:00:00Z',
                'competition': {'name': 'La Liga'},
                'status': 'SCHEDULED'
            },
            {
                'id': 8,
                'homeTeam': {'name': 'Barcelona'},
                'awayTeam': {'name': 'Real Sociedad'},
                'utcDate': '2025-11-15T21:00:00Z',
                'competition': {'name': 'La Liga'},
                'status': 'SCHEDULED'
            },
            {
                'id': 9,
                'homeTeam': {'name': 'Real Madrid'},
                'awayTeam': {'name': 'Barcelona'},
                'utcDate': '2025-12-06T20:00:00Z',
                'competition': {'name': 'Champions League'},
                'status': 'SCHEDULED'
            },
            {
                'id': 10,
                'homeTeam': {'name': 'Barcelona'},
                'awayTeam': {'name': 'Real Madrid'},
                'utcDate': '2026-01-10T21:00:00Z',
                'competition': {'name': 'La Liga'},
                'status': 'SCHEDULED'
            }
        ]
        return demo_matches
    
    def format_match_info(self, match):
        """Форматирование информации о матче для отображения"""
        home_team = match['homeTeam']['name']
        away_team = match['awayTeam']['name']
        
        # Парсинг даты
        match_date = datetime.fromisoformat(match['utcDate'].replace('Z', '+00:00'))
        formatted_date = match_date.strftime('%d.%m.%Y %H:%M')
        
        tournament = match.get('competition', {}).get('name', 'Неизвестный турнир')
        
        return {
            'id': match['id'],
            'home_team': home_team,
            'away_team': away_team,
            'match_date': match_date,
            'formatted_date': formatted_date,
            'tournament': tournament,
            'status': match['status']
        } 