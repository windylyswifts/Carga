// Static UI dictionary + dynamic crop/location translator for English, Tagalog, and Cebuano

export const LANGUAGES = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'tl', label: 'TAG', fullName: 'Tagalog' },
  { code: 'ceb', label: 'CEB', fullName: 'Cebuano' },
];

export const UI_STRINGS = {
  en: {
    // Role Switcher & Global
    prototypeTag: 'Pitch Prototype',
    roleOrdinary: 'Ordinary (Farmer)',
    roleDriver: 'Driver / Lender',
    badgeLiveTrip: '1 Live Trip',
    badgeOnline: '{count} Online',

    // Trip Stages
    stage0Label: 'Request Sent',
    stage0Sub: 'Waiting for driver to accept your trip',
    stage0DriverBtn: 'Accept Hauling Job',
    stage1Label: 'On the Way',
    stage1Sub: 'Driver accepted and is heading to your farm',
    stage1DriverBtn: 'Confirm Arrival at Farm',
    stage2Label: 'Loading',
    stage2Sub: 'Loading your sacks onto the truck at the farm',
    stage2DriverBtn: 'Finish Loading & Start Delivery',
    stage3Label: 'Delivering',
    stage3Sub: 'Truck is en route to the destination market',
    stage3DriverBtn: 'Confirm Drop-off & Complete Trip',
    stage4Label: 'Arrived',
    stage4Sub: 'Crops delivered safely at destination!',

    // Ordinary (Farmer) 3-Step Stepper
    farmerBadge: 'Farmer Home',
    farmerTitle: 'Send Your Harvest to Market',
    stepIndicator: 'Step {current} of 3',
    step1Short: 'Locations',
    step2Short: 'Crop & Sacks',
    step3Short: 'Choose Truck',

    // Step 1
    step1Title: 'Where is your pickup and drop-off?',
    labelPickup: 'Where is your farm?',
    placeholderPickup: 'Enter farm or barangay',
    labelDestination: 'Where are the crops going?',
    placeholderDestination: 'Enter market or drop-off place',
    btnNextStep: 'Next Step',
    btnBack: 'Back',

    // Step 2
    step2Title: 'What crop and how many sacks?',
    labelCropSending: 'What crop are you sending?',
    placeholderCropSending: 'e.g., Bananas, Rice, Corn',
    labelSackSize: 'Weight per Sack',
    sackOption50: '50 kg per sack (Standard Sack)',
    sackOption25: '25 kg per sack (Half Sack)',
    labelSackCount: 'How many sacks?',
    sacksUnit: '{count} Sacks',
    totalWeightSummary: 'Total Weight: {kg} kg',

    // Step 3
    step3Title: 'Select an Available Truck',
    step3Subtitle: 'Showing trucks that can carry {kg} kg',
    noCapableTrucksTitle: 'No available truck can carry {kg} kg right now',
    noCapableTrucksSub: 'Go back to reduce sacks or turn on a larger truck in Driver / Lender.',
    btnConfirmBooking: 'Confirm Booking',
    btnConfirmingBooking: 'Confirming...',

    // Live Truck Tracker & Fare Formula Breakdown
    waitingForDriverBadge: 'WAITING FOR DRIVER',
    deliveredBadge: 'DELIVERED',
    liveMapBadge: 'LIVE TRUCK MAP',
    btnSimAccept: 'Simulate Driver Accept',
    btnNextStepDemo: 'Next Trip Step (Demo)',
    btnBookAnother: 'Book Another Truck',
    whatHappeningNow: 'What is happening now',
    arrivalTimeLabel: 'Arrival Time',
    arrivedExcl: 'Arrived!',
    minsApprox: '~{mins} mins',
    mapPinFarm: 'YOUR FARM',
    mapPinMarket: 'MARKET',
    yourDriverHeader: 'Your Driver',
    callDriverBtn: 'Call Driver ({phone})',
    yourLoadHeader: 'Your Load',
    cropColon: 'Crop:',
    totalLoadColon: 'Total Load:',
    distanceCostLabel: 'Distance ({km} km × ₱{rate}):',
    handlingCostLabel: 'Handling ({kg} kg × ₱{rate}):',
    multiplierLabel: 'Availability Multiplier (S):',
    totalPaymentLabel: 'Total Payment',
    noMiddlemanNote: 'Pay directly to the driver—no middleman fee',

    // Driver / Lender Dashboard
    driverPortalBadge: 'Driver / Lender Portal',
    driverPortalTitle: 'Truck Dispatch & Availability',
    viewingAccount: 'Viewing Account:',
    otherTruckBookedMsg: 'A farmer booked {driver} ({model}).',
    switchDriverViewBtn: "Switch to {name}'s View",
    maxCapacityLine: 'Max Load: {kg} kg',
    visibleToFarmers: '● VISIBLE TO FARMERS — Farmers can currently book your truck.',
    offlineFromFarmers: '○ OFFLINE — Hidden from farmers until you turn availability ON.',
    btnAvailableOn: 'Available for Service (ON)',
    btnAvailableOff: 'Go Online Now (OFF)',
    waitingRequestsTitle: 'Waiting for Farmer Hauling Requests...',
    currentlyOfflineTitle: 'You Are Currently Offline',
    waitingRequestsSub:
      'Your truck is live on the farmer marketplace. Switch to Ordinary (Farmer) at the top and book this truck to see a live job appear here.',
    currentlyOfflineSub:
      'Turn your availability switch ON above so farmers in your area can book your vehicle.',
    newBookingBanner: 'NEW FARMER BOOKING REQUEST',
    tripCompletedBanner: 'TRIP COMPLETED',
    activeJobBanner: 'ACTIVE JOB • {stage}',
    pickupAtFarmLabel: 'Pickup at Farm',
    dropoffDestLabel: 'Drop-off Destination',
    cargoLoadLabel: 'Cargo Load',
    farmerContactLabel: 'Farmer Contact',
    yourTripPayout: 'Your Trip Payout',
    directCashNote: '100% Direct Cash / GCash',
    btnDecline: 'Decline',
    btnDoneNextFarmer: 'Done — Ready for Next Farmer',
    standbyAreaTitle: 'Current Standby Area',
    standbyAreaSub: 'Shown to nearby farmers looking for a truck',
    driverSummaryTitle: 'Driver Summary',
    totalEarningsLabel: 'Total Earnings',
    completedTripsLabel: 'Completed Trips',
    farmerRatingLabel: 'Farmer Rating',
  },

  tl: {
    // Role Switcher & Global
    prototypeTag: 'Prototipo ng Sistema',
    roleOrdinary: 'Karaniwan (Magsasaka)',
    roleDriver: 'Drayber / Nagpapahiram',
    badgeLiveTrip: '1 Biyahe Ngayon',
    badgeOnline: '{count} Online',

    // Trip Stages
    stage0Label: 'Naipadala na',
    stage0Sub: 'Naghihintay tanggapin ng drayber ang biyahe',
    stage0DriverBtn: 'Tanggapin ang Biyahe',
    stage1Label: 'Papunta Na',
    stage1Sub: 'Tinanggap na ng drayber at papunta na sa sakahan',
    stage1DriverBtn: 'Kumpirmahin ang Pagdating sa Sakahan',
    stage2Label: 'Nagkakarga',
    stage2Sub: 'Ikinakarga na ang mga sako sa trak',
    stage2DriverBtn: 'Tapos Magkarga & Simulan ang Paghatid',
    stage3Label: 'Hinahatid Na',
    stage3Sub: 'Papunta na ang trak sa palengke o destinasyon',
    stage3DriverBtn: 'Kumpirmahin ang Pagbaba & Tapusin',
    stage4Label: 'Nakarating Na',
    stage4Sub: 'Ligtas nang naihatid ang iyong ani!',

    // Ordinary (Farmer) 3-Step Stepper
    farmerBadge: 'Tahanan ng Magsasaka',
    farmerTitle: 'Ihatid ang Iyong Ani sa Palengke',
    stepIndicator: 'Hakbang {current} ng 3',
    step1Short: 'Lugar',
    step2Short: 'Pananim at Sako',
    step3Short: 'Piliin ang Trak',

    // Step 1
    step1Title: 'Saan kukunin at ihahatid ang ani?',
    labelPickup: 'Saan ang iyong sakahan?',
    placeholderPickup: 'Ilagay ang sakahan o barangay',
    labelDestination: 'Saan dadalhin ang ani?',
    placeholderDestination: 'Ilagay ang palengke o bababaan',
    btnNextStep: 'Susunod na Hakbang',
    btnBack: 'Bumalik',

    // Step 2
    step2Title: 'Anong pananim at ilang sako?',
    labelCropSending: 'Anong pananim ang ipapadala?',
    placeholderCropSending: 'hal., Saging, Palay, Mais',
    labelSackSize: 'Timbang Bawat Sako',
    sackOption50: '50 kg bawat sako (Karaniwang Sako)',
    sackOption25: '25 kg bawat sako (Kalahating Sako)',
    labelSackCount: 'Ilang sako lahat?',
    sacksUnit: '{count} Sako',
    totalWeightSummary: 'Kabuuang Timbang: {kg} kg',

    // Step 3
    step3Title: 'Pumili ng Magagamit na Trak',
    step3Subtitle: 'Mga trak na kayang magdala ng {kg} kg',
    noCapableTrucksTitle: 'Walang bukas na trak na kayang magdala ng {kg} kg ngayon',
    noCapableTrucksSub: 'Bumalik upang bawasan ang sako o magbukas ng mas malaking trak sa Drayber.',
    btnConfirmBooking: 'Kumpirmahin ang Trak',
    btnConfirmingBooking: 'Kinukumpirma...',

    // Live Truck Tracker & Fare Formula Breakdown
    waitingForDriverBadge: 'NAGHIHINTAY SA DRAYBER',
    deliveredBadge: 'NAIHATID NA',
    liveMapBadge: 'LIVE NA MAPA NG TRAK',
    btnSimAccept: 'I-simulate ang Pagtanggap ng Drayber',
    btnNextStepDemo: 'Susunod na Hakbang (Demo)',
    btnBookAnother: 'Mag-book ng Ibang Trak',
    whatHappeningNow: 'Ano ang nangyayari ngayon',
    arrivalTimeLabel: 'Oras ng Pagdating',
    arrivedExcl: 'Nakarating Na!',
    minsApprox: '~{mins} minuto',
    mapPinFarm: 'SAKAHAN MO',
    mapPinMarket: 'PALENGKE',
    yourDriverHeader: 'Ang Iyong Drayber',
    callDriverBtn: 'Tawagan ang Drayber ({phone})',
    yourLoadHeader: 'Ang Iyong Karga',
    cropColon: 'Pananim:',
    totalLoadColon: 'Kabuuang Karga:',
    distanceCostLabel: 'Distansya ({km} km × ₱{rate}):',
    handlingCostLabel: 'Pagkarga ({kg} kg × ₱{rate}):',
    multiplierLabel: 'Availability Multiplier (S):',
    totalPaymentLabel: 'Kabuuang Babayaran',
    noMiddlemanNote: 'Direktang bayad sa drayber—walang kaltas ng middleman',

    // Driver / Lender Dashboard
    driverPortalBadge: 'Portal ng Drayber / Nagpapahiram',
    driverPortalTitle: 'Biyahe at Kahandaan ng Trak',
    viewingAccount: 'Gamit na Account:',
    otherTruckBookedMsg: 'May magsasakang nag-book kay {driver} ({model}).',
    switchDriverViewBtn: 'Lumipat sa View ni {name}',
    maxCapacityLine: 'Kayang Karga: {kg} kg',
    visibleToFarmers: '● NAKIKITA NG MAGSASAKA — Maaari nang i-book ang trak mo.',
    offlineFromFarmers: '○ OFFLINE — Nakatago sa mga magsasaka hanggang buksan mo.',
    btnAvailableOn: 'Handa sa Biyahe (BUKAS)',
    btnAvailableOff: 'Mag-online Ngayon (SARADO)',
    waitingRequestsTitle: 'Naghihintay ng Hiling na Biyahe mula sa Magsasaka...',
    currentlyOfflineTitle: 'Kasalukuyan Kang Offline',
    waitingRequestsSub:
      'Nakalista na ang trak mo. Lumipat sa Karaniwan (Magsasaka) sa itaas at mag-book para makita ang live na biyahe rito.',
    currentlyOfflineSub:
      'Buksan ang iyong availability switch sa itaas para makita ka ng mga magsasaka.',
    newBookingBanner: 'BAGONG HILING NA BIYAHE NG MAGSASAKA',
    tripCompletedBanner: 'TAPOS NA ANG BIYAHE',
    activeJobBanner: 'KASALUKUYANG BIYAHE • {stage}',
    pickupAtFarmLabel: 'Pagkukunan sa Sakahan',
    dropoffDestLabel: 'Destinasyong Bababaan',
    cargoLoadLabel: 'Kargang Ani',
    farmerContactLabel: 'Kontak ng Magsasaka',
    yourTripPayout: 'Kita Mo sa Biyahe',
    directCashNote: '100% Direktang Cash / GCash',
    btnDecline: 'Tanggihan',
    btnDoneNextFarmer: 'Tapos Na — Handa sa Susunod',
    standbyAreaTitle: 'Kasalukuyang Himpilan',
    standbyAreaSub: 'Ipinapakita sa mga kalapit na magsasaka',
    driverSummaryTitle: 'Buod ng Drayber',
    totalEarningsLabel: 'Kabuuang Kita',
    completedTripsLabel: 'Natapos na Biyahe',
    farmerRatingLabel: 'Marka ng Magsasaka',
  },

  ceb: {
    // Role Switcher & Global
    prototypeTag: 'Prototipo sa Sistema',
    roleOrdinary: 'Ordinaryo (Mag-uuma)',
    roleDriver: 'Drayber / Nagpahulam',
    badgeLiveTrip: '1 Biyahe Karon',
    badgeOnline: '{count} Online',

    // Trip Stages
    stage0Label: 'Gipadala Na',
    stage0Sub: 'Naghulat nga dawaton sa drayber ang biyahe',
    stage0DriverBtn: 'Dawata ang Biyahe',
    stage1Label: 'Padulong Na',
    stage1Sub: 'Gidawat na sa drayber ug padulong na sa imong uma',
    stage1DriverBtn: 'Kumpirmaha nga Niabot na sa Uma',
    stage2Label: 'Nagkarga',
    stage2Sub: 'Gikarga na ang mga sako sa trak sa uma',
    stage2DriverBtn: 'Human na Karga & Sugdi ang Paghatod',
    stage3Label: 'Gihatod Na',
    stage3Sub: 'Padulong na ang trak sa merkado o destinasyon',
    stage3DriverBtn: 'Kumpirmaha ang Pagdiskarga & Humana',
    stage4Label: 'Niabot Na',
    stage4Sub: 'Luwas nang nahatud ang imong abot!',

    // Ordinary (Farmer) 3-Step Stepper
    farmerBadge: 'Balay sa Mag-uuma',
    farmerTitle: 'Ihatod ang Imong Abot sa Merkado',
    stepIndicator: 'Lakang {current} sa 3',
    step1Short: 'Lugar',
    step2Short: 'Tanom ug Sako',
    step3Short: 'Pili og Trak',

    // Step 1
    step1Title: 'Asa kuhaon ug asa ihatod ang abot?',
    labelPickup: 'Asa ang imong uma?',
    placeholderPickup: 'Ibutang ang uma o barangay',
    labelDestination: 'Asa dad-on ang abot?',
    placeholderDestination: 'Ibutang ang merkado o kanaoganan',
    btnNextStep: 'Sunod nga Lakang',
    btnBack: 'Balik',

    // Step 2
    step2Title: 'Unsang tanom ug pila ka sako?',
    labelCropSending: 'Unsang tanom ang imong ipadala?',
    placeholderCropSending: 'pananglitan, Saging, Humay, Mais',
    labelSackSize: 'Gibug-aton Matag Sako',
    sackOption50: '50 kg matag sako (Standard nga Sako)',
    sackOption25: '25 kg matag sako (Tunga nga Sako)',
    labelSackCount: 'Pila ka sako tanan?',
    sacksUnit: '{count} Sako',
    totalWeightSummary: 'Tibuok Gibug-aton: {kg} kg',

    // Step 3
    step3Title: 'Pili og Magamit nga Trak',
    step3Subtitle: 'Mga trak nga makadala og {kg} kg',
    noCapableTrucksTitle: 'Walay online nga trak nga makadala og {kg} kg karon',
    noCapableTrucksSub: 'Balik aron pakunhuran ang sako o i-on ang mas dako nga trak sa Drayber.',
    btnConfirmBooking: 'Kumpirmaha ang Trak',
    btnConfirmingBooking: 'Gikumpirma...',

    // Live Truck Tracker & Fare Formula Breakdown
    waitingForDriverBadge: 'NAGHULAT SA DRAYBER',
    deliveredBadge: 'NAHATOD NA',
    liveMapBadge: 'LIVE NGA MAPA SA TRAK',
    btnSimAccept: 'I-simulate ang Pagdawat sa Drayber',
    btnNextStepDemo: 'Sunod nga Lakang (Demo)',
    btnBookAnother: 'Pag-book og Laing Trak',
    whatHappeningNow: 'Unsay nahitabo karon',
    arrivalTimeLabel: 'Oras sa Pag-abot',
    arrivedExcl: 'Niabot Na!',
    minsApprox: '~{mins} minutos',
    mapPinFarm: 'IMONG UMA',
    mapPinMarket: 'MERKADO',
    yourDriverHeader: 'Ang Imong Drayber',
    callDriverBtn: 'Tawagi ang Drayber ({phone})',
    yourLoadHeader: 'Ang Imong Karga',
    cropColon: 'Tanom:',
    totalLoadColon: 'Tibuok Karga:',
    distanceCostLabel: 'Distansya ({km} km × ₱{rate}):',
    handlingCostLabel: 'Pagkarga ({kg} kg × ₱{rate}):',
    multiplierLabel: 'Availability Multiplier (S):',
    totalPaymentLabel: 'Tibuok Bayranan',
    noMiddlemanNote: 'Direktang bayad sa drayber—walay kaltas sa middleman',

    // Driver / Lender Dashboard
    driverPortalBadge: 'Portal sa Drayber / Nagpahulam',
    driverPortalTitle: 'Biyahe ug Kaandam sa Trak',
    viewingAccount: 'Gigamit nga Account:',
    otherTruckBookedMsg: 'Naay mag-uuma nga nag-book kang {driver} ({model}).',
    switchDriverViewBtn: 'Balhin sa View ni {name}',
    maxCapacityLine: 'Makadala og: {kg} kg',
    visibleToFarmers: '● MAKITA SA MAG-UUMA — Mahimo nang i-book ang imong trak.',
    offlineFromFarmers: '○ OFFLINE — Nakatago sa mga mag-uuma hangtod i-on nimo.',
    btnAvailableOn: 'Andam sa Serbisyo (ON)',
    btnAvailableOff: 'Mag-online Karon (OFF)',
    waitingRequestsTitle: 'Naghulat og Hangyo sa Biyahe gikan sa Mag-uuma...',
    currentlyOfflineTitle: 'Offline Ka Karon',
    waitingRequestsSub:
      'Nakalista na ang imong trak. Balhin sa Ordinaryo (Mag-uuma) sa ibabaw ug pag-book aron makita ang live nga trabaho dinhi.',
    currentlyOfflineSub:
      'I-on ang imong availability switch sa ibabaw aron makita ka sa mga mag-uuma.',
    newBookingBanner: 'BAG-ONG HANGYO SA BIYAHE SA MAG-UUMA',
    tripCompletedBanner: 'HUMAN NA ANG BIYAHE',
    activeJobBanner: 'AKTIBONG BIYAHE • {stage}',
    pickupAtFarmLabel: 'Kuhaanan sa Uma',
    dropoffDestLabel: 'Destinasyong Kanaoganan',
    cargoLoadLabel: 'Kargang Abot',
    farmerContactLabel: 'Kontak sa Mag-uuma',
    yourTripPayout: 'Kita Nimo sa Biyahe',
    directCashNote: '100% Direktang Cash / GCash',
    btnDecline: 'Balibari',
    btnDoneNextFarmer: 'Human Na — Andam sa Sunod',
    standbyAreaTitle: 'Kasamtangang Standby Area',
    standbyAreaSub: 'Gipakita sa mga duol nga mag-uuma',
    driverSummaryTitle: 'Sumada sa Drayber',
    totalEarningsLabel: 'Tibuok Kita',
    completedTripsLabel: 'Nahuman nga Biyahe',
    farmerRatingLabel: 'Grado sa Mag-uuma',
  },
};

// Offline-safe Philippine Agricultural & Location Glossary
const AGRI_GLOSSARY = [
  { en: 'bananas (saba)', tl: 'saging (saba)', ceb: 'saging (sab-a)' },
  { en: 'cardava bananas (saba)', tl: 'saging na saba', ceb: 'saging nga sab-a' },
  { en: 'banana', tl: 'saging', ceb: 'saging' },
  { en: 'bananas', tl: 'mga saging', ceb: 'mga saging' },
  { en: 'rice / palay', tl: 'bigas / palay', ceb: 'bugas / humay' },
  { en: 'rice', tl: 'bigas', ceb: 'bugas' },
  { en: 'palay', tl: 'palay', ceb: 'humay' },
  { en: 'fresh vegetables', tl: 'sariwang gulay', ceb: 'preskong utanon' },
  { en: 'vegetables', tl: 'mga gulay', ceb: 'mga utanon' },
  { en: 'sweet corn', tl: 'matamis na mais', ceb: 'tam-is nga mais' },
  { en: 'corn', tl: 'mais', ceb: 'mais' },
  { en: 'cabbage', tl: 'repolyo', ceb: 'repolyo' },
  { en: 'eggplant', tl: 'talong', ceb: 'tawong' },
  { en: 'squash', tl: 'kalabasa', ceb: 'karabasa' },
  { en: 'cassava', tl: 'kamoteng kahoy', ceb: 'balanghoy' },
  { en: 'sweet potato', tl: 'kamote', ceb: 'kamote' },
  { en: 'tomato', tl: 'kamatis', ceb: 'kamatis' },
  { en: 'watermelon', tl: 'pakwan', ceb: 'sandiya' },
  { en: 'coconut', tl: 'niyog', ceb: 'lubi' },
  { en: 'mango', tl: 'mangga', ceb: 'mangga' },
  { en: 'fresh', tl: 'sariwa', ceb: 'presko' },
  { en: 'sweet', tl: 'matamis', ceb: 'tam-is' },
  { en: 'organic', tl: 'organiko', ceb: 'organiko' },
  { en: 'farm', tl: 'sakahan', ceb: 'uma' },
  { en: 'public market', tl: 'pampublikong palengke', ceb: 'publikong merkado' },
  { en: 'market', tl: 'palengke', ceb: 'merkado' },
  { en: 'trading post', tl: 'bagsakan', ceb: 'bagsakan' },
];

export function getLocalizedText(value, lang = 'en') {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value.en || '';
  }
  return String(value);
}

function applyGlossaryWords(text, targetLang) {
  let result = text;
  for (const entry of AGRI_GLOSSARY) {
    const regex = new RegExp(`\\b${entry.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, (match) => {
        const replacement = entry[targetLang] || entry.en;
        if (match[0] === match[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
    }
  }
  return result;
}

async function fetchLiveTranslation(text, targetLang) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2200);

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|${targetLang}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (translated && !translated.includes('MYMEMORY WARNING')) {
      return translated;
    }
    return null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function translateDynamicText(rawText) {
  const clean = String(rawText || '').trim();
  if (!clean) return { en: '', tl: '', ceb: '' };

  const exact = AGRI_GLOSSARY.find((g) => g.en.toLowerCase() === clean.toLowerCase());
  if (exact) {
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return { en: clean, tl: cap(exact.tl), ceb: cap(exact.ceb) };
  }

  const glossaryTl = applyGlossaryWords(clean, 'tl');
  const glossaryCeb = applyGlossaryWords(clean, 'ceb');

  const [apiTl, apiCeb] = await Promise.all([
    glossaryTl.toLowerCase() === clean.toLowerCase() ? fetchLiveTranslation(clean, 'tl') : null,
    glossaryCeb.toLowerCase() === clean.toLowerCase() ? fetchLiveTranslation(clean, 'ceb') : null,
  ]);

  return {
    en: clean,
    tl: apiTl || glossaryTl,
    ceb: apiCeb || glossaryCeb,
  };
}