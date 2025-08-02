import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from football_api import FootballAPI

def test_full_api():
    """Тестирование полного API с Real Madrid и Barcelona"""
    
    print("🔍 Тестирование полного API")
    print("=" * 50)
    
    api = FootballAPI()
    matches = api.get_real_barcelona_matches()
    
    print(f"\n📊 Результат:")
    print(f"Всего матчей: {len(matches)}")
    
    if matches:
        print(f"\nПервые 15 матчей:")
        for i, match in enumerate(matches[:15]):
            home = match['homeTeam']['name']
            away = match['awayTeam']['name']
            date = match['utcDate'][:10]
            competition = match['competition']['name']
            print(f"  {i+1:2d}. {home} vs {away} - {date} ({competition})")
        
        # Подсчитаем матчи каждой команды
        real_madrid_count = 0
        barcelona_count = 0
        
        for match in matches:
            home = match['homeTeam']['name']
            away = match['awayTeam']['name']
            
            if 'Real Madrid' in home or 'Real Madrid' in away:
                real_madrid_count += 1
            if 'Barcelona' in home or 'Barcelona' in away:
                barcelona_count += 1
        
        print(f"\n📈 Статистика:")
        print(f"   Матчи с Real Madrid: {real_madrid_count}")
        print(f"   Матчи с Barcelona: {barcelona_count}")
        print(f"   Всего уникальных матчей: {len(matches)}")

if __name__ == '__main__':
    test_full_api() 