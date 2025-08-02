import requests
import json
from datetime import datetime

def test_barcelona_matches():
    """Тестирование получения матчей Barcelona"""
    
    print("🔍 Тестирование матчей Barcelona")
    print("=" * 50)
    
    api_key = "2e2ce24f4bf442b5bcb6bc35d920070b"
    headers = {'X-Auth-Token': api_key}
    
    # Barcelona ID = 81
    barcelona_url = "https://api.football-data.org/v4/teams/81/matches"
    params = {
        'dateFrom': '2025-08-01',
        'dateTo': '2026-07-31',
        'status': 'SCHEDULED'
    }
    
    try:
        response = requests.get(barcelona_url, headers=headers, params=params)
        print(f"Статус Barcelona: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            matches = data.get('matches', [])
            print(f"Найдено матчей Barcelona: {len(matches)}")
            
            if matches:
                print("\nПервые 10 матчей Barcelona:")
                for i, match in enumerate(matches[:10]):
                    home = match['homeTeam']['name']
                    away = match['awayTeam']['name']
                    date = match['utcDate'][:10]
                    competition = match['competition']['name']
                    print(f"  {i+1}. {home} vs {away} - {date} ({competition})")
                
                print(f"\nВсего матчей Barcelona: {len(matches)}")
            else:
                print("❌ Матчи не найдены")
        else:
            print(f"❌ Ошибка: {response.text}")
            
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")

if __name__ == '__main__':
    test_barcelona_matches() 