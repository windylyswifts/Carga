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
    ratePerKm: 45, // R_d: Transportation rate per km (₱/km)
    handlingRatePerKg: 0.5, // R_w: Cargo handling rate per kg (₱/kg)
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
    ratePerKm: 28, // R_d
    handlingRatePerKg: 0.35, // R_w
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
    ratePerKm: 36, // R_d
    handlingRatePerKg: 0.45, // R_w
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
    ratePerKm: 55, // R_d
    handlingRatePerKg: 0.6, // R_w
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

// Derives Demand & Availability Multiplier (S) from current online truck supply
export function getAvailabilityMultiplier(trucks) {
  const onlineCount = trucks.filter((tr) => tr.isAvailable).length;
  if (onlineCount <= 1) return 1.25;
  if (onlineCount === 2) return 1.1;
  return 1.0;
}

// Stage 1 & Stage 2 Fare Calculation Engine
// Stage 1: TripCost = [(D * R_d) + (W * R_w)] * S
// Stage 2: CustomerFare = TripCost * (CustomerWeight / TotalCargoWeight)
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

  const distanceKm = 8 + (hash % 18); // D: Total distance travelled (km)
  const estimatedMinutes = Math.round(distanceKm * 2.5);

  const ratePerKm = truck.ratePerKm; // R_d
  const handlingRatePerKg = truck.handlingRatePerKg; // R_w
  const effectiveTotalWeight = Math.max(Number(totalCargoWeightKg), Number(customerWeightKg), 1);

  const distanceCost = distanceKm * ratePerKm;
  const handlingCost = effectiveTotalWeight * handlingRatePerKg;

  // Stage 1: Total Trip Cost
  const tripCost = Math.round((distanceCost + handlingCost) * availabilityMultiplier);

  // Stage 2: Customer Fare Allocation
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
      farmerName: 'Juan Dela Cruz (Farmstead Coop)',
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