// Complete static UI dictionary + dynamic crop/text translator for English, Tagalog, and Cebuano

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
    roleBusiness: 'Business (Buyer)',
    badgeLiveTrip: '1 Live Trip',
    badgeOnline: '{count} Online',
    badgeCrops: '{count} Crops',
    liveSyncActive: 'Live Sync Active',

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

    // Ordinary (Farmer) Dashboard
    farmerBadge: 'Farmer Home',
    farmerTitle: 'Send Your Harvest to Market',
    tabFindTruck: '1. Find a Truck',
    tabSellCrops: '2. Sell Crops ({count})',
    step1Title: 'Tell Us About Your Trip',
    step1Sub: 'Tap a quick choice below or type your own place',
    labelPickup: 'Where is your farm? (Pickup)',
    placeholderPickup: 'Type your barangay or farm...',
    labelDestination: 'Where are the crops going? (Drop-off)',
    placeholderDestination: 'Type market or drop-off place...',
    labelCropSending: 'What crop are you sending?',
    placeholderCropSending: 'e.g., Bananas, Rice, Corn...',
    labelSackCount: 'How many sacks?',
    sackHint: '(1 sack ≈ 50 kg)',
    sacksUnit: '{count} Sacks',
    aboutKgTotal: 'About {kg} kg total',
    step2Title: 'Choose a Truck ({count} Ready Nearby)',
    step2Sub: 'Tap the green button to book a driver and watch them on the map',
    noTrucksTitle: 'No trucks are online right now',
    noTrucksSub: 'Switch to the Driver / Lender tab at the top to turn a truck ON.',
    tooSmallBadge: 'Too Small (Max {max} Sacks)',
    fitsLoadBadge: 'Fits Your {count} Sacks',
    driverLabel: 'Driver:',
    canCarryLabel: 'Can Carry:',
    upToSacks: 'Up to {max} Sacks ({kg} kg)',
    parkedNearLabel: 'Parked Near:',
    totalTripCost: 'Total Trip Cost:',
    chooseBiggerTruck: 'Choose a Bigger Truck',
    truckOnTheWay: 'Truck is On the Way',
    finishCurrentTrip: 'Finish Current Trip First',
    bookThisTruck: 'Book This Truck',
    bookingProgress: 'Translating & Booking...',

    // Farmer Sell Crops Tab
    postCropsTitle: 'Post Crops for Sale',
    postCropsSub: 'Buyers and stores in the Business tab will see your crops right away.',
    labelCropName: 'Crop Name',
    placeholderCropName: 'e.g., Sweet Corn, Cabbage',
    labelHowManySacks: 'How Many Sacks?',
    labelPricePerKilo: 'Price per Kilo (₱)',
    btnPostCrops: 'Post My Crops',
    btnPostingCrops: 'Translating & Posting...',
    postSuccessMsg: 'Posted! Buyers can now see your crops.',
    yourPostedCrops: 'Your Posted Crops',
    statusReady: 'Ready for Pickup',
    statusSoldOut: 'Reserved / Sold Out',

    // Live Truck Tracker
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
    totalPaymentLabel: 'Total Payment',
    noMiddlemanNote: 'Pay directly to the driver—no middleman fee',

    // Driver / Lender Dashboard
    driverPortalBadge: 'Driver / Lender Portal',
    driverPortalTitle: 'Truck Dispatch & Availability',
    viewingAccount: 'Viewing Account:',
    otherTruckBookedMsg: 'A farmer booked {driver} ({model}).',
    switchDriverViewBtn: "Switch to {name}'s View",
    maxSacksLine: 'Max {max} Sacks ({kg} kg)',
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

    // Business Dashboard
    businessBadge: 'Business Portal • Direct Procurement',
    businessTitle: 'Available Farm Resources',
    businessSub: 'Source fresh harvests directly from local farmers at transparent farm-gate prices.',
    tabAvailableCrops: 'Available Crops ({count})',
    tabReservedOrders: 'Reserved Orders ({count})',
    reservedToast:
      'Reserved {sacks} sacks of {crop} from {farmer}! Inventory updated live.',
    viewOrderBtn: 'View Order',
    kpiTotalSupply: 'Total Available Supply',
    kpiSacksReady: '({sacks} sacks ready today)',
    kpiActiveListings: 'Active Farm Listings',
    kpiFarmsCount: '{count} Farms',
    kpiZeroMarkup: '0% middleman markup',
    kpiYourReservations: 'Your Reservations',
    kpiOrdersCount: '{count} Orders',
    kpiDirectFarm: 'Direct farm-to-business',
    searchPlaceholder: 'Search crop, farm location, or farmer...',
    catAll: 'All',
    catFruits: 'Fruits',
    catVegetables: 'Vegetables',
    catGrains: 'Grains & Corn',
    catRootCrops: 'Root Crops',
    noMatchingCrops: 'No matching crops found',
    noMatchingSub: 'Try clearing your search filter or post a new harvest in the Farmer tab.',
    producerLabel: 'Producer:',
    availableVolumeLabel: 'Available Volume:',
    farmOriginLabel: 'Farm Origin:',
    freshnessLabel: 'Freshness:',
    farmGatePriceLabel: 'Farm-Gate Price',
    btnFullyReserved: 'Fully Reserved',
    btnReserveSupply: 'Reserve Supply',
    noOrdersTitle: 'No reserved orders yet',
    noOrdersSub: 'Go to Available Crops and reserve produce from a local farm.',
    confirmedOrderBadge: 'Confirmed Reservation • {time}',
    supplierLabel: 'Supplier:',
    logisticsLabel: 'Logistics:',
    directFarmGateRate: '₱{price}/kg direct farm-gate',
    modalHeaderTag: 'Direct Farm Reservation',
    modalFromFarm: 'From {farmer} ({origin})',
    modalBusinessName: 'Your Business / Company Name',
    modalQtyLabel: 'Quantity to Reserve (Max {max} Sacks)',
    modalTransportLabel: 'Transport Arrangement',
    optAgriHaul: 'Farmer Delivers via AgriHaul',
    optBusinessPickup: 'Business Pick-up at Farm Gate',
    modalTotalPayout: 'Total Farm-Gate Payout',
    btnConfirmReservation: 'Confirm Harvest Reservation',
  },

  tl: {
    // Role Switcher & Global
    prototypeTag: 'Prototipo ng Sistema',
    roleOrdinary: 'Karaniwan (Magsasaka)',
    roleDriver: 'Drayber / Nagpapahiram',
    roleBusiness: 'Negosyo (Mamimili)',
    badgeLiveTrip: '1 Biyahe Ngayon',
    badgeOnline: '{count} Online',
    badgeCrops: '{count} Ani',
    liveSyncActive: 'Aktibo ang Live Sync',

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

    // Ordinary (Farmer) Dashboard
    farmerBadge: 'Tahanan ng Magsasaka',
    farmerTitle: 'Ihatid ang Iyong Ani sa Palengke',
    tabFindTruck: '1. Maghanap ng Trak',
    tabSellCrops: '2. Magbenta ng Ani ({count})',
    step1Title: 'Ilagay ang Detalye ng Biyahe',
    step1Sub: 'Pumili sa mga mabilisang opsyon o i-type ang lugar',
    labelPickup: 'Saan ang iyong sakahan? (Pagkukunan)',
    placeholderPickup: 'I-type ang barangay o sakahan...',
    labelDestination: 'Saan dadalhin ang ani? (Bababaan)',
    placeholderDestination: 'I-type ang palengke o bababaan...',
    labelCropSending: 'Anong pananim ang ipapadala?',
    placeholderCropSending: 'hal., Saging, Palay, Mais...',
    labelSackCount: 'Ilang sako lahat?',
    sackHint: '(1 sako ≈ 50 kg)',
    sacksUnit: '{count} Sako',
    aboutKgTotal: 'Tinatayang {kg} kg lahat',
    step2Title: 'Pumili ng Trak ({count} Handa sa Malapit)',
    step2Sub: 'Pindutin ang berdeng button para mag-book at sundan ang trak sa mapa',
    noTrucksTitle: 'Walang nakabukas na trak ngayon',
    noTrucksSub: 'Lumipat sa Drayber / Nagpapahiram sa itaas para magbukas ng trak.',
    tooSmallBadge: 'Masyadong Maliit (Max {max} Sako)',
    fitsLoadBadge: 'Kasya ang {count} Sako Mo',
    driverLabel: 'Drayber:',
    canCarryLabel: 'Kayang Dalhin:',
    upToSacks: 'Hanggang {max} Sako ({kg} kg)',
    parkedNearLabel: 'Nakahimpil sa:',
    totalTripCost: 'Kabuuang Bayad sa Biyahe:',
    chooseBiggerTruck: 'Pumili ng Mas Malaking Trak',
    truckOnTheWay: 'Papunta na ang Trak',
    finishCurrentTrip: 'Tapusin Muna ang Kasalukuyang Biyahe',
    bookThisTruck: 'Kunin ang Trak na Ito',
    bookingProgress: 'Isinasalin at Nagbu-book...',

    // Farmer Sell Crops Tab
    postCropsTitle: 'Mag-post ng Ibebentang Ani',
    postCropsSub: 'Makikita agad ng mga mamimili sa tab ng Negosyo ang iyong ani.',
    labelCropName: 'Pangalan ng Pananim',
    placeholderCropName: 'hal., Matamis na Mais, Repolyo',
    labelHowManySacks: 'Ilang Sako?',
    labelPricePerKilo: 'Presyo Bawat Kilo (₱)',
    btnPostCrops: 'I-post ang Aking Ani',
    btnPostingCrops: 'Isinasalin at Ipo-post...',
    postSuccessMsg: 'Na-post na! Makikita na ito ng mga mamimili.',
    yourPostedCrops: 'Mga Na-post Mong Ani',
    statusReady: 'Handa nang Kunin',
    statusSoldOut: 'Nakareserba / Ubos Na',

    // Live Truck Tracker
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
    totalPaymentLabel: 'Kabuuang Babayaran',
    noMiddlemanNote: 'Direktang bayad sa drayber—walang kaltas ng middleman',

    // Driver / Lender Dashboard
    driverPortalBadge: 'Portal ng Drayber / Nagpapahiram',
    driverPortalTitle: 'Biyahe at Kahandaan ng Trak',
    viewingAccount: 'Gamit na Account:',
    otherTruckBookedMsg: 'May magsasakang nag-book kay {driver} ({model}).',
    switchDriverViewBtn: 'Lumipat sa View ni {name}',
    maxSacksLine: 'Max {max} Sako ({kg} kg)',
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

    // Business Dashboard
    businessBadge: 'Portal ng Negosyo • Direktang Pagbili',
    businessTitle: 'Mga Magagamit na Ani sa Sakahan',
    businessSub: 'Bumili ng sariwang ani nang direkta mula sa mga magsasaka sa tamang presyo.',
    tabAvailableCrops: 'Mga Available na Ani ({count})',
    tabReservedOrders: 'Mga Nakareserbang Order ({count})',
    reservedToast:
      'Nakareserba na ang {sacks} sako ng {crop} mula kay {farmer}! Na-update na ang imbentaryo.',
    viewOrderBtn: 'Tingnan ang Order',
    kpiTotalSupply: 'Kabuuang Suplay na Handa',
    kpiSacksReady: '({sacks} sako ang handa ngayon)',
    kpiActiveListings: 'Mga Aktibong Sakahan',
    kpiFarmsCount: '{count} Sakahan',
    kpiZeroMarkup: '0% patong ng middleman',
    kpiYourReservations: 'Mga Reserba Mo',
    kpiOrdersCount: '{count} Order',
    kpiDirectFarm: 'Direkta mula sakahan',
    searchPlaceholder: 'Maghanap ng pananim, lugar ng sakahan, o magsasaka...',
    catAll: 'Lahat',
    catFruits: 'Prutas',
    catVegetables: 'Gulay',
    catGrains: 'Butil at Mais',
    catRootCrops: 'Lamang-Ugat',
    noMatchingCrops: 'Walang nahanap na katugmang pananim',
    noMatchingSub: 'Subukang burahin ang filter o mag-post ng bagong ani sa tab ng Magsasaka.',
    producerLabel: 'Magsasaka:',
    availableVolumeLabel: 'Dami ng Handa:',
    farmOriginLabel: 'Pinagmulan:',
    freshnessLabel: 'Kasariwaan:',
    farmGatePriceLabel: 'Presyo sa Sakahan',
    btnFullyReserved: 'Nakareserba Na Lahat',
    btnReserveSupply: 'Ireserba ang Suplay',
    noOrdersTitle: 'Wala pang nakareserbang order',
    noOrdersSub: 'Pumunta sa Mga Available na Ani at magreserba mula sa sakahan.',
    confirmedOrderBadge: 'Kumpirmadong Reserba • {time}',
    supplierLabel: 'Magsasaka:',
    logisticsLabel: 'Paghahatid:',
    directFarmGateRate: '₱{price}/kg direktang presyo sa sakahan',
    modalHeaderTag: 'Direktang Pagreserba sa Sakahan',
    modalFromFarm: 'Mula kay {farmer} ({origin})',
    modalBusinessName: 'Pangalan ng Iyong Negosyo / Tindahan',
    modalQtyLabel: 'Dami ng Irereserba (Max {max} Sako)',
    modalTransportLabel: 'Paraan ng Pagkuha / Paghatid',
    optAgriHaul: 'Ihahatid ng Magsasaka gamit ang AgriHaul',
    optBusinessPickup: 'Kukunin ng Negosyo sa Sakahan',
    modalTotalPayout: 'Kabuuang Babayaran sa Magsasaka',
    btnConfirmReservation: 'Kumpirmahin ang Pagreserba',
  },

  ceb: {
    // Role Switcher & Global
    prototypeTag: 'Prototipo sa Sistema',
    roleOrdinary: 'Ordinaryo (Mag-uuma)',
    roleDriver: 'Drayber / Nagpahulam',
    roleBusiness: 'Negosyo (Mamamalit)',
    badgeLiveTrip: '1 Biyahe Karon',
    badgeOnline: '{count} Online',
    badgeCrops: '{count} Abot',
    liveSyncActive: 'Aktibo ang Live Sync',

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

    // Ordinary (Farmer) Dashboard
    farmerBadge: 'Balay sa Mag-uuma',
    farmerTitle: 'Ihatod ang Imong Abot sa Merkado',
    tabFindTruck: '1. Pangita og Trak',
    tabSellCrops: '2. Ibaligya ang Abot ({count})',
    step1Title: 'Isulti Kanamo ang Imong Biyahe',
    step1Sub: 'Pindota ang pilianan sa ubos o i-type ang imong lugar',
    labelPickup: 'Asa ang imong uma? (Kuhaanan)',
    placeholderPickup: 'I-type ang barangay o uma...',
    labelDestination: 'Asa dad-on ang abot? (Kanaoganan)',
    placeholderDestination: 'I-type ang merkado o kanaoganan...',
    labelCropSending: 'Unsang tanom ang imong ipadala?',
    placeholderCropSending: 'pananglitan, Saging, Humay, Mais...',
    labelSackCount: 'Pila ka sako tanan?',
    sackHint: '(1 sako ≈ 50 kg)',
    sacksUnit: '{count} Sako',
    aboutKgTotal: 'Mga {kg} kg tanan',
    step2Title: 'Pili og Trak ({count} Andam sa Duol)',
    step2Sub: 'Pindota ang berde nga button aron mag-book ug tan-awa sa mapa',
    noTrucksTitle: 'Walay trak nga online karon',
    noTrucksSub: 'Balhin sa Drayber / Nagpahulam sa ibabaw aron mag-on og trak.',
    tooSmallBadge: 'Gamay Ra Kaayo (Max {max} Sako)',
    fitsLoadBadge: 'Maigo ang {count} Sako Nimo',
    driverLabel: 'Drayber:',
    canCarryLabel: 'Makadala og:',
    upToSacks: 'Hangtod {max} Sako ({kg} kg)',
    parkedNearLabel: 'Naka-parking sa:',
    totalTripCost: 'Tibuok Bayad sa Biyahe:',
    chooseBiggerTruck: 'Pili og Mas Dako nga Trak',
    truckOnTheWay: 'Padulong na ang Trak',
    finishCurrentTrip: 'Humana Usa ang Kasamtangang Biyahe',
    bookThisTruck: 'Kuhaa Kini nga Trak',
    bookingProgress: 'Gihubad ug Nag-book...',

    // Farmer Sell Crops Tab
    postCropsTitle: 'I-post ang Ibaligya nga Abot',
    postCropsSub: 'Makita dayon sa mga mamamalit sa Negosyo nga tab ang imong abot.',
    labelCropName: 'Ngalan sa Tanom',
    placeholderCropName: 'pananglitan, Tam-is nga Mais, Repolyo',
    labelHowManySacks: 'Pila ka Sako?',
    labelPricePerKilo: 'Presyo Matag Kilo (₱)',
    btnPostCrops: 'I-post ang Akong Abot',
    btnPostingCrops: 'Gihubad ug Gi-post...',
    postSuccessMsg: 'Na-post na! Makita na kini sa mga mamamalit.',
    yourPostedCrops: 'Imong Mga Na-post nga Abot',
    statusReady: 'Andam na Kuhaon',
    statusSoldOut: 'Nareserba / Hurot Na',

    // Live Truck Tracker
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
    totalPaymentLabel: 'Tibuok Bayranan',
    noMiddlemanNote: 'Direktang bayad sa drayber—walay kaltas sa middleman',

    // Driver / Lender Dashboard
    driverPortalBadge: 'Portal sa Drayber / Nagpahulam',
    driverPortalTitle: 'Biyahe ug Kaandam sa Trak',
    viewingAccount: 'Gigamit nga Account:',
    otherTruckBookedMsg: 'Naay mag-uuma nga nag-book kang {driver} ({model}).',
    switchDriverViewBtn: 'Balhin sa View ni {name}',
    maxSacksLine: 'Max {max} Sako ({kg} kg)',
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

    // Business Dashboard
    businessBadge: 'Portal sa Negosyo • Direktang Pagpalit',
    businessTitle: 'Mga Magamit nga Abot sa Uma',
    businessSub: 'Pagpalit og presko nga abot direkta gikan sa mga mag-uuma sa saktong presyo.',
    tabAvailableCrops: 'Mga Available nga Abot ({count})',
    tabReservedOrders: 'Mga Nareserbang Order ({count})',
    reservedToast:
      'Nareserba na ang {sacks} sako sa {crop} gikan kang {farmer}! Na-update na ang imbentaryo.',
    viewOrderBtn: 'Tan-awa ang Order',
    kpiTotalSupply: 'Tibuok Suplay nga Andam',
    kpiSacksReady: '({sacks} sako ang andam karon)',
    kpiActiveListings: 'Mga Aktibong Uma',
    kpiFarmsCount: '{count} Ka Uma',
    kpiZeroMarkup: '0% patong sa middleman',
    kpiYourReservations: 'Imong Mga Reserba',
    kpiOrdersCount: '{count} Ka Order',
    kpiDirectFarm: 'Direkta gikan sa uma',
    searchPlaceholder: 'Pangita og tanom, lugar sa uma, o mag-uuma...',
    catAll: 'Tanan',
    catFruits: 'Prutas',
    catVegetables: 'Utanon',
    catGrains: 'Butil ug Mais',
    catRootCrops: 'Lagutmon',
    noMatchingCrops: 'Walay nakit-ang parehas nga tanom',
    noMatchingSub: 'Sulayi pagtangtang ang filter o pag-post og bag-ong abot sa Mag-uuma nga tab.',
    producerLabel: 'Mag-uuma:',
    availableVolumeLabel: 'Kadaghanon nga Andam:',
    farmOriginLabel: 'Gigikanan nga Uma:',
    freshnessLabel: 'Kapresko:',
    farmGatePriceLabel: 'Presyo sa Uma',
    btnFullyReserved: 'Nareserba Na Tanan',
    btnReserveSupply: 'Ireserba ang Suplay',
    noOrdersTitle: 'Wala pay nareserbang order',
    noOrdersSub: 'Adto sa Mga Available nga Abot ug pagreserba gikan sa uma.',
    confirmedOrderBadge: 'Kumpirmadong Reserba • {time}',
    supplierLabel: 'Mag-uuma:',
    logisticsLabel: 'Paghatod:',
    directFarmGateRate: '₱{price}/kg direktang presyo sa uma',
    modalHeaderTag: 'Direktang Pagreserba sa Uma',
    modalFromFarm: 'Gikan kang {farmer} ({origin})',
    modalBusinessName: 'Ngalan sa Imong Negosyo / Tindahan',
    modalQtyLabel: 'Kadaghanon nga Ireserba (Max {max} Sako)',
    modalTransportLabel: 'Paagi sa Pagkuha / Paghatod',
    optAgriHaul: 'Ihatod sa Mag-uuma gamit ang AgriHaul',
    optBusinessPickup: 'Kuhaon sa Negosyo sa Uma',
    modalTotalPayout: 'Tibuok Bayranan sa Mag-uuma',
    btnConfirmReservation: 'Kumpirmaha ang Pagreserba',
  },
};

// Offline-safe Philippine Agricultural & Location Glossary (instant zero-latency translation)
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
  { en: 'red', tl: 'pula', ceb: 'pula' },
  { en: 'white', tl: 'puti', ceb: 'puti' },
  { en: 'farm', tl: 'sakahan', ceb: 'uma' },
  { en: 'public market', tl: 'pampublikong palengke', ceb: 'publikong merkado' },
  { en: 'market', tl: 'palengke', ceb: 'merkado' },
  { en: 'trading post', tl: 'bagsakan', ceb: 'bagsakan' },
  { en: 'harvested today', tl: 'inani ngayong araw', ceb: 'gi-ani karon adlawa' },
  { en: 'ready now', tl: 'handa na ngayon', ceb: 'andam na karon' },
  { en: 'just listed', tl: 'bagong post lang', ceb: 'bag-o lang gi-post' },
];

// Resolving localized object { en, tl, ceb } or plain string cleanly
export function getLocalizedText(value, lang = 'en') {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value.en || '';
  }
  return String(value);
}

// Helper for word-by-word glossary replacement when full phrase isn't an exact match
function applyGlossaryWords(text, targetLang) {
  let result = text;
  for (const entry of AGRI_GLOSSARY) {
    const regex = new RegExp(`\\b${entry.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, (match) => {
        const replacement = entry[targetLang] || entry.en;
        // Preserve leading capitalization
        if (match[0] === match[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
    }
  }
  return result;
}

// Lightweight online translator with fast 2.2s timeout so offline pitch demos never stall
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

// Translates any newly typed farmer/business input into { en, tl, ceb }
export async function translateDynamicText(rawText) {
  const clean = String(rawText || '').trim();
  if (!clean) return { en: '', tl: '', ceb: '' };

  // 1. Check exact match in offline glossary first
  const exact = AGRI_GLOSSARY.find((g) => g.en.toLowerCase() === clean.toLowerCase());
  if (exact) {
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return { en: clean, tl: cap(exact.tl), ceb: cap(exact.ceb) };
  }

  // 2. Apply partial glossary substitutions
  const glossaryTl = applyGlossaryWords(clean, 'tl');
  const glossaryCeb = applyGlossaryWords(clean, 'ceb');

  // 3. If words still remain untranslated (same as English), attempt fast live API translation
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