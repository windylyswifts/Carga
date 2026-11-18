import React, { createContext, useContext, useState, useEffect } from 'react';
import { UI_STRINGS, translateDynamicText } from '../utils/translations';

const LogisticsContext = createContext();

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
  const [activeRole, setActiveRole] = useState('ordinary'); // 'ordinary' | 'driver'
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);
  const [activeBooking, setActiveBooking] = useState(null);

  const t = (key, params = {}) => {
    const dict = UI_STRINGS[language] || UI_STRINGS.en;
    let template = dict[key] || UI_STRINGS.en[key] || key;
    for (const [paramKey, paramVal] of Object.entries(params)) {
      template = template.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
    return template;
  };

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

  const createBooking = async ({
    truck,
    pickup,
    destination,
    cropType,
    sackCount,
    sackWeightKg,
  }) => {
    const { estimatedMinutes, totalFare } = calculateRouteEstimate(pickup, destination, truck);
    const weightKg = Number(sackCount) * Number(sackWeightKg);

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
      sackCount: Number(sackCount),
      sackWeightKg: Number(sackWeightKg),
      weightKg,
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
          currentTrucks.map((tr) =>
            tr.id === prev.truck.id
              ? {
                  ...tr,
                  tripsCompleted: tr.tripsCompleted + 1,
                  totalEarnings: tr.totalEarnings + prev.totalFare,
                }
              : tr
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
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => useContext(LogisticsContext);