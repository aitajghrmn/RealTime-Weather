/**
 * Hava Proqnozu Tətbiqi - Frontend JavaScript
 * Flask Backend API ilə əlaqə: /api/weather
 */

// ==========================================
// 1. SABİT MƏLUMATLAR VƏ WMO HAVA KODLARI
// ==========================================

const WEEKS_AZ = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
const MONTHS_AZ = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

// Fərqli hava şəraitləri üçün SVG İkon Generatoru (İsti qızılı #e8a33d vurğusu ilə)
const WEATHER_SVGS = {
  sunny: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGradGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="35%" stop-color="#f5b352"/>
          <stop offset="85%" stop-color="#e8a33d"/>
          <stop offset="100%" stop-color="#b46d0a"/>
        </radialGradient>
        <filter id="sunGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <circle cx="32" cy="32" r="14" fill="url(#sunGradGold)" filter="url(#sunGoldGlow)"/>
      <g stroke="#e8a33d" stroke-width="3" stroke-linecap="round">
        <line x1="32" y1="5" x2="32" y2="12"/>
        <line x1="32" y1="52" x2="32" y2="59"/>
        <line x1="5" y1="32" x2="12" y2="32"/>
        <line x1="52" y1="32" x2="59" y2="32"/>
        <line x1="12.9" y1="12.9" x2="17.8" y2="17.8"/>
        <line x1="46.2" y1="46.2" x2="51.1" y2="51.1"/>
        <line x1="12.9" y1="51.1" x2="17.8" y2="46.2"/>
        <line x1="46.2" y1="17.8" x2="51.1" y2="12.9"/>
      </g>
    </svg>
  `,

  partlyCloudy: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cloudGradPartly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
        <radialGradient id="sunBehindGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="60%" stop-color="#f5b352"/>
          <stop offset="100%" stop-color="#e8a33d"/>
        </radialGradient>
      </defs>
      <circle cx="41" cy="23" r="10" fill="url(#sunBehindGold)"/>
      <g stroke="#e8a33d" stroke-width="2.5" stroke-linecap="round">
        <line x1="41" y1="7" x2="41" y2="10"/>
        <line x1="55" y1="23" x2="52" y2="23"/>
        <line x1="50.9" y1="13.1" x2="48.8" y2="15.2"/>
        <line x1="53" y1="33" x2="50.5" y2="31.5"/>
      </g>
      <path d="M22 48h24a10 10 0 0 0 1.2-19.9 14 14 0 0 0-26.6-4.5A9.5 9.5 0 0 0 22 48z" fill="url(#cloudGradPartly)"/>
    </svg>
  `,

  cloudy: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cloudOvercast1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
        <linearGradient id="cloudBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <path d="M30 40h18a8 8 0 0 0 .9-15.9 11 11 0 0 0-21-3.6A7.5 7.5 0 0 0 30 40z" fill="url(#cloudBack)" opacity="0.8"/>
      <path d="M18 50h26a10 10 0 0 0 1.3-19.9 13 13 0 0 0-24.8-4.2A9 9 0 0 0 18 50z" fill="url(#cloudOvercast1)"/>
    </svg>
  `,

  fog: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fogCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <path d="M20 36h24a9 9 0 0 0 1.2-17.9 12 12 0 0 0-22.8-3.8A8 8 0 0 0 20 36z" fill="url(#fogCloud)" opacity="0.85"/>
      <g stroke="#93c5fd" stroke-width="2.8" stroke-linecap="round" opacity="0.9">
        <line x1="16" y1="43" x2="48" y2="43"/>
        <line x1="12" y1="49" x2="52" y2="49"/>
        <line x1="20" y1="55" x2="44" y2="55"/>
      </g>
    </svg>
  `,

  drizzle: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="drizzleCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
      </defs>
      <path d="M18 38h26a9.5 9.5 0 0 0 1.3-18.9 13 13 0 0 0-24.8-4.2A8.5 8.5 0 0 0 18 38z" fill="url(#drizzleCloud)"/>
      <g stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round">
        <line x1="22" y1="44" x2="20" y2="49"/>
        <line x1="32" y1="44" x2="30" y2="49"/>
        <line x1="42" y1="44" x2="40" y2="49"/>
        <line x1="27" y1="52" x2="25" y2="57"/>
        <line x1="37" y1="52" x2="35" y2="57"/>
      </g>
    </svg>
  `,

  rain: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <path d="M18 36h26a9.5 9.5 0 0 0 1.3-18.9 13 13 0 0 0-24.8-4.2A8.5 8.5 0 0 0 18 36z" fill="url(#rainCloud)"/>
      <g stroke="#38bdf8" stroke-width="2.8" stroke-linecap="round">
        <line x1="22" y1="42" x2="18" y2="52"/>
        <line x1="32" y1="42" x2="28" y2="52"/>
        <line x1="42" y1="42" x2="38" y2="52"/>
        <line x1="27" y1="50" x2="23" y2="60"/>
        <line x1="37" y1="50" x2="33" y2="60"/>
      </g>
    </svg>
  `,

  snow: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="snowCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <path d="M18 36h26a9.5 9.5 0 0 0 1.3-18.9 13 13 0 0 0-24.8-4.2A8.5 8.5 0 0 0 18 36z" fill="url(#snowCloud)"/>
      <g fill="#a5f3fc">
        <circle cx="21" cy="45" r="2.2"/>
        <circle cx="31" cy="45" r="2.2"/>
        <circle cx="41" cy="45" r="2.2"/>
        <circle cx="26" cy="54" r="2.2"/>
        <circle cx="36" cy="54" r="2.2"/>
      </g>
      <g stroke="#a5f3fc" stroke-width="1.8" stroke-linecap="round">
        <line x1="31" y1="41" x2="31" y2="49"/>
        <line x1="27" y1="45" x2="35" y2="45"/>
        <line x1="26" y1="50" x2="26" y2="58"/>
        <line x1="22" y1="54" x2="30" y2="54"/>
      </g>
    </svg>
  `,

  thunder: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stormCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#64748b"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
        <filter id="boltGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <path d="M18 34h26a9.5 9.5 0 0 0 1.3-18.9 13 13 0 0 0-24.8-4.2A8.5 8.5 0 0 0 18 34z" fill="url(#stormCloud)"/>
      <polygon points="33,31 23,45 31,45 27,59 41,42 33,42" fill="#e8a33d" filter="url(#boltGlow)"/>
    </svg>
  `
};

/**
 * WMO Hava koduna uyğun mətn və SVG
 */
function getWeatherInfo(code) {
  switch (code) {
    case 0:
      return { text: 'Açıq hava', svg: WEATHER_SVGS.sunny };
    case 1:
      return { text: 'Əsasən açıq', svg: WEATHER_SVGS.sunny };
    case 2:
      return { text: 'Qismən buludlu', svg: WEATHER_SVGS.partlyCloudy };
    case 3:
      return { text: 'Tutqun / Buludlu', svg: WEATHER_SVGS.cloudy };
    case 45:
      return { text: 'Dumanlı', svg: WEATHER_SVGS.fog };
    case 48:
      return { text: 'Qırovlu duman', svg: WEATHER_SVGS.fog };
    case 51:
      return { text: 'Zəif çiskin', svg: WEATHER_SVGS.drizzle };
    case 53:
      return { text: 'Mülayim çiskin', svg: WEATHER_SVGS.drizzle };
    case 55:
      return { text: 'Güclü çiskin', svg: WEATHER_SVGS.drizzle };
    case 56:
    case 57:
      return { text: 'Donan çiskin', svg: WEATHER_SVGS.drizzle };
    case 61:
      return { text: 'Zəif yağış', svg: WEATHER_SVGS.rain };
    case 63:
      return { text: 'Mülayim yağış', svg: WEATHER_SVGS.rain };
    case 65:
      return { text: 'Güclü leysan', svg: WEATHER_SVGS.rain };
    case 66:
    case 67:
      return { text: 'Donan soyuq yağış', svg: WEATHER_SVGS.rain };
    case 71:
      return { text: 'Zəif qar', svg: WEATHER_SVGS.snow };
    case 73:
      return { text: 'Mülayim qar', svg: WEATHER_SVGS.snow };
    case 75:
      return { text: 'Şiddətli qar', svg: WEATHER_SVGS.snow };
    case 77:
      return { text: 'Qar dənələri', svg: WEATHER_SVGS.snow };
    case 80:
      return { text: 'Zəif yağış', svg: WEATHER_SVGS.rain };
    case 81:
      return { text: 'Mülayim leysan', svg: WEATHER_SVGS.rain };
    case 82:
      return { text: 'Şiddətli leysan', svg: WEATHER_SVGS.rain };
    case 85:
      return { text: 'Zəif qar leysanı', svg: WEATHER_SVGS.snow };
    case 86:
      return { text: 'Güclü qar leysanı', svg: WEATHER_SVGS.snow };
    case 95:
      return { text: 'Şimşəkli tufan', svg: WEATHER_SVGS.thunder };
    case 96:
    case 99:
      return { text: 'Dolulu tufan', svg: WEATHER_SVGS.thunder };
    default:
      return { text: 'Dəyişkən hava', svg: WEATHER_SVGS.partlyCloudy };
  }
}

// ==========================================
// 2. DOM ELEMENTLƏRİ
// ==========================================

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const clearBtn = document.getElementById('clear-btn');
const geoBtn = document.getElementById('geo-btn');
const retryBtn = document.getElementById('retry-btn');
const quickTags = document.getElementById('quick-tags');

// State Containers
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorTitle = document.getElementById('error-title');
const errorMessage = document.getElementById('error-message');
const weatherView = document.getElementById('weather-view');

// Cari Hava Elementləri
const currentCityName = document.getElementById('current-city-name');
const currentCountry = document.getElementById('current-country');
const currentDateTime = document.getElementById('current-date-time');
const sourceText = document.getElementById('source-text');
const currentWeatherIconWrapper = document.getElementById('current-weather-icon-wrapper');
const currentTemp = document.getElementById('current-temp');
const currentConditionText = document.getElementById('current-condition-text');
const todayMaxTemp = document.getElementById('today-max-temp');
const todayMinTemp = document.getElementById('today-min-temp');

// 3 Statistika Kartı: Rütubət, Külək, Hiss olunan temperatur
const metricHumidity = document.getElementById('metric-humidity');
const metricWind = document.getElementById('metric-wind');
const metricApparent = document.getElementById('metric-apparent');

// 6 Günlük Üfüqi Sürüşən Proqnoz
const forecastCardsGrid = document.getElementById('forecast-cards-grid');

let lastSearchedCity = 'Bakı';

// ==========================================
// 3. UI VƏZİYYƏT FUNKSİYALARI
// ==========================================

function showLoading() {
  loadingState.style.display = 'flex';
  errorState.style.display = 'none';
  weatherView.style.display = 'none';
}

function showError(title, message) {
  loadingState.style.display = 'none';
  errorState.style.display = 'flex';
  weatherView.style.display = 'none';
  errorTitle.textContent = title || 'Xəta baş verdi';
  errorMessage.textContent = message || 'Məlumatları əldə etmək mümkün olmadı.';
}

function showWeatherView() {
  loadingState.style.display = 'none';
  errorState.style.display = 'none';
  weatherView.style.display = 'flex';
}

function formatAzDate(isoString, isCurrentTime = false) {
  const d = isoString ? new Date(isoString) : new Date();
  const dayName = WEEKS_AZ[d.getDay()];
  const dayNum = d.getDate();
  const monthName = MONTHS_AZ[d.getMonth()];

  if (isCurrentTime) {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${dayName}, ${dayNum} ${monthName} • ${hours}:${minutes}`;
  }

  return {
    dayName: dayName,
    shortDate: `${dayNum} ${monthName.slice(0, 3)}`
  };
}

// ==========================================
// 4. FLASK BACKEND API ÇAĞIRIŞLARI (/api/weather)
// ==========================================

/**
 * Flask backend /api/weather endpoint-indən şəhər havasını çəkir
 */
async function fetchWeatherFromBackend(endpointUrl) {
  showLoading();

  try {
    const response = await fetch(endpointUrl);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error || 'Serverdən hava məlumatını əldə etmək mümkün olmadı.';
      showError(response.status === 404 ? 'Şəhər tapılmadı' : 'Xəta baş verdi', errorMsg);
      return;
    }

    renderWeatherData(data);
  } catch (err) {
    console.error('API Sorğu xətası:', err);
    showError('Bağlantı xətası', 'Flask serveri ilə əlaqə qurularkən xəta baş verdi. Serverin işlək olduğundan əmin olun.');
  }
}

/**
 * Şəhər adına görə axtarış: /api/weather?city=ŞƏHƏR
 */
function loadWeatherForCity(cityName) {
  const trimmed = cityName.trim();
  if (!trimmed) return;

  lastSearchedCity = trimmed;
  fetchWeatherFromBackend(`/api/weather?city=${encodeURIComponent(trimmed)}`);
}

/**
 * Koordinatlara görə axtarış: /api/weather?lat=...&lon=...
 */
function loadWeatherByCoords(latitude, longitude) {
  fetchWeatherFromBackend(`/api/weather?lat=${latitude}&lon=${longitude}`);
}

// ==========================================
// 5. MƏLUMATLARIN EKRANA YAZILMASI (RENDER)
// ==========================================

function renderWeatherData(data) {
  const current = data.current;
  const today = data.today || {};
  const daily = data.daily || [];

  if (!current) {
    showError('Məlumat çatışmır', 'Serverdən natamam məlumat qayıtdı.');
    return;
  }

  const weatherInfo = getWeatherInfo(current.weather_code);

  // Məkan və vaxt
  currentCityName.textContent = data.city || 'Məkan';
  currentCountry.textContent = data.country || '';
  currentCountry.style.display = data.country ? 'inline-block' : 'none';
  currentDateTime.textContent = formatAzDate(current.time, true);
  sourceText.textContent = 'Canlı Proqnoz';

  // Temperatur (Fraunces serif) və şərait
  currentTemp.textContent = current.temperature;
  currentConditionText.textContent = weatherInfo.text;
  currentWeatherIconWrapper.innerHTML = weatherInfo.svg;

  // Günün Maksimum və Minimumu
  todayMaxTemp.textContent = today.temp_max !== null ? `${today.temp_max}°` : '--°';
  todayMinTemp.textContent = today.temp_min !== null ? `${today.temp_min}°` : '--°';

  // 3 STATİSTİKA KARTI BİR SIRADA:
  // 1. Rütubət
  metricHumidity.textContent = `${current.humidity}%`;

  // 2. Külək
  metricWind.textContent = `${current.wind_speed} km/s`;

  // 3. Hiss olunan temperatur
  metricApparent.textContent = `${current.apparent_temperature}°C`;

  // 6 Günlük Üfüqi Sürüşən Proqnoz Kartları
  renderForecastCards(daily);

  showWeatherView();
}

/**
 * 6 Günlük proqnoz kartlarını generatsiya edir
 */
function renderForecastCards(dailyList) {
  forecastCardsGrid.innerHTML = '';

  dailyList.forEach((dayData, index) => {
    const dateInfo = formatAzDate(dayData.date);
    const dayLabel = index === 0 ? 'Sabah' : dateInfo.dayName;
    const weatherInfo = getWeatherInfo(dayData.weather_code);

    const card = document.createElement('div');
    card.className = 'forecast-card-item';
    card.innerHTML = `
      <span class="forecast-day">${dayLabel}</span>
      <span class="forecast-date">${dateInfo.shortDate}</span>
      <div class="forecast-icon">
        ${weatherInfo.svg}
      </div>
      <span class="forecast-condition">${weatherInfo.text}</span>
      <div class="forecast-temps-row">
        <span class="temp-high">${dayData.temp_max}°</span>
        <span class="temp-low">${dayData.temp_min}°</span>
      </div>
    `;

    forecastCardsGrid.appendChild(card);
  });
}

// ==========================================
// 6. HADİSƏ DİNLƏYİCİLƏRİ (EVENT LISTENERS)
// ==========================================

// Form axtarışı
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = cityInput.value.trim();
  if (query) {
    loadWeatherForCity(query);
  }
});

// Axtarış inputu təmizləmə düyməsi
cityInput.addEventListener('input', () => {
  clearBtn.style.display = cityInput.value.length > 0 ? 'block' : 'none';
});

clearBtn.addEventListener('click', () => {
  cityInput.value = '';
  clearBtn.style.display = 'none';
  cityInput.focus();
});

// Yenidən cəhd et düyməsi
retryBtn.addEventListener('click', () => {
  loadWeatherForCity(lastSearchedCity || 'Bakı');
});

// Tez axtarış teqləri
quickTags.addEventListener('click', (e) => {
  const tag = e.target.closest('.tag-btn');
  if (!tag) return;
  const city = tag.dataset.city;
  cityInput.value = city;
  clearBtn.style.display = 'block';
  loadWeatherForCity(city);
});

// GPS Düyməsi
geoBtn.addEventListener('click', () => {
  getUserLocation();
});

// ==========================================
// 7. GEOLOCATION İLƏ İŞƏ SALMA (İLK YÜKLƏNMƏ)
// ==========================================

function getUserLocation() {
  if (!navigator.geolocation) {
    loadWeatherForCity('Bakı');
    return;
  }

  showLoading();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      loadWeatherByCoords(latitude, longitude);
    },
    (err) => {
      console.warn('Geolocation xətası və ya imtina:', err.message);
      // İcazə verilmədikdə və ya xətada Bakı şəhəri göstərilir
      loadWeatherForCity('Bakı');
    },
    {
      timeout: 4000,
      enableHighAccuracy: false,
      maximumAge: 300000
    }
  );
}

// Səhifə yüklənəndə
window.addEventListener('DOMContentLoaded', () => {
  getUserLocation();
});
