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
        """Получение матчей между Real Madrid и Barcelona"""
        if not self.api_key:
            return self._get_demo_matches()
        
        try:
            # Получаем матчи между командами
            url = f"{self.base_url}/teams/{REAL_MADRID_ID}/matches"
            params = {
                'dateFrom': datetime.now().strftime('%Y-%m-%d'),
                'dateTo': (datetime.now() + timedelta(days=90)).strftime('%Y-%m-%d'),
                'status': 'SCHEDULED'
            }
            
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            
            data = response.json()
            matches = data.get('matches', [])
            
            # Фильтруем матчи с Barcelona
            real_barca_matches = []
            for match in matches:
                if (match['homeTeam']['id'] == BARCELONA_ID or 
                    match['awayTeam']['id'] == BARCELONA_ID):
                    real_barca_matches.append(match)
            
            return real_barca_matches
            
        except requests.RequestException as e:
            print(f"Ошибка API: {e}")
            return self._get_demo_matches()
    
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
        """Демо-данные матчей для тестирования"""
        demo_matches = [
            {
                'id': 1,
                'homeTeam': {'name': 'Real Madrid'},
                'awayTeam': {'name': 'Barcelona'},
                'utcDate': (datetime.now() + timedelta(days=7)).isoformat(),
                'competition': {'name': 'La Liga'},
                'status': 'SCHEDULED'
            },
            {
                'id': 2,
                'homeTeam': {'name': 'Barcelona'},
                'awayTeam': {'name': 'Real Madrid'},
                'utcDate': (datetime.now() + timedelta(days=14)).isoformat(),
                'competition': {'name': 'Copa del Rey'},
                'status': 'SCHEDULED'
            },
            {
                'id': 3,
                'homeTeam': {'name': 'Real Madrid'},
                'awayTeam': {'name': 'Barcelona'},
                'utcDate': (datetime.now() + timedelta(days=21)).isoformat(),
                'competition': {'name': 'Champions League'},
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