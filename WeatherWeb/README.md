# Hava Proqnozu Veb Tətbiqi (Flask + Open-Meteo)

Müasir, təmiz və sürətli tək səhifəlik hava proqnozu veb tətbiqi (Python Flask backend + Glassmorphism frontend).

## 🛠 Texnologiyalar
- **Backend**: Python 3, Flask, Requests
- **Frontend**: HTML5 (Jinja2 şablonu), CSS3 (Glassmorphism, animasiyalar), Vanilla JavaScript (ES6+)
- **API**: Open-Meteo Geocoding & Forecast API (Pulsuz, açarsız)

## 📁 Layihə Strukturu
```text
WeatherWeb/
├── app.py                  # Flask serveri və /api/weather endpoint-i
├── requirements.txt        # Asılılıqlar (Flask, requests)
├── README.md               # Sənədləşmə
├── templates/
│   └── index.html          # Əsas HTML şablonu (Jinja2)
└── static/
    ├── app.js              # Frontend JavaScript məntiqi (Fetch /api/weather)
    └── style.css           # Glassmorphism dizaynı və rəng temaları
```

## ✨ Əsas Funksiyalar
1. **Flask Backend**:
   - `/` route-u `templates/index.html` səhifəsini render edir.
   - `/api/weather?city=ŞƏHƏR` endpoint-i `requests` kitabxanası ilə Open-Meteo Geocoding və Forecast API-lərini çağıraraq təmizlənmiş JSON qaytarır.
   - Koordinatlarla axtarış dəstəyi (`/api/weather?lat=...&lon=...`).
   - Xətaların aydın idarə olunması (400, 404, 502 status kodları və aydın mesajlar).
2. **Dizayn**:
   - **Arxa fon**: Tünd indiqo-bənövşəyi gecə göyü gradienti (`#131a2b`-dən `#232f4d`-ə) və künclərdə dumanlı tünd bənövşəyi işıq ləkələri.
   - **Mərkəzi şüşəvarı (glassmorphism) kart**: Yumşaq künclər (`border-radius: 28px`), incə zərif sərhəd və bulanıq arxa fon (`backdrop-filter`).
   - **Şriftlər**:
     - Temperatur böyük rəqəm kimi **"Fraunces"** serif şrifti ilə, yanında kiçik dərəcə (`°`) işarəsi.
     - Digər bütün mətnlər **"Inter"** şrifti ilə.
   - **Əsas vurğu rəngi**: İsti qızılı (`#e8a33d`) — "Axtar" düyməsi, günəş ikonunun şüaları, dərəcə işarəsi və s.
   - **3 Statistika kartı bir sırada**:
     - **Rütubət** (%)
     - **Külək** (km/s)
     - **Hiss olunan temperatur** (°C)
   - **6 Günlük üfüqi proqnoz**: Üfüqi sürüşən (scroll) kartlar zolağı.
   - **Fokuslanma effekti**: Axtarış xanasına fokuslandıqda aydın görünən qızılı outline (`2px solid #e8a33d`) və parıltı.
   - **Mobil uyğunluq**: Bütün ekran ölçülərinə (mobil, planşet, desktop) tam responsiv.

## 🚀 Quraşdırma və İşə Salma

1. Asılılıqları quraşdırın:
```bash
pip install -r requirements.txt
```

2. Flask serverini işə salın:
```bash
python app.py
```

3. Brauzerinizdə daxil olun:
```text
http://127.0.0.1:5000
```
