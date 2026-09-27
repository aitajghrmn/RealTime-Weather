"""
Hava Proqnozu Tətbiqi - Flask Backend
API: Open-Meteo Geocoding & Forecast API
"""

from flask import Flask, render_template, request, jsonify
import requests
import urllib.parse

app = Flask(__name__)

# Open-Meteo API URL-ləri
GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast"
REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

REQUEST_TIMEOUT = 10  # saniyə


@app.route("/")
def index():
    """Əsas səhifəni render edir."""
    return render_template("index.html")


@app.route("/api/weather", methods=["GET"])
def get_weather():
    """
    Şəhər adına (və ya koordinatlara) əsasən hava proqnozunu gətirən JSON endpoint.
    Parametrlər:
        city: Şəhər adı (məs: Bakı, London, İstanbul)
        lat, lon: (istəyə bağlı) birbaşa koordinatlar
    """
    city = request.args.get("city", "").strip()
    lat = request.args.get("lat", "").strip()
    lon = request.args.get("lon", "").strip()

    country_name = ""
    city_name = city
    timezone = "auto"

    # 1. Koordinatları təyin et
    if lat and lon:
        try:
            latitude = float(lat)
            longitude = float(lon)
            # Koordinatlara uyğun şəhər adını təyin etməyə çalış
            try:
                rev_res = requests.get(
                    REVERSE_GEOCODE_URL,
                    params={"latitude": latitude, "longitude": longitude, "localityLanguage": "az"},
                    timeout=5
                )
                if rev_res.status_code == 200:
                    rev_data = rev_res.json()
                    city_name = rev_data.get("city") or rev_data.get("locality") or rev_data.get("principalSubdivision") or "Cari Məkan"
                    country_name = rev_data.get("countryName", "")
            except Exception:
                city_name = "Cari Məkan"
        except ValueError:
            return jsonify({"error": "Yanlış koordinat formatı."}), 400

    elif city:
        # Open-Meteo Geocoding API ilə şəhərin en və uzunluğunu tap
        try:
            geo_response = requests.get(
                GEOCODING_API_URL,
                params={"name": city, "count": 1, "language": "az"},
                timeout=REQUEST_TIMEOUT
            )
            geo_response.raise_for_status()
            geo_data = geo_response.json()
        except requests.exceptions.RequestException as e:
            return jsonify({
                "error": "Geocoding xidməti ilə əlaqə qurularkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
            }), 502

        results = geo_data.get("results")
        if not results or len(results) == 0:
            return jsonify({
                "error": f"'{city}' adlı şəhər tapılmadı. Zəhmət olmasa şəhər adını düzgün yazdığınızdan əmin olun."
            }), 404

        best_match = results[0]
        latitude = best_match.get("latitude")
        longitude = best_match.get("longitude")
        city_name = best_match.get("name", city)
        country_name = best_match.get("country", "")
        timezone = best_match.get("timezone", "auto")

    else:
        return jsonify({"error": "Şəhər adı və ya koordinatlar qeyd edilməlidir."}), 400

    # 2. Open-Meteo Forecast API ilə cari və 6 günlük hava datasını çək
    try:
        forecast_params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
            "daily": "weather_code,temperature_2m_max,temperature_2m_min",
            "timezone": timezone
        }
        forecast_response = requests.get(
            FORECAST_API_URL,
            params=forecast_params,
            timeout=REQUEST_TIMEOUT
        )
        forecast_response.raise_for_status()
        forecast_data = forecast_response.json()
    except requests.exceptions.RequestException:
        return jsonify({
            "error": "Hava proqnozu məlumatlarını əldə etmək mümkün olmadı. İnternet bağlantınızı yoxlayın."
        }), 502

    current = forecast_data.get("current", {})
    daily = forecast_data.get("daily", {})

    if not current or not daily:
        return jsonify({"error": "Hava xidməti natamam məlumat qaytardı."}), 502

    times = daily.get("time", [])
    weather_codes = daily.get("weather_code", [])
    max_temps = daily.get("temperature_2m_max", [])
    min_temps = daily.get("temperature_2m_min", [])

    # Bu gün üçün Maks / Min
    today_max = round(max_temps[0]) if max_temps else None
    today_min = round(min_temps[0]) if min_temps else None

    # 6 günlük proqnoz (index 1-dən 6-ya qədər)
    daily_forecast = []
    total_days = min(len(times), 7)
    for i in range(1, total_days):
        daily_forecast.append({
            "date": times[i],
            "weather_code": weather_codes[i] if i < len(weather_codes) else 0,
            "temp_max": round(max_temps[i]) if i < len(max_temps) else None,
            "temp_min": round(min_temps[i]) if i < len(min_temps) else None
        })

    response_payload = {
        "city": city_name,
        "country": country_name,
        "latitude": latitude,
        "longitude": longitude,
        "current": {
            "temperature": round(current.get("temperature_2m", 0)),
            "apparent_temperature": round(current.get("apparent_temperature", 0)),
            "humidity": current.get("relative_humidity_2m", 0),
            "wind_speed": round(current.get("wind_speed_10m", 0)),
            "weather_code": current.get("weather_code", 0),
            "time": current.get("time", "")
        },
        "today": {
            "temp_max": today_max,
            "temp_min": today_min
        },
        "daily": daily_forecast
    }

    return jsonify(response_payload), 200


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
