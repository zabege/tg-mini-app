import requests
import json
from datetime import datetime

def test_football_api():
    """Тестирование football-data.org API"""
    
    print("🔍 Тестирование football-data.org API")
    print("=" * 50)
    
    # Без API ключа (ограниченный доступ)
    print("1. Тест без API ключа (ограниченный доступ):")
    url = "https://api.football-data.org/v4/matches"
    headers = {}
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Найдено матчей: {len(data.get('matches', []))}")
            print("✅ API доступен без ключа")
        else:
            print(f"❌ Ошибка: {response.text}")
            
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
    
    print("\n" + "=" * 50)
    
    # С API ключом (если есть)
    api_key = input("Введите ваш API ключ (или нажмите Enter для пропуска): ").strip()
    
    if api_key:
        print(f"\n2. Тест с API ключом:")
        headers = {'X-Auth-Token': api_key}
        
        try:
            # Тест получения матчей Real Madrid
            real_madrid_url = "https://api.football-data.org/v4/teams/86/matches"
            params = {
                'dateFrom': '2025-08-01',
                'dateTo': '2026-07-31',
                'status': 'SCHEDULED'
            }
            
            response = requests.get(real_madrid_url, headers=headers, params=params)
            print(f"Статус Real Madrid: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                matches = data.get('matches', [])
                print(f"Найдено матчей Real Madrid: {len(matches)}")
                
                if matches:
                    print("Первые 3 матча:")
                    for i, match in enumerate(matches[:3]):
                        home = match['homeTeam']['name']
                        away = match['awayTeam']['name']
                        date = match['utcDate'][:10]
                        competition = match['competition']['name']
                        print(f"  {i+1}. {home} vs {away} - {date} ({competition})")
            else:
                print(f"❌ Ошибка: {response.text}")
                
        except Exception as e:
            print(f"❌ Ошибка подключения: {e}")
    
    print("\n" + "=" * 50)
    print("📋 Инструкция по получению API ключа:")
    print("1. Зайдите на https://www.football-data.org/")
    print("2. Зарегистрируйтесь (бесплатно)")
    print("3. Получите API ключ в личном кабинете")
    print("4. Добавьте ключ в config.py как FOOTBALL_API_KEY")
    print("5. Перезапустите бота")

if __name__ == '__main__':
    test_football_api() 