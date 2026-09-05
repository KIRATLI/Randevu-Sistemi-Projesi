def generate_schedule_text(schedule):
    """Summarize schedule days"""
    from collections import defaultdict

    # 1. Günlerin sıralama anahtarı
    day_order = {
        'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
        'friday': 4, 'saturday': 5, 'sunday': 6
    }
    day_names_tr = {
        'monday': 'Pazartesi', 'tuesday': 'Salı', 'wednesday': 'Çarşamba',
        'thursday': 'Perşembe', 'friday': 'Cuma', 'saturday': 'Cumartesi', 'sunday': 'Pazar'
    }

    # 2. Aynı saatlere sahip günleri grupla
    # Örn: {("09:00", "17:00"): ["monday", "tuesday", "thursday", "friday"]}
    groups = defaultdict(list)
    slots = schedule.working_hours.filter(is_enabled=True)

    for slot in slots:
        time_key = (slot.start_time.strftime('%H:%M'), slot.end_time.strftime('%H:%M'))
        groups[time_key].append(slot.day)

    final_sentences = []

    for (start, end), days in groups.items():
        # Günleri haftalık sıraya göre diz
        sorted_days = sorted(list(set(days)), key=lambda x: day_order[x])

        # Ardışık grupları bul (Sequence detection)
        ranges = []
        if not sorted_days: continue

        current_range = [sorted_days[0]]

        for i in range(1, len(sorted_days)):
            prev_idx = day_order[sorted_days[i-1]]
            curr_idx = day_order[sorted_days[i]]

            if curr_idx == prev_idx + 1:
                current_range.append(sorted_days[i])
            else:
                ranges.append(current_range)
                current_range = [sorted_days[i]]
        ranges.append(current_range)

        # Metne dökme (Pazartesi-Cuma veya Pazartesi, Salı gibi)
        formatted_days = []
        for r in ranges:
            if len(r) >= 3: # 3 veya daha fazla ardışık gün varsa "-" kullan
                formatted_days.append(f"{day_names_tr[r[0]]}-{day_names_tr[r[-1]]}")
            else: # 1 veya 2 gün varsa virgülle ayır
                formatted_days.append(", ".join([day_names_tr[d] for d in r]))

        day_text = ", ".join(formatted_days)
        final_sentences.append(f"{day_text} {start}-{end}")

    tr_to_en = {v.lower(): k for k, v in day_names_tr.items()}

    final_sentences.sort(key=lambda x: day_order[
        tr_to_en.get(x.split(' ')[0].lower() if '-' not in x else x.split('-')[0].lower(), 'monday')
    ])

    return " | ".join(final_sentences) if final_sentences else "Çalışma saati tanımlanmamış."