import React, { createContext, useContext, useState, useEffect } from 'react';
import { UI_STRINGS, translateDynamicText } from '../utils/translations';

const LogisticsContext = createContext();

export const PERMIT_WEIGHT_LIMIT_KG = 8000;

const INITIAL_TRUCKS = [
  {
    id: 'TRK-101',
    driverName: 'Mang Ramon Reyes',
    phone: '+63 917 482 1904',
    vehicleModel: 'Isuzu Elf 6-Wheeler Truck',
    plateNumber: 'KAG 4821',
    capacityKg: 3500,
    ratePerKm: 45,
    handlingRatePerKg: 0.5,
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
    ratePerKm: 28,
    handlingRatePerKg: 0.35,
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
    ratePerKm: 36,
    handlingRatePerKg: 0.45,
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
    vehicleModel: 'Isuzu Giga 10-Wheeler Heavy Cargo',
    plateNumber: 'ZBX 7742',
    capacityKg: 12000,
    ratePerKm: 68,
    handlingRatePerKg: 0.65,
    rating: 4.9,
    tripsCompleted: 210,
    totalEarnings: 79400,
    isAvailable: true,
    currentLocation: 'National Highway Terminal',
  },
];

export const TRIP_STAGES = [
  { id: 0, labelKey: 'stage0Label', subKey: 'stage0Sub', driverBtnKey: 'stage0DriverBtn', progress: 5 },
  { id: 1, labelKey: 'stage1Label', subKey: 'stage1Sub', driverBtnKey: 'stage1DriverBtn', progress: 35 },
  { id: 2, labelKey: 'stage2Label', subKey: 'stage2Sub', driverBtnKey: 'stage2DriverBtn', progress: 55 },
  { id: 3, labelKey: 'stage3Label', subKey: 'stage3Sub', driverBtnKey: 'stage3DriverBtn', progress: 82 },
  { id: 4, labelKey: 'stage4Label', subKey: 'stage4Sub', driverBtnKey: null, progress: 100 },
];

// Validates whether a Transport Permit is required:
// 1. Cargo weight > 8,000 kg
// 2. Route uses a main road / highway or crosses city-to-city boundaries
export function evaluatePermitRequirement({ weightKg, pickup, destination, isMainRoadOrIntercity }) {
  const exceedsWeight = Number(weightKg) > PERMIT_WEIGHT_LIMIT_KG;

  const combinedRoute = `${String(pickup)} ${String(destination)}`.toLowerCase();
  const highwayKeywords = [
    'highway',
    'national road',
    'main road',
    'expressway',
    'diversion',
    'city',
    'cagayan',
    'butuan',
    'davao',
    'iligan',
    'valencia',
    'malaybalay',
    'surigao',
    'tagum',
    'general santos',
  ];
  const keywordMatch = highwayKeywords.some((kw) => combinedRoute.includes(kw));

  const crossesRoute = Boolean(isMainRoadOrIntercity) || keywordMatch;

  return {
    required: exceedsWeight || crossesRoute,
    exceedsWeight,
    crossesRoute,
  };
}

export function getAvailabilityMultiplier(trucks) {
  const onlineCount = trucks.filter((tr) => tr.isAvailable).length;
  if (onlineCount <= 1) return 1.25;
  if (onlineCount === 2) return 1.1;
  return 1.0;
}

export function calculateTripFare({
  pickup,
  destination,
  truck,
  customerWeightKg,
  totalCargoWeightKg = customerWeightKg,
  availabilityMultiplier = 1.0,
}) {
  const combined = `${String(pickup).trim()}-${String(destination).trim()}`;
  const hash = combined.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const distanceKm = 8 + (hash % 18);
  const estimatedMinutes = Math.round(distanceKm * 2.5);

  const ratePerKm = truck.ratePerKm;
  const handlingRatePerKg = truck.handlingRatePerKg;
  const effectiveTotalWeight = Math.max(Number(totalCargoWeightKg), Number(customerWeightKg), 1);

  const distanceCost = distanceKm * ratePerKm;
  const handlingCost = effectiveTotalWeight * handlingRatePerKg;

  const tripCost = Math.round((distanceCost + handlingCost) * availabilityMultiplier);
  const weightShareRatio = Number(customerWeightKg) / effectiveTotalWeight;
  const customerFare = Math.round(tripCost * weightShareRatio);

  return {
    distanceKm,
    estimatedMinutes,
    ratePerKm,
    handlingRatePerKg,
    distanceCost: Math.round(distanceCost),
    handlingCost: Math.round(handlingCost),
    availabilityMultiplier,
    tripCost,
    customerFare,
  };
}

export const LogisticsProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [activeRole, setActiveRole] = useState('ordinary');
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);
  const [activeBooking, setActiveBooking] = useState(null);

  // Transport Permit State: null | { id, status: 'pending' | 'approved', issuedAt, ...5 attributes }
  const [transportPermit, setTransportPermit] = useState(null);

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

  // Submit and authenticate permit request -> sets booking on hold ('pending')
  const submitPermitApplication = ({
    plantDetails,
    applicantFullName,
    plantSource,
    declaredConveyance,
    weightInKilos,
  }) => {
    const permitId = `PTP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPermit = {
      id: permitId,
      status: 'pending',
      plantDetails: String(plantDetails).trim(),
      applicantFullName: String(applicantFullName).trim(),
      plantSource: String(plantSource).trim(),
      declaredConveyance: String(declaredConveyance).trim(),
      weightInKilos: Number(weightInKilos),
      submittedAt: new Date().toLocaleString(),
      issuedAt: null,
    };
    setTransportPermit(newPermit);
    return newPermit;
  };

  // Approve permit so farmer can resume booking & driver receives soft copy
  const approveTransportPermit = () => {
    setTransportPermit((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'approved',
        issuedAt: new Date().toLocaleString(),
      };
    });
  };

  const createBooking = async ({
    truck,
    pickup,
    destination,
    cropType,
    sackCount,
    sackWeightKg,
  }) => {
    const weightKg = Number(sackCount) * Number(sackWeightKg);
    const availabilityMultiplier = getAvailabilityMultiplier(trucks);

    const fareBreakdown = calculateTripFare({
      pickup,
      destination,
      truck,
      customerWeightKg: weightKg,
      totalCargoWeightKg: weightKg,
      availabilityMultiplier,
    });

    const [localizedPickup, localizedDestination, localizedCrop] = await Promise.all([
      translateDynamicText(pickup),
      translateDynamicText(destination),
      translateDynamicText(cropType),
    ]);

    setActiveBooking({
      id: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
      truck,
      farmerName: transportPermit?.applicantFullName || 'Juan Dela Cruz (Farmstead Coop)',
      farmerPhone: '+63 919 304 5512',
      pickup: localizedPickup,
      destination: localizedDestination,
      cropType: localizedCrop,
      sackCount: Number(sackCount),
      sackWeightKg: Number(sackWeightKg),
      weightKg,
      estimatedMinutes: fareBreakdown.estimatedMinutes,
      totalFare: fareBreakdown.customerFare,
      fareBreakdown,
      permit: transportPermit?.status === 'approved' ? transportPermit : null,
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

  const completeAndClearBooking = () => {
    setActiveBooking(null);
    setTransportPermit(null);
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
        transportPermit,
        submitPermitApplication,
        approveTransportPermit,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => useContext(LogisticsContext); 