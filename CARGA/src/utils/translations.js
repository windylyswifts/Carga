// Clean, feature-grouped trilingual dictionary (English, Tagalog, Cebuano)
// + offline-safe agricultural glossary & live fallback translator.

export const LANGUAGES = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'tl', label: 'TAG', fullName: 'Tagalog' },
  { code: 'ceb', label: 'CEB', fullName: 'Cebuano' },
];

// Each entry keeps EN / TAG / CEB side-by-side by feature domain for easy maintenance
const DICTIONARY_SECTIONS = {
  global: {
    prototypeTag: {
      en: 'Pitch Prototype',
      tl: 'Prototipo ng Sistema',
      ceb: 'Prototipo sa Sistema',
    },
    roleOrdinary: {
      en: 'Ordinary (Farmer)',
      tl: 'Karaniwan (Magsasaka)',
      ceb: 'Ordinaryo (Mag-uuma)',
    },
    roleDriver: {
      en: 'Driver / Lender',
      tl: 'Drayber / Nagpapahiram',
      ceb: 'Drayber / Nagpahulam',
    },
    badgeLiveTrip: {
      en: '1 Live Trip',
      tl: '1 Biyahe Ngayon',
      ceb: '1 Biyahe Karon',
    },
    badgeOnline: {
      en: '{count} Online',
      tl: '{count} Online',
      ceb: '{count} Online',
    },
  },

  farmerHome: {
    farmerBadge: {
      en: 'Farmer Home',
      tl: 'Tahanan ng Magsasaka',
      ceb: 'Balay sa Mag-uuma',
    },
    farmerTitle: {
      en: 'Welcome, {name}',
      tl: 'Maligayang pagdating, {name}',
      ceb: 'Maayong pag-abot, {name}',
    },
    farmerSubtitle: {
      en: 'What would you like to do today?',
      tl: 'Ano ang gusto mong gawin ngayon?',
      ceb: 'Unsa ang imong buhaton karon?',
    },
    cardBookTitle: {
      en: 'Book a Truck',
      tl: 'Mag-book ng Trak',
      ceb: 'Pag-book og Trak',
    },
    cardBookSub: {
      en: 'Send harvest to market',
      tl: 'Ihatid ang ani sa palengke',
      ceb: 'Ihatod ang abot sa merkado',
    },
    cardPermitTitle: {
      en: 'Transport Permit',
      tl: 'Transport Permit',
      ceb: 'Transport Permit',
    },
    cardPermitSub: {
      en: 'Apply or view clearance',
      tl: 'Mag-apply o tingnan ang permit',
      ceb: 'Pag-apply o tan-awa ang permit',
    },
    cardPermitApprovedSub: {
      en: 'Cleared ({id}) • Tap to view',
      tl: 'Aprubado ({id}) • Pindutin',
      ceb: 'Aprubado ({id}) • Pindota',
    },
    cardPermitPendingSub: {
      en: 'On Hold ({id}) • Processing',
      tl: 'Naka-hold ({id}) • Pinoproseso',
      ceb: 'Naka-hold ({id}) • Giproseso',
    },
    activeTripBannerLabel: {
      en: 'Active Delivery • {stage}',
      tl: 'Kasalukuyang Biyahe • {stage}',
      ceb: 'Aktibong Biyahe • {stage}',
    },
    activeTripBannerSub: {
      en: '{driver} • {km} km left • Tap to open GPS map',
      tl: '{driver} • {km} km na lang • Buksan ang GPS map',
      ceb: '{driver} • {km} km na lang • Ablihi ang GPS map',
    },
    btnTrackLive: {
      en: 'Live GPS',
      tl: 'Live GPS',
      ceb: 'Live GPS',
    },
    homeActivityTitle: {
      en: 'Activity & Trip Log',
      tl: 'Talaan ng Aktibidad at Biyahe',
      ceb: 'Talaan sa Aktibidad ug Biyahe',
    },
    homeActivitySub: {
      en: 'Tap to view full booking and permit history',
      tl: 'Pindutin upang makita ang buong kasaysayan',
      ceb: 'Pindota aron makita ang tibuok kasaysayan',
    },
    homeActivityViewAll: {
      en: 'View All',
      tl: 'Tingnan Lahat',
      ceb: 'Tan-awa Tanan',
    },
    navHome: { en: 'Home', tl: 'Home', ceb: 'Home' },
    navHistory: { en: 'History', tl: 'Kasaysayan', ceb: 'Kasaysayan' },
    navNotifications: { en: 'Alerts', tl: 'Abiso', ceb: 'Pahibalo' },
    navProfile: { en: 'Profile', tl: 'Profile', ceb: 'Profile' },
    btnBackToHome: {
      en: 'Back to Home',
      tl: 'Bumalik sa Home',
      ceb: 'Balik sa Home',
    },
    permitActiveChip: {
      en: 'Permit {id}',
      tl: 'Permit {id}',
      ceb: 'Permit {id}',
    },
  },

  farmerTabs: {
    historyTitle: {
      en: 'Activity & Trip History',
      tl: 'Kasaysayan ng Aktibidad at Biyahe',
      ceb: 'Kasaysayan sa Aktibidad ug Biyahe',
    },
    historySubtitle: {
      en: 'Record of your truck bookings, deliveries, and transport permits',
      tl: 'Talaan ng mga na-book na trak, paghahatid, at transport permit',
      ceb: 'Talaan sa mga na-book nga trak, paghatod, ug transport permit',
    },
    historyEmpty: {
      en: 'No recorded activity yet. Book a truck or apply for a permit to get started.',
      tl: 'Wala pang naitalang aktibidad.',
      ceb: 'Wala pay natala nga aktibidad.',
    },
    notifTitle: {
      en: 'Notifications',
      tl: 'Mga Abiso',
      ceb: 'Mga Pahibalo',
    },
    notifSubtitle: {
      en: 'Updates on your truck trips and transport permit status',
      tl: 'Mga update sa iyong biyahe at transport permit',
      ceb: 'Mga update sa imong biyahe ug transport permit',
    },
    btnMarkAllRead: {
      en: 'Mark all read',
      tl: 'Markahang nabasa',
      ceb: 'Markahi nga nabasa',
    },
    notifEmpty: {
      en: 'You are all caught up!',
      tl: 'Walang bagong abiso!',
      ceb: 'Walay bag-ong pahibalo!',
    },
    profileTitle: {
      en: 'Farmer Profile',
      tl: 'Profile ng Magsasaka',
      ceb: 'Profile sa Mag-uuma',
    },
    profileSubtitle: {
      en: 'Your details auto-fill pickup locations and transport permits',
      tl: 'Awtomatikong gagamitin ang impormasyong ito sa pag-book at permit',
      ceb: 'Awtomatikong gamiton kini sa pag-book ug transport permit',
    },
    profileNameLabel: {
      en: 'Full Name',
      tl: 'Buong Pangalan',
      ceb: 'Tibuok Ngalan',
    },
    profileFarmLabel: {
      en: 'Default Farm / Barangay Location',
      tl: 'Lokasyon ng Sakahan / Barangay',
      ceb: 'Lokasyon sa Uma / Barangay',
    },
    profilePhoneLabel: {
      en: 'Mobile Number',
      tl: 'Numero ng Telepono',
      ceb: 'Numero sa Telepono',
    },
    profileCoopLabel: {
      en: 'Cooperative / Association (Optional)',
      tl: 'Kooperatiba / Samahan (Opsyonal)',
      ceb: 'Kooperatiba / Asosasyon (Opsyonal)',
    },
    profileLangLabel: {
      en: 'Preferred Language',
      tl: 'Gustong Wika',
      ceb: 'Pinulongan',
    },
    btnSaveProfile: {
      en: 'Save Profile',
      tl: 'I-save ang Profile',
      ceb: 'I-save ang Profile',
    },
    profileSavedToast: {
      en: 'Profile updated!',
      tl: 'Na-update na ang profile!',
      ceb: 'Na-update na ang profile!',
    },
  },

  tripStages: {
    stage0Label: { en: 'Request Sent', tl: 'Naipadala na', ceb: 'Gipadala Na' },
    stage0Sub: {
      en: 'Waiting for driver to accept your trip',
      tl: 'Naghihintay tanggapin ng drayber ang biyahe',
      ceb: 'Naghulat nga dawaton sa drayber ang biyahe',
    },
    stage0DriverBtn: {
      en: 'Accept Hauling Job',
      tl: 'Tanggapin ang Biyahe',
      ceb: 'Dawata ang Biyahe',
    },
    stage1Label: { en: 'On the Way', tl: 'Papunta Na', ceb: 'Padulong Na' },
    stage1Sub: {
      en: 'Driver accepted and is heading to your farm',
      tl: 'Tinanggap na ng drayber at papunta na sa sakahan',
      ceb: 'Gidawat na sa drayber ug padulong na sa imong uma',
    },
    stage1DriverBtn: {
      en: 'Confirm Arrival at Farm',
      tl: 'Kumpirmahin ang Pagdating sa Sakahan',
      ceb: 'Kumpirmaha nga Niabot na sa Uma',
    },
    stage2Label: { en: 'Loading', tl: 'Nagkakarga', ceb: 'Nagkarga' },
    stage2Sub: {
      en: 'Loading your sacks onto the truck at the farm',
      tl: 'Ikinakarga na ang mga sako sa trak',
      ceb: 'Gikarga na ang mga sako sa trak sa uma',
    },
    stage2DriverBtn: {
      en: 'Finish Loading & Start Delivery',
      tl: 'Tapos Magkarga & Simulan ang Paghatid',
      ceb: 'Human na Karga & Sugdi ang Paghatod',
    },
    stage3Label: { en: 'Delivering', tl: 'Hinahatid Na', ceb: 'Gihatod Na' },
    stage3Sub: {
      en: 'Truck is en route to the destination market',
      tl: 'Papunta na ang trak sa palengke o destinasyon',
      ceb: 'Padulong na ang trak sa merkado o destinasyon',
    },
    stage3DriverBtn: {
      en: 'Confirm Drop-off & Complete Trip',
      tl: 'Kumpirmahin ang Pagbaba & Tapusin',
      ceb: 'Kumpirmaha ang Pagdiskarga & Humana',
    },
    stage4Label: { en: 'Arrived', tl: 'Nakarating Na', ceb: 'Niabot Na' },
    stage4Sub: {
      en: 'Crops delivered safely at destination!',
      tl: 'Ligtas nang naihatid ang iyong ani!',
      ceb: 'Luwas nang nahatud ang imong abot!',
    },
  },

  bookingWizard: {
    bookingFormTitle: {
      en: 'Send Your Harvest to Market',
      tl: 'Ihatid ang Iyong Ani sa Palengke',
      ceb: 'Ihatod ang Imong Abot sa Merkado',
    },
    stepIndicator: {
      en: 'Step {current} of 3',
      tl: 'Hakbang {current} ng 3',
      ceb: 'Lakang {current} sa 3',
    },
    step1Short: { en: 'Locations', tl: 'Lugar', ceb: 'Lugar' },
    step2Short: { en: 'Crop & Sacks', tl: 'Pananim at Sako', ceb: 'Tanom ug Sako' },
    step3Short: { en: 'Choose Truck', tl: 'Piliin ang Trak', ceb: 'Pili og Trak' },

    step1Title: {
      en: 'Where is your pickup and drop-off?',
      tl: 'Saan kukunin at ihahatid ang ani?',
      ceb: 'Asa kuhaon ug asa ihatod ang abot?',
    },
    labelPickup: {
      en: 'Where is your farm?',
      tl: 'Saan ang iyong sakahan?',
      ceb: 'Asa ang imong uma?',
    },
    placeholderPickup: {
      en: 'Enter farm or barangay',
      tl: 'Ilagay ang sakahan o barangay',
      ceb: 'Ibutang ang uma o barangay',
    },
    gpsUseMyLocation: {
      en: 'Use My GPS',
      tl: 'Gamitin ang GPS Ko',
      ceb: 'Gamita ang Akong GPS',
    },
    gpsLocating: {
      en: 'Locating...',
      tl: 'Hinahanap...',
      ceb: 'Gipangita...',
    },
    gpsPinnedBadge: {
      en: 'GPS Pinned ({coords})',
      tl: 'Naka-pin ang GPS ({coords})',
      ceb: 'Naka-pin ang GPS ({coords})',
    },
    labelDestination: {
      en: 'Where are the crops going?',
      tl: 'Saan dadalhin ang ani?',
      ceb: 'Asa dad-on ang abot?',
    },
    placeholderDestination: {
      en: 'Enter market or drop-off place',
      tl: 'Ilagay ang palengke o bababaan',
      ceb: 'Ibutang ang merkado o kanaoganan',
    },
    labelMainRoadToggle: {
      en: 'Main Road / City-to-City Transport',
      tl: 'Pangunahing Kalsada / Biyaheng Lungsod-sa-Lungsod',
      ceb: 'Main Road / Biyaheng Siyudad-paingon-Siyudad',
    },
    btnNextStep: {
      en: 'Next Step',
      tl: 'Susunod na Hakbang',
      ceb: 'Sunod nga Lakang',
    },
    btnBack: { en: 'Back', tl: 'Bumalik', ceb: 'Balik' },

    step2Title: {
      en: 'What crop and how many sacks?',
      tl: 'Anong pananim at ilang sako?',
      ceb: 'Unsang tanom ug pila ka sako?',
    },
    labelCropSending: {
      en: 'What crop are you sending?',
      tl: 'Anong pananim ang ipapadala?',
      ceb: 'Unsang tanom ang imong ipadala?',
    },
    placeholderCropSending: {
      en: 'e.g., Bananas, Rice, Corn',
      tl: 'hal., Saging, Palay, Mais',
      ceb: 'pananglitan, Saging, Humay, Mais',
    },
    labelSackSize: {
      en: 'Weight per Sack',
      tl: 'Timbang Bawat Sako',
      ceb: 'Gibug-aton Matag Sako',
    },
    sackOption50: {
      en: '50 kg per sack (Standard Sack)',
      tl: '50 kg bawat sako (Karaniwang Sako)',
      ceb: '50 kg matag sako (Standard nga Sako)',
    },
    sackOption25: {
      en: '25 kg per sack (Half Sack)',
      tl: '25 kg bawat sako (Kalahating Sako)',
      ceb: '25 kg matag sako (Tunga nga Sako)',
    },
    labelSackCount: {
      en: 'How many sacks?',
      tl: 'Ilang sako lahat?',
      ceb: 'Pila ka sako tanan?',
    },
    sacksUnit: {
      en: '{count} Sacks',
      tl: '{count} Sako',
      ceb: '{count} Sako',
    },
    totalWeightSummary: {
      en: 'Total Weight: {kg} kg',
      tl: 'Kabuuang Timbang: {kg} kg',
      ceb: 'Tibuok Gibug-aton: {kg} kg',
    },

    step3Title: {
      en: 'Select an Available Truck',
      tl: 'Pumili ng Magagamit na Trak',
      ceb: 'Pili og Magamit nga Trak',
    },
    step3Subtitle: {
      en: 'Showing trucks that can carry {kg} kg',
      tl: 'Mga trak na kayang magdala ng {kg} kg',
      ceb: 'Mga trak nga makadala og {kg} kg',
    },
    noCapableTrucksTitle: {
      en: 'No available truck can carry {kg} kg right now',
      tl: 'Walang bukas na trak na kayang magdala ng {kg} kg ngayon',
      ceb: 'Walay online nga trak nga makadala og {kg} kg karon',
    },
    noCapableTrucksSub: {
      en: 'Go back to reduce sacks or turn on a larger truck in Driver / Lender.',
      tl: 'Bumalik upang bawasan ang sako o magbukas ng mas malaking trak sa Drayber.',
      ceb: 'Balik aron pakunhuran ang sako o i-on ang mas dako nga trak sa Drayber.',
    },
    btnConfirmBooking: {
      en: 'Confirm Booking',
      tl: 'Kumpirmahin ang Trak',
      ceb: 'Kumpirmaha ang Trak',
    },
    btnConfirmingBooking: {
      en: 'Confirming...',
      tl: 'Kinukumpirma...',
      ceb: 'Gikumpirma...',
    },
  },

  permitSystem: {
    permitModalBadge: {
      en: 'Transport Clearance Required',
      tl: 'Kailangan ng Transport Permit',
      ceb: 'Kinahanglan og Transport Permit',
    },
    permitModalTitle: {
      en: 'Apply for Plant Transport Permit',
      tl: 'Mag-apply para sa Plant Transport Permit',
      ceb: 'Pag-apply og Plant Transport Permit',
    },
    permitTriggerWeight: {
      en: 'Cargo exceeds 8,000 kg ({kg} kg)',
      tl: 'Lumampas sa 8,000 kg ang karga ({kg} kg)',
      ceb: 'Nilapas sa 8,000 kg ang karga ({kg} kg)',
    },
    permitTriggerRoute: {
      en: 'Main Road / City-to-City route detected',
      tl: 'Dadaan sa Pangunahing Kalsada / Lungsod-sa-Lungsod',
      ceb: 'Moagi sa Main Road / Siyudad-paingon-Siyudad',
    },
    permitAttr1Label: {
      en: '1. Name, Kind and Quantity of Plants/Planting Materials/Plant Products',
      tl: '1. Pangalan, Uri at Dami ng Halaman / Produktong Pananim',
      ceb: '1. Ngalan, Matang ug Gidaghanon sa Tanom / Produktong Abot',
    },
    permitAttr1Placeholder: {
      en: 'e.g., Cardava Bananas (Saba) — 170 Sacks',
      tl: 'hal., Saging na Saba — 170 Sako',
      ceb: 'pananglitan, Saging nga Sab-a — 170 Sako',
    },
    permitAttr2Label: {
      en: '2. Your Full Name',
      tl: '2. Buong Pangalan Mo',
      ceb: '2. Imong Tibuok Ngalan',
    },
    permitAttr2Placeholder: {
      en: 'Enter farmer or shipper full name',
      tl: 'Ilagay ang iyong buong pangalan',
      ceb: 'Ibutang ang imong tibuok ngalan',
    },
    permitAttr3Label: {
      en: '3. Source of Plants/Planting Materials/Plant Products',
      tl: '3. Pinagmulan ng Halaman / Produktong Pananim',
      ceb: '3. Gigikanan sa Tanom / Produktong Abot',
    },
    permitAttr3Placeholder: {
      en: 'Enter farm origin / barangay / municipality',
      tl: 'Ilagay ang sakahan / barangay / bayan',
      ceb: 'Ibutang ang uma / barangay / lungsod',
    },
    permitAttr4Label: {
      en: '4. Declared Means of Conveyance',
      tl: '4. Idineklarang Sasakyan (Means of Conveyance)',
      ceb: '4. Gideklarar nga Sakyanan (Means of Conveyance)',
    },
    permitAttr4Placeholder: {
      en: 'e.g., Cargo Truck / 6-Wheeler Hauling Vehicle',
      tl: 'hal., Cargo Truck / 6-Wheeler Truck',
      ceb: 'pananglitan, Cargo Truck / 6-Wheeler Truck',
    },
    permitAttr5Label: {
      en: '5. Weight in Kilos',
      tl: '5. Timbang sa Kilo (Weight in Kilos)',
      ceb: '5. Gibug-aton sa Kilo (Weight in Kilos)',
    },
    btnAvailPermitAuth: {
      en: 'Avail for Permit & Authenticate',
      tl: 'Kumuha ng Permit at I-authenticate',
      ceb: 'Kuha og Permit ug I-authenticate',
    },
    btnAuthenticating: {
      en: 'Authenticating...',
      tl: 'Pinapatunayan...',
      ceb: 'Gipamatud-an...',
    },
    permitHoldTitle: {
      en: 'Booking On Hold — Waiting for Permit Approval',
      tl: 'Naka-hold ang Booking — Naghihintay ng Permit',
      ceb: 'Naka-hold ang Booking — Naghulat sa Permit',
    },
    permitHoldSub: {
      en: 'Your transport permit ({id}) is being processed. Once approved, you can proceed to Step 3 to choose a truck.',
      tl: 'Pinoproseso na ang iyong permit ({id}). Kapag naaprubahan na, maaari ka nang magpatuloy sa Hakbang 3.',
      ceb: 'Giproseso na ang imong permit ({id}). Kon maaprobahan na, mahimo ka nang mopadayon sa Lakang 3.',
    },
    btnSimApprovePermit: {
      en: 'Simulate Permit Approval (Demo)',
      tl: 'I-simulate ang Pag-apruba ng Permit (Demo)',
      ceb: 'I-simulate ang Pag-aprobar sa Permit (Demo)',
    },
    permitApprovedTitle: {
      en: 'Permit Authenticated & Approved ({id})',
      tl: 'Naaprubahan na ang Permit ({id})',
      ceb: 'Naaprobahan na ang Permit ({id})',
    },
    permitApprovedSub: {
      en: 'Your official soft copy is ready and will be sent to your assigned driver.',
      tl: 'Handa na ang soft copy at ipapadala sa iyong drayber.',
      ceb: 'Andam na ang soft copy ug ipadala sa imong drayber.',
    },
    btnProceedStep3: {
      en: 'Proceed to Step 3: Choose Truck',
      tl: 'Magpatuloy sa Hakbang 3: Piliin ang Trak',
      ceb: 'Padayon sa Lakang 3: Pili og Trak',
    },
    btnViewPermitCopy: {
      en: 'View Soft Copy',
      tl: 'Tingnan ang Soft Copy',
      ceb: 'Tan-awa ang Soft Copy',
    },
    driverPermitBannerTitle: {
      en: 'Official Transport Permit Attached',
      tl: 'May Kasamang Opisyal na Transport Permit',
      ceb: 'Naay Opisyal nga Transport Permit',
    },
    driverPermitBannerSub: {
      en: 'Show soft copy to checkpoint officials when requested',
      tl: 'Ipakita ang soft copy sa mga opisyal kung hihingin',
      ceb: 'Ipakita ang soft copy sa mga opisyal kon pangayoon',
    },
    btnShowPermitSoftCopy: {
      en: 'Show Permit Soft Copy',
      tl: 'Ipakita ang Soft Copy ng Permit',
      ceb: 'Ipakita ang Soft Copy sa Permit',
    },
    softCopyHeader: {
      en: 'OFFICIAL PLANT TRANSPORT PERMIT (SOFT COPY)',
      tl: 'OPISYAL NA PLANT TRANSPORT PERMIT (SOFT COPY)',
      ceb: 'OPISYAL NGA PLANT TRANSPORT PERMIT (SOFT COPY)',
    },
    softCopyVerifiedStamp: {
      en: 'AUTHENTICATED & CLEARED',
      tl: 'NA-AUTHENTICATE AT APRUBADO',
      ceb: 'NA-AUTHENTICATE UG APRUBADO',
    },
    softCopyRefLabel: {
      en: 'Permit Reference No.',
      tl: 'Numero ng Permit',
      ceb: 'Numero sa Permit',
    },
    softCopyIssuedLabel: {
      en: 'Date Authenticated',
      tl: 'Petsa ng Pag-apruba',
      ceb: 'Petsa sa Pag-aprobar',
    },
    btnCloseModal: { en: 'Close', tl: 'Isara', ceb: 'Sirad-i' },
  },

  gpsTracker: {
    waitingForDriverBadge: {
      en: 'WAITING FOR DRIVER',
      tl: 'NAGHIHINTAY SA DRAYBER',
      ceb: 'NAGHULAT SA DRAYBER',
    },
    deliveredBadge: {
      en: 'DELIVERED',
      tl: 'NAIHATID NA',
      ceb: 'NAHATOD NA',
    },
    liveMapBadge: {
      en: 'LIVE GPS TRACKER',
      tl: 'LIVE NA GPS TRACKER',
      ceb: 'LIVE NGA GPS TRACKER',
    },
    gpsFollowTruck: {
      en: 'Follow Truck',
      tl: 'Sundan ang Trak',
      ceb: 'Sunda ang Trak',
    },
    gpsViewRoute: {
      en: 'Full Route',
      tl: 'Buong Ruta',
      ceb: 'Tibuok Ruta',
    },
    gpsLayerStreet: { en: 'Map', tl: 'Mapa', ceb: 'Mapa' },
    gpsLayerSat: { en: 'Satellite', tl: 'Satelayt', ceb: 'Satelayt' },
    gpsSpeedLabel: { en: 'Speed', tl: 'Bilis', ceb: 'Gikusgon' },
    gpsDistanceLeft: {
      en: 'Distance Left',
      tl: 'Natitirang Layo',
      ceb: 'Nabiling Layo',
    },
    gpsCoordsLabel: {
      en: 'Truck GPS',
      tl: 'GPS ng Trak',
      ceb: 'GPS sa Trak',
    },
    gpsSignalSourceSim: {
      en: 'Auto GPS Telemetry',
      tl: 'Auto GPS Telemetry',
      ceb: 'Auto GPS Telemetry',
    },
    gpsSignalSourceHardware: {
      en: 'Live Device GPS',
      tl: 'Live na GPS ng Device',
      ceb: 'Live nga GPS sa Device',
    },
    btnNudgeGpsDemo: {
      en: 'Advance GPS (+15%)',
      tl: 'I-abante ang GPS (+15%)',
      ceb: 'I-abante ang GPS (+15%)',
    },
    btnSimAccept: {
      en: 'Simulate Driver Accept',
      tl: 'I-simulate ang Pagtanggap ng Drayber',
      ceb: 'I-simulate ang Pagdawat sa Drayber',
    },
    btnNextStepDemo: {
      en: 'Next Trip Step (Demo)',
      tl: 'Susunod na Hakbang (Demo)',
      ceb: 'Sunod nga Lakang (Demo)',
    },
    btnBookAnother: {
      en: 'Book Another Truck',
      tl: 'Mag-book ng Ibang Trak',
      ceb: 'Pag-book og Laing Trak',
    },
    whatHappeningNow: {
      en: 'What is happening now',
      tl: 'Ano ang nangyayari ngayon',
      ceb: 'Unsay nahitabo karon',
    },
    arrivalTimeLabel: {
      en: 'Arrival Time',
      tl: 'Oras ng Pagdating',
      ceb: 'Oras sa Pag-abot',
    },
    arrivedExcl: {
      en: 'Arrived!',
      tl: 'Nakarating Na!',
      ceb: 'Niabot Na!',
    },
    minsApprox: {
      en: '~{mins} mins',
      tl: '~{mins} minuto',
      ceb: '~{mins} minutos',
    },
    mapPinFarm: { en: 'YOUR FARM', tl: 'SAKAHAN MO', ceb: 'IMONG UMA' },
    mapPinMarket: { en: 'MARKET', tl: 'PALENGKE', ceb: 'MERKADO' },
    yourDriverHeader: {
      en: 'Your Driver',
      tl: 'Ang Iyong Drayber',
      ceb: 'Ang Imong Drayber',
    },
    callDriverBtn: {
      en: 'Call Driver ({phone})',
      tl: 'Tawagan ang Drayber ({phone})',
      ceb: 'Tawagi ang Drayber ({phone})',
    },
    yourLoadHeader: {
      en: 'Your Load',
      tl: 'Ang Iyong Karga',
      ceb: 'Ang Imong Karga',
    },
    cropColon: { en: 'Crop:', tl: 'Pananim:', ceb: 'Tanom:' },
    totalLoadColon: {
      en: 'Total Load:',
      tl: 'Kabuuang Karga:',
      ceb: 'Tibuok Karga:',
    },
    distanceCostLabel: {
      en: 'Distance ({km} km × ₱{rate}):',
      tl: 'Distansya ({km} km × ₱{rate}):',
      ceb: 'Distansya ({km} km × ₱{rate}):',
    },
    handlingCostLabel: {
      en: 'Handling ({kg} kg × ₱{rate}):',
      tl: 'Pagkarga ({kg} kg × ₱{rate}):',
      ceb: 'Pagkarga ({kg} kg × ₱{rate}):',
    },
    multiplierLabel: {
      en: 'Availability Multiplier (S):',
      tl: 'Availability Multiplier (S):',
      ceb: 'Availability Multiplier (S):',
    },
    totalPaymentLabel: {
      en: 'Total Payment',
      tl: 'Kabuuang Babayaran',
      ceb: 'Tibuok Bayranan',
    },
    noMiddlemanNote: {
      en: 'Pay directly to the driver—no middleman fee',
      tl: 'Direktang bayad sa drayber—walang kaltas ng middleman',
      ceb: 'Direktang bayad sa drayber—walay kaltas sa middleman',
    },
  },

  driverPortal: {
    driverPortalBadge: {
      en: 'Driver / Lender Portal',
      tl: 'Portal ng Drayber / Nagpapahiram',
      ceb: 'Portal sa Drayber / Nagpahulam',
    },
    driverPortalTitle: {
      en: 'Truck Dispatch & Availability',
      tl: 'Biyahe at Kahandaan ng Trak',
      ceb: 'Biyahe ug Kaandam sa Trak',
    },
    viewingAccount: {
      en: 'Viewing Account:',
      tl: 'Gamit na Account:',
      ceb: 'Gigamit nga Account:',
    },
    otherTruckBookedMsg: {
      en: 'A farmer booked {driver} ({model}).',
      tl: 'May magsasakang nag-book kay {driver} ({model}).',
      ceb: 'Naay mag-uuma nga nag-book kang {driver} ({model}).',
    },
    switchDriverViewBtn: {
      en: "Switch to {name}'s View",
      tl: 'Lumipat sa View ni {name}',
      ceb: 'Balhin sa View ni {name}',
    },
    maxCapacityLine: {
      en: 'Max Load: {kg} kg',
      tl: 'Kayang Karga: {kg} kg',
      ceb: 'Makadala og: {kg} kg',
    },
    visibleToFarmers: {
      en: '● VISIBLE TO FARMERS — Farmers can currently book your truck.',
      tl: '● NAKIKITA NG MAGSASAKA — Maaari nang i-book ang trak mo.',
      ceb: '● MAKITA SA MAG-UUMA — Mahimo nang i-book ang imong trak.',
    },
    offlineFromFarmers: {
      en: '○ OFFLINE — Hidden from farmers until you turn availability ON.',
      tl: '○ OFFLINE — Nakatago sa mga magsasaka hanggang buksan mo.',
      ceb: '○ OFFLINE — Nakatago sa mga mag-uuma hangtod i-on nimo.',
    },
    btnAvailableOn: {
      en: 'Available for Service (ON)',
      tl: 'Handa sa Biyahe (BUKAS)',
      ceb: 'Andam sa Serbisyo (ON)',
    },
    btnAvailableOff: {
      en: 'Go Online Now (OFF)',
      tl: 'Mag-online Ngayon (SARADO)',
      ceb: 'Mag-online Karon (OFF)',
    },
    driverGpsBroadcastTitle: {
      en: 'Live GPS Location Broadcast',
      tl: 'Live na Pagbabahagi ng GPS',
      ceb: 'Live nga Pag-broadcast sa GPS',
    },
    driverGpsBroadcastOn: {
      en: 'Streaming real device GPS to farmer map',
      tl: 'Ipinapadala ang totoong GPS sa mapa ng magsasaka',
      ceb: 'Nagpadala sa tinuod nga GPS sa mapa sa mag-uuma',
    },
    driverGpsBroadcastOff: {
      en: 'Using route telemetry • Tap to stream phone GPS',
      tl: 'Gumagamit ng route telemetry • Pindutin para sa GPS',
      ceb: 'Naggamit og route telemetry • Pindota para sa GPS',
    },
    waitingRequestsTitle: {
      en: 'Waiting for Farmer Hauling Requests...',
      tl: 'Naghihintay ng Hiling na Biyahe mula sa Magsasaka...',
      ceb: 'Naghulat og Hangyo sa Biyahe gikan sa Mag-uuma...',
    },
    currentlyOfflineTitle: {
      en: 'You Are Currently Offline',
      tl: 'Kasalukuyan Kang Offline',
      ceb: 'Offline Ka Karon',
    },
    waitingRequestsSub: {
      en: 'Your truck is live on the farmer marketplace. Switch to Ordinary (Farmer) at the top and book this truck to see a live job appear here.',
      tl: 'Nakalista na ang trak mo. Lumipat sa Karaniwan (Magsasaka) sa itaas at mag-book para makita ang live na biyahe rito.',
      ceb: 'Nakalista na ang imong trak. Balhin sa Ordinaryo (Mag-uuma) sa ibabaw ug pag-book aron makita ang live nga trabaho dinhi.',
    },
    currentlyOfflineSub: {
      en: 'Turn your availability switch ON above so farmers in your area can book your vehicle.',
      tl: 'Buksan ang iyong availability switch sa itaas para makita ka ng mga magsasaka.',
      ceb: 'I-on ang imong availability switch sa ibabaw aron makita ka sa mga mag-uuma.',
    },
    newBookingBanner: {
      en: 'NEW FARMER BOOKING REQUEST',
      tl: 'BAGONG HILING NA BIYAHE NG MAGSASAKA',
      ceb: 'BAG-ONG HANGYO SA BIYAHE SA MAG-UUMA',
    },
    tripCompletedBanner: {
      en: 'TRIP COMPLETED',
      tl: 'TAPOS NA ANG BIYAHE',
      ceb: 'HUMAN NA ANG BIYAHE',
    },
    activeJobBanner: {
      en: 'ACTIVE JOB • {stage}',
      tl: 'KASALUKUYANG BIYAHE • {stage}',
      ceb: 'AKTIBONG BIYAHE • {stage}',
    },
    pickupAtFarmLabel: {
      en: 'Pickup at Farm',
      tl: 'Pagkukunan sa Sakahan',
      ceb: 'Kuhaanan sa Uma',
    },
    dropoffDestLabel: {
      en: 'Drop-off Destination',
      tl: 'Destinasyong Bababaan',
      ceb: 'Destinasyong Kanaoganan',
    },
    cargoLoadLabel: {
      en: 'Cargo Load',
      tl: 'Kargang Ani',
      ceb: 'Kargang Abot',
    },
    farmerContactLabel: {
      en: 'Farmer Contact',
      tl: 'Kontak ng Magsasaka',
      ceb: 'Kontak sa Mag-uuma',
    },
    yourTripPayout: {
      en: 'Your Trip Payout',
      tl: 'Kita Mo sa Biyahe',
      ceb: 'Kita Nimo sa Biyahe',
    },
    directCashNote: {
      en: '100% Direct Cash / GCash',
      tl: '100% Direktang Cash / GCash',
      ceb: '100% Direktang Cash / GCash',
    },
    btnDecline: { en: 'Decline', tl: 'Tanggihan', ceb: 'Balibari' },
    btnDoneNextFarmer: {
      en: 'Done — Ready for Next Farmer',
      tl: 'Tapos Na — Handa sa Susunod',
      ceb: 'Human Na — Andam sa Sunod',
    },
    standbyAreaTitle: {
      en: 'Current Standby Area',
      tl: 'Kasalukuyang Himpilan',
      ceb: 'Kasamtangang Standby Area',
    },
    standbyAreaSub: {
      en: 'Shown to nearby farmers looking for a truck',
      tl: 'Ipinapakita sa mga kalapit na magsasaka',
      ceb: 'Gipakita sa mga duol nga mag-uuma',
    },
    driverSummaryTitle: {
      en: 'Driver Summary',
      tl: 'Buod ng Drayber',
      ceb: 'Sumada sa Drayber',
    },
    totalEarningsLabel: {
      en: 'Total Earnings',
      tl: 'Kabuuang Kita',
      ceb: 'Tibuok Kita',
    },
    completedTripsLabel: {
      en: 'Completed Trips',
      tl: 'Natapos na Biyahe',
      ceb: 'Nahuman nga Biyahe',
    },
    farmerRatingLabel: {
      en: 'Farmer Rating',
      tl: 'Marka ng Magsasaka',
      ceb: 'Grado sa Mag-uuma',
    },
  },
};

// Build per-language lookup maps automatically from DICTIONARY_SECTIONS
export const UI_STRINGS = { en: {}, tl: {}, ceb: {} };

for (const section of Object.values(DICTIONARY_SECTIONS)) {
  for (const [key, translations] of Object.entries(section)) {
    UI_STRINGS.en[key] = translations.en;
    UI_STRINGS.tl[key] = translations.tl ?? translations.en;
    UI_STRINGS.ceb[key] = translations.ceb ?? translations.en;
  }
}

export function translateKey(lang, key, params = {}) {
  const dict = UI_STRINGS[lang] || UI_STRINGS.en;
  let result = dict[key] || UI_STRINGS.en[key] || key;

  for (const [paramKey, paramValue] of Object.entries(params)) {
    result = result.replaceAll(`{${paramKey}}`, String(paramValue));
  }
  return result;
}

// Offline-safe Philippine Agricultural & Location Glossary
const AGRI_GLOSSARY = [
  { en: 'cardava bananas (saba)', tl: 'saging na saba', ceb: 'saging nga sab-a' },
  { en: 'bananas (saba)', tl: 'saging (saba)', ceb: 'saging (sab-a)' },
  { en: 'bananas', tl: 'mga saging', ceb: 'mga saging' },
  { en: 'banana', tl: 'saging', ceb: 'saging' },
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
  { en: 'public market', tl: 'pampublikong palengke', ceb: 'publikong merkado' },
  { en: 'market', tl: 'palengke', ceb: 'merkado' },
  { en: 'farm', tl: 'sakahan', ceb: 'uma' },
];

export function getLocalizedText(value, lang = 'en') {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value.en || '';
  }
  return String(value);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyGlossaryWords(text, targetLang) {
  let result = text;
  for (const entry of AGRI_GLOSSARY) {
    const pattern = new RegExp(`\\b${escapeRegExp(entry.en)}\\b`, 'gi');
    result = result.replace(pattern, (match) => {
      const replacement = entry[targetLang] || entry.en;
      const isCapitalized = match[0] === match[0].toUpperCase();
      return isCapitalized
        ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
        : replacement;
    });
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
    return translated && !translated.includes('MYMEMORY WARNING') ? translated : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function translateDynamicText(rawText) {
  const clean = String(rawText || '').trim();
  if (!clean) return { en: '', tl: '', ceb: '' };

  const exact = AGRI_GLOSSARY.find((item) => item.en === clean.toLowerCase());
  if (exact) {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return { en: clean, tl: capitalize(exact.tl), ceb: capitalize(exact.ceb) };
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