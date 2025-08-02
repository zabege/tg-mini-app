import requests
import json
from datetime import datetime

def get_real_madrid_matches():
    """Получение матчей Real Madrid через API"""
    
    print("🔍 Получение матчей Real Madrid")
    print("=" * 50)
    
    api_key = "2e2ce24f4bf442b5bcb6bc35d920070b"
    headers = {'X-Auth-Token': api_key}
    
    # Real Madrid ID = 86
    real_madrid_url = "https://api.football-data.org/v4/teams/86/matches"
    params = {
        'dateFrom': '2025-08-01',
        'dateTo': '2026-07-31',
        'status': 'SCHEDULED'
    }
    
    try:
        response = requests.get(real_madrid_url, headers=headers, params=params)
        print(f"Статус Real Madrid: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            matches = data.get('matches', [])
            print(f"Найдено матчей Real Madrid: {len(matches)}")
            
            if matches:
                print("\nВсе матчи Real Madrid:")
                for i, match in enumerate(matches):
                    home = match['homeTeam']['name']
                    away = match['awayTeam']['name']
                    date = match['utcDate'][:10]
                    competition = match['competition']['name']
                    match_id = match['id']
                    print(f"  {i+1:2d}. {home} vs {away} - {date} ({competition}) [ID: {match_id}]")
                
                print(f"\nВсего матчей Real Madrid: {len(matches)}")
                
                # Сохраняем в JSON для копирования
                with open('real_madrid_matches.json', 'w', encoding='utf-8') as f:
                    json.dump(matches, f, indent=2, ensure_ascii=False)
                print("💾 Матчи сохранены в real_madrid_matches.json")
                
            else:
                print("❌ Матчи не найдены")
        else:
            print(f"❌ Ошибка: {response.text}")
            
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")

if __name__ == '__main__':
    get_real_madrid_matches() 