const DEFAULT_FALLBACK_CURRENCY = "USD";

const TIMEZONE_TO_CURRENCY: Record<string, string> = {
  // Asia & Pacific
  "Asia/Manila": "PHP",
  "Asia/Singapore": "SGD",
  "Asia/Tokyo": "JPY",
  "Asia/Seoul": "KRW",
  "Asia/Hong_Kong": "HKD",
  "Asia/Taipei": "TWD",
  "Asia/Shanghai": "CNY",
  "Asia/Chongqing": "CNY",
  "Asia/Harbin": "CNY",
  "Asia/Urumqi": "CNY",
  "Asia/Bangkok": "THB",
  "Asia/Jakarta": "IDR",
  "Asia/Makassar": "IDR",
  "Asia/Jayapura": "IDR",
  "Asia/Kuala_Lumpur": "MYR",
  "Asia/Kuching": "MYR",
  "Asia/Ho_Chi_Minh": "VND",
  "Asia/Saigon": "VND",
  "Asia/Kolkata": "INR",
  "Asia/Calcutta": "INR",
  "Asia/Karachi": "PKR",
  "Asia/Dhaka": "BDT",
  "Asia/Colombo": "LKR",
  "Asia/Kathmandu": "NPR",
  "Asia/Dubai": "AED",
  "Asia/Riyadh": "SAR",
  "Asia/Qatar": "QAR",
  "Asia/Kuwait": "KWD",
  "Asia/Bahrain": "BHD",
  "Asia/Muscat": "OMR",
  "Asia/Jerusalem": "ILS",
  "Asia/Tel_Aviv": "ILS",
  "Asia/Istanbul": "TRY",
  "Australia/Sydney": "AUD",
  "Australia/Melbourne": "AUD",
  "Australia/Brisbane": "AUD",
  "Australia/Perth": "AUD",
  "Australia/Adelaide": "AUD",
  "Australia/Darwin": "AUD",
  "Australia/Hobart": "AUD",
  "Pacific/Auckland": "NZD",

  // Europe
  "Europe/London": "GBP",
  "Europe/Zurich": "CHF",
  "Europe/Stockholm": "SEK",
  "Europe/Oslo": "NOK",
  "Europe/Copenhagen": "DKK",
  "Europe/Warsaw": "PLN",
  "Europe/Prague": "CZK",
  "Europe/Budapest": "HUF",
  "Europe/Bucharest": "RON",
  "Europe/Istanbul": "TRY",
  "Europe/Moscow": "RUB",
  "Europe/Kiev": "UAH",
  "Europe/Kyiv": "UAH",
  "Europe/Berlin": "EUR",
  "Europe/Paris": "EUR",
  "Europe/Madrid": "EUR",
  "Europe/Rome": "EUR",
  "Europe/Amsterdam": "EUR",
  "Europe/Brussels": "EUR",
  "Europe/Vienna": "EUR",
  "Europe/Dublin": "EUR",
  "Europe/Lisbon": "EUR",
  "Europe/Athens": "EUR",
  "Europe/Helsinki": "EUR",

  // Americas
  "America/New_York": "USD",
  "America/Chicago": "USD",
  "America/Denver": "USD",
  "America/Los_Angeles": "USD",
  "America/Phoenix": "USD",
  "America/Anchorage": "USD",
  "Pacific/Honolulu": "USD",
  "America/Toronto": "CAD",
  "America/Vancouver": "CAD",
  "America/Edmonton": "CAD",
  "America/Winnipeg": "CAD",
  "America/Halifax": "CAD",
  "America/Mexico_City": "MXN",
  "America/Sao_Paulo": "BRL",
  "America/Argentina/Buenos_Aires": "ARS",
  "America/Santiago": "CLP",
  "America/Bogota": "COP",
  "America/Lima": "PEN",

  // Africa
  "Africa/Johannesburg": "ZAR",
  "Africa/Lagos": "NGN",
  "Africa/Cairo": "EGP",
  "Africa/Nairobi": "KES",
  "Africa/Casablanca": "MAD",
};

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  PH: "PHP",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  NZ: "NZD",
  SG: "SGD",
  JP: "JPY",
  KR: "KRW",
  HK: "HKD",
  TW: "TWD",
  CN: "CNY",
  TH: "THB",
  ID: "IDR",
  MY: "MYR",
  VN: "VND",
  IN: "INR",
  PK: "PKR",
  BD: "BDT",
  LK: "LKR",
  NP: "NPR",
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  BH: "BHD",
  OM: "OMR",
  IL: "ILS",
  TR: "TRY",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  RO: "RON",
  UA: "UAH",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  IE: "EUR",
  PT: "EUR",
  GR: "EUR",
  FI: "EUR",
  MX: "MXN",
  BR: "BRL",
  AR: "ARS",
  CL: "CLP",
  CO: "COP",
  PE: "PEN",
  ZA: "ZAR",
  NG: "NGN",
  EG: "EGP",
  KE: "KES",
  MA: "MAD",
};

/**
 * Detects the user's likely 3-letter ISO 4217 currency code based on
 * their system IANA timezone first, then browser locale region, falling
 * back to USD.
 */
export function detectUserCurrency(): string {
  if (typeof window === "undefined") {
    return DEFAULT_FALLBACK_CURRENCY;
  }

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && TIMEZONE_TO_CURRENCY[timeZone]) {
      return TIMEZONE_TO_CURRENCY[timeZone];
    }
  } catch {
    // Ignore Intl timezone lookup errors
  }

  try {
    const locales = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];

    for (const localeStr of locales) {
      if (!localeStr) continue;
      const locale = new Intl.Locale(localeStr);
      const region = locale.region?.toUpperCase();
      if (region && COUNTRY_TO_CURRENCY[region]) {
        return COUNTRY_TO_CURRENCY[region];
      }
    }
  } catch {
    // Ignore Intl.Locale parsing errors
  }

  return DEFAULT_FALLBACK_CURRENCY;
}
