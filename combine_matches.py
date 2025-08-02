import json
from datetime import datetime

def combine_matches():
    """Объединение матчей Real Madrid и Barcelona с удалением дубликатов"""
    
    print("🔗 Объединение матчей Real Madrid и Barcelona")
    print("=" * 50)
    
    # Загружаем матчи Real Madrid
    with open('real_madrid_matches.json', 'r', encoding='utf-8') as f:
        real_madrid_matches = json.load(f)
    
    # Загружаем матчи Barcelona
    with open('barcelona_matches.json', 'r', encoding='utf-8') as f:
        barcelona_matches = json.load(f)
    
    print(f"📊 Загружено:")
    print(f"   Real Madrid: {len(real_madrid_matches)} матчей")
    print(f"   Barcelona: {len(barcelona_matches)} матчей")
    
    # Объединяем все матчи
    all_matches = real_madrid_matches + barcelona_matches
    
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
    
    print(f"\n✅ Результат:")
    print(f"   Всего уникальных матчей: {len(unique_matches)}")
    print(f"   Дубликаты убраны: {len(all_matches) - len(unique_matches)}")
    
    # Подсчитываем матчи каждой команды
    real_madrid_count = 0
    barcelona_count = 0
    
    for match in unique_matches:
        home = match['homeTeam']['name']
        away = match['awayTeam']['name']
        
        if 'Real Madrid' in home or 'Real Madrid' in away:
            real_madrid_count += 1
        if 'Barcelona' in home or 'Barcelona' in away:
            barcelona_count += 1
    
    print(f"   Матчи с Real Madrid: {real_madrid_count}")
    print(f"   Матчи с Barcelona: {barcelona_count}")
    
    # Выводим первые 20 матчей
    print(f"\n📅 Первые 20 матчей:")
    for i, match in enumerate(unique_matches[:20]):
        home = match['homeTeam']['name']
        away = match['awayTeam']['name']
        date = match['utcDate'][:10]
        competition = match['competition']['name']
        match_id = match['id']
        print(f"  {i+1:2d}. {home} vs {away} - {date} ({competition}) [ID: {match_id}]")
    
    # Сохраняем объединенные матчи
    with open('combined_matches.json', 'w', encoding='utf-8') as f:
        json.dump(unique_matches, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Объединенные матчи сохранены в combined_matches.json")
    
    # Генерируем код для вставки в football_api.py
    print(f"\n📝 Код для вставки в football_api.py:")
    print("=" * 50)
    print("real_matches = [")
    
    for i, match in enumerate(unique_matches):
        home = match['homeTeam']['name']
        away = match['awayTeam']['name']
        date = match['utcDate']
        competition = match['competition']['name']
        match_id = match['id']
        
        line = f"    {{'id': {match_id}, 'homeTeam': {{'name': '{home}'}}, 'awayTeam': {{'name': '{away}'}}, 'utcDate': '{date}', 'competition': {{'name': '{competition}'}}, 'status': 'SCHEDULED'}}"
        
        if i < len(unique_matches) - 1:
            line += ","
        
        print(line)
    
    print("]")
    print("=" * 50)

if __name__ == '__main__':
    combine_matches() 