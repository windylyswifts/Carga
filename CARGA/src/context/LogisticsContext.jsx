import React, { createContext, useContext, useState, useEffect } from 'react';
import { UI_STRINGS, translateDynamicText } from '../utils/translations';

const LogisticsContext = createContext();

export const KG_PER_SACK = 50;

const INITIAL_TRUCKS = [
  {
    id: 'TRK-101',
    driverName: 'Mang Ramon Reyes',
    phone: '+63 917 482 1904',
    vehicleModel: 'Isuzu Elf 6-Wheeler Truck',
    plateNumber: 'KAG 4821',
    capacityKg: 3500,
    baseFare: 850,
    ratePerKm: 45,
    rating: 4.9,
    tripsCompleted: 142,
    totalEarnings: 48500,
    isAvailable: true,
    currentLocation: 'Ampayon Highway Junction',
  },
  {
    id: 'TRK-102',
    driverName: 'Kuya Dante Navarro',
    phone: '+63 928 710 3392',
    vehicleModel: 'Suzuki Multicab (High-Side)',
    plateNumber: 'LMA 9034',
    capacityKg: 800,
    baseFare: 400,
    ratePerKm: 25,
    rating: 4.8,
    tripsCompleted: 89,
    totalEarnings: 24300,
    isAvailable: true,
    currentLocation: 'Libertad Public Terminal',
  },
  {
    id: 'TRK-103',
    driverName: 'Carlo Mendoza',
    phone: '+63 915 663 8821',
    vehicleModel: 'Mitsubishi Canter Mini-Dump',
    plateNumber: 'NDF 1129',
    capacityKg: 2000,
    baseFare: 650,
    ratePerKm: 35,
    rating: 4.7,
    tripsCompleted: 64,
    totalEarnings: 31200,
    isAvailable: true,
    currentLocation: 'Baan Viaduct Crossing',
  },
  {
    id: 'TRK-104',
    driverName: 'Arturo Villanueva',
    phone: '+63 906 512 7740',
    vehicleModel: 'Foton Tornado Cargo Truck',
    plateNumber: 'ZBX 7742',
    capacityKg: 4500,
    baseFare: 1100,
    ratePerKm: 55,
    rating: 4.9,
    tripsCompleted: 210,
    totalEarnings: 79400,
    isAvailable: false,
    currentLocation: 'Buenavista Depot',
  },
];

const INITIAL_LISTINGS = [
  {
    id: 'CRP-01',
    farmerName: 'Farmstead Cooperative',
    farmerPhone: '+63 919 304 5512',
    cropName: {
      en: 'Cardava Bananas (Saba)',
      tl: 'Saging na Saba',
      ceb: 'Saging nga Sab-a',
    },
    categoryKey: 'catFruits',
    quantityKg: 650,
    pricePerKg: 28,
    origin: {
      en: 'Brgy. Sumilihon Farm',
      tl: 'Sakahan ng Brgy. Sumilihon',
      ceb: 'Uma sa Brgy. Sumilihon',
    },
    harvestDate: {
      en: 'Harvested Today',
      tl: 'Inani Ngayong Araw',
      ceb: 'Gi-ani Karon Adlawa',
    },
  },
  {
    id: 'CRP-02',
    farmerName: 'Agusan Valley Growers',
    farmerPhone: '+63 917 884 1209',
    cropName: {
      en: 'Well-Milled White Rice (Palay)',
      tl: 'Puting Bigas (Palay)',
      ceb: 'Puting Bugas (Humay)',
    },
    categoryKey: 'catGrains',
    quantityKg: 2500,
    pricePerKg: 44,
    origin: {
      en: 'Brgy. Ampayon Rice Mill',
      tl: 'Kiskisan sa Brgy. Ampayon',
      ceb: 'Galingan sa Brgy. Ampayon',
    },
    harvestDate: {
      en: 'Ready Now',
      tl: 'Handa Na Ngayon',
      ceb: 'Andam Na Karon',
    },
  },
  {
    id: 'CRP-03',
    farmerName: 'Aling Nena Highland Plot',
    farmerPhone: '+63 926 419 7730',
    cropName: {
      en: 'Fresh Eggplant & Okra Mix',
      tl: 'Sariwang Talong at Okra',
      ceb: 'Preskong Tawong ug Okra',
    },
    categoryKey: 'catVegetables',
    quantityKg: 400,
    pricePerKg: 52,
    origin: {
      en: 'Brgy. Libertad Farm Zone',
      tl: 'Sakahan sa Brgy. Libertad',
      ceb: 'Uma sa Brgy. Libertad',
    },
    harvestDate: {
      en: 'Harvested Today',
      tl: 'Inani Ngayong Araw',
      ceb: 'Gi-ani Karon Adlawa',
    },
  },
  {
    id: 'CRP-04',
    farmerName: 'Sitio Masao Root Farmers',
    farmerPhone: '+63 908 551 9023',
    cropName: {
      en: 'Sweet Cassava (Kamoteng Kahoy)',
      tl: 'Matamis na Kamoteng Kahoy',
      ceb: 'Tam-is nga Balanghoy',
    },
    categoryKey: 'catRootCrops',
    quantityKg: 1500,
    pricePerKg: 22,
    origin: {
      en: 'Brgy. Masao Coastal Farm',
      tl: 'Sakahan sa Brgy. Masao',
      ceb: 'Uma sa Brgy. Masao',
    },
    harvestDate: {
      en: 'Ready Now',
      tl: 'Handa Na Ngayon',
      ceb: 'Andam Na Karon',
    },
  },
];

export const TRIP_STAGES = [
  { id: 0, labelKey: 'stage0Label', subKey: 'stage0Sub', driverBtnKey: 'stage0DriverBtn', progress: 5 },
  { id: 1, labelKey: 'stage1Label', subKey: 'stage1Sub', driverBtnKey: 'stage1DriverBtn', progress: 35 },
  { id: 2, labelKey: 'stage2Label', subKey: 'stage2Sub', driverBtnKey: 'stage2DriverBtn', progress: 55 },
  { id: 3, labelKey: 'stage3Label', subKey: 'stage3Sub', driverBtnKey: 'stage3DriverBtn', progress: 82 },
  { id: 4, labelKey: 'stage4Label', subKey: 'stage4Sub', driverBtnKey: null, progress: 100 },
];

export function calculateRouteEstimate(pickup, destination, truck) {
  const combined = `${String(pickup).trim()}-${String(destination).trim()}`;
  const hash = combined.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const autoDistanceKm = 8 + (hash % 18);
  const estimatedMinutes = Math.round(autoDistanceKm * 2.5);
  const totalFare = truck ? truck.baseFare + truck.ratePerKm * autoDistanceKm : 0;

  return { estimatedMinutes, totalFare };
}

export const LogisticsProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en' | 'tl' | 'ceb'
  const [activeRole, setActiveRole] = useState('ordinary'); // 'ordinary' | 'business' | 'driver'
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);
  const [activeBooking, setActiveBooking] = useState(null);
  const [cropListings, setCropListings] = useState(INITIAL_LISTINGS);
  const [procurementOrders, setProcurementOrders] = useState([]);

  // Central translation helper with {variable} interpolation
  const t = (key, params = {}) => {
    const dict = UI_STRINGS[language] || UI_STRINGS.en;
    let template = dict[key] || UI_STRINGS.en[key] || key;
    for (const [paramKey, paramVal] of Object.entries(params)) {
      template = template.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
    return template;
  };

  // Smoothly animate truck movement along the visual route once accepted
  useEffect(() => {
    if (
      !activeBooking ||
      activeBooking.stageIndex === 0 ||
      activeBooking.stageIndex >= TRIP_STAGES.length - 1
    ) {
      return;
    }

    const timer = setInterval(() => {
      setActiveBooking((prev) => {
        if (!prev) return null;
        const targetProgress = TRIP_STAGES[prev.stageIndex].progress;
        if (prev.liveProgress < targetProgress) {
          return { ...prev, liveProgress: Math.min(prev.liveProgress + 2, targetProgress) };
        }
        return prev;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [activeBooking]);

  const toggleTruckAvailability = (truckId) => {
    setTrucks((prev) =>
      prev.map((truck) =>
        truck.id === truckId ? { ...truck, isAvailable: !truck.isAvailable } : truck
      )
    );
  };

  const updateTruckLocation = (truckId, newLocation) => {
    setTrucks((prev) =>
      prev.map((truck) =>
        truck.id === truckId ? { ...truck, currentLocation: newLocation } : truck
      )
    );
  };

  // Translates dynamic pickup, destination, and crop inputs before storing
  const createBooking = async ({ truck, pickup, destination, cropType, weightKg }) => {
    const { estimatedMinutes, totalFare } = calculateRouteEstimate(pickup, destination, truck);

    const [localizedPickup, localizedDestination, localizedCrop] = await Promise.all([
      translateDynamicText(pickup),
      translateDynamicText(destination),
      translateDynamicText(cropType),
    ]);

    setActiveBooking({
      id: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
      truck,
      farmerName: 'Juan Dela Cruz (Farmstead Coop)',
      farmerPhone: '+63 919 304 5512',
      pickup: localizedPickup,
      destination: localizedDestination,
      cropType: localizedCrop,
      weightKg: Number(weightKg),
      estimatedMinutes,
      totalFare,
      stageIndex: 0,
      liveProgress: 5,
    });
  };

  const advanceTripStage = () => {
    setActiveBooking((prev) => {
      if (!prev || prev.stageIndex >= TRIP_STAGES.length - 1) return prev;
      const nextStage = prev.stageIndex + 1;

      if (nextStage === TRIP_STAGES.length - 1) {
        setTrucks((currentTrucks) =>
          currentTrucks.map((t) =>
            t.id === prev.truck.id
              ? {
                  ...t,
                  tripsCompleted: t.tripsCompleted + 1,
                  totalEarnings: t.totalEarnings + prev.totalFare,
                }
              : t
          )
        );
      }

      return {
        ...prev,
        stageIndex: nextStage,
        liveProgress: TRIP_STAGES[nextStage].progress,
      };
    });
  };

  const cancelBooking = () => setActiveBooking(null);
  const completeAndClearBooking = () => setActiveBooking(null);

  // Translates newly posted crop name and origin into { en, tl, ceb }
  const addCropListing = async ({ cropName, quantityKg, pricePerKg, origin }) => {
    const [localizedCropName, localizedOrigin] = await Promise.all([
      translateDynamicText(cropName),
      translateDynamicText(origin),
    ]);

    setCropListings((prev) => [
      {
        id: `CRP-${Math.floor(10 + Math.random() * 90)}`,
        farmerName: 'Farmstead Cooperative',
        farmerPhone: '+63 919 304 5512',
        cropName: localizedCropName,
        categoryKey: 'catVegetables',
        quantityKg: Number(quantityKg),
        pricePerKg: Number(pricePerKg),
        origin: localizedOrigin,
        harvestDate: {
          en: 'Just Listed',
          tl: 'Bagong Post Lang',
          ceb: 'Bag-o Lang Gi-post',
        },
      },
      ...prev,
    ]);
  };

  const reserveCropSupply = ({ listingId, businessName, sacksRequested, fulfillmentKey }) => {
    const targetListing = cropListings.find((item) => item.id === listingId);
    if (!targetListing) return;

    const requestedKg = sacksRequested * KG_PER_SACK;
    const actualReservedKg = Math.min(requestedKg, targetListing.quantityKg);
    const totalAmount = actualReservedKg * targetListing.pricePerKg;

    setCropListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        return {
          ...item,
          quantityKg: Math.max(0, item.quantityKg - actualReservedKg),
        };
      })
    );

    setProcurementOrders((prev) => [
      {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        businessName,
        cropName: targetListing.cropName,
        farmerName: targetListing.farmerName,
        farmerPhone: targetListing.farmerPhone,
        origin: targetListing.origin,
        reservedKg: actualReservedKg,
        reservedSacks: Math.round(actualReservedKg / KG_PER_SACK),
        pricePerKg: targetListing.pricePerKg,
        totalAmount,
        fulfillmentKey,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  return (
    <LogisticsContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeRole,
        setActiveRole,
        trucks,
        toggleTruckAvailability,
        updateTruckLocation,
        activeBooking,
        createBooking,
        advanceTripStage,
        cancelBooking,
        completeAndClearBooking,
        cropListings,
        addCropListing,
        procurementOrders,
        reserveCropSupply,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => useContext(LogisticsContext);