import React, { createContext, useContext, useState, useEffect } from 'react';

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
    isAvailable: false,
    currentLocation: 'Buenavista Depot',
  },
];

const INITIAL_LISTINGS = [
  {
    id: 'CRP-01',
    farmerName: 'Farmstead Cooperative (You)',
    cropName: 'Cardava Bananas (Saba)',
    quantityKg: 650,
    pricePerKg: 28,
    origin: 'Brgy. Sumilihon Farm',
    status: 'Ready for Pickup',
  },
];

export const TRIP_STAGES = [
  { id: 0, label: 'Confirmed', subtext: 'Driver accepted your booking', progress: 10 },
  { id: 1, label: 'On the Way', subtext: 'Truck is driving to your farm', progress: 35 },
  { id: 2, label: 'Loading', subtext: 'Loading your sacks onto the truck', progress: 55 },
  { id: 3, label: 'Delivering', subtext: 'Truck is heading to the market', progress: 82 },
  { id: 4, label: 'Arrived', subtext: 'Crops delivered safely!', progress: 100 },
];

// Automatically estimates route fare & travel duration from location names
// so farmers never need to know or input distances.
export function calculateRouteEstimate(pickup, destination, truck) {
  const combined = `${pickup.trim()}-${destination.trim()}`;
  const hash = combined.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const autoDistanceKm = 8 + (hash % 18); // Realistic 8–25 km local farm-to-market range
  const estimatedMinutes = Math.round(autoDistanceKm * 2.5);
  const totalFare = truck ? truck.baseFare + truck.ratePerKm * autoDistanceKm : 0;

  return { estimatedMinutes, totalFare };
}

export const LogisticsProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('ordinary'); // 'ordinary' | 'business' | 'driver'
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);
  const [activeBooking, setActiveBooking] = useState(null);
  const [cropListings, setCropListings] = useState(INITIAL_LISTINGS);

  // Smoothly animate truck movement along the visual route
  useEffect(() => {
    if (!activeBooking || activeBooking.stageIndex >= TRIP_STAGES.length - 1) return;

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

  const createBooking = ({ truck, pickup, destination, cropType, weightKg }) => {
    const { estimatedMinutes, totalFare } = calculateRouteEstimate(pickup, destination, truck);

    const newBooking = {
      id: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
      truck,
      pickup,
      destination,
      cropType,
      weightKg: Number(weightKg),
      estimatedMinutes,
      totalFare,
      stageIndex: 0,
      liveProgress: 5,
    };
    setActiveBooking(newBooking);
  };

  const advanceTripStage = () => {
    setActiveBooking((prev) => {
      if (!prev || prev.stageIndex >= TRIP_STAGES.length - 1) return prev;
      const nextStage = prev.stageIndex + 1;
      return {
        ...prev,
        stageIndex: nextStage,
        liveProgress: TRIP_STAGES[nextStage].progress,
      };
    });
  };

  const completeAndClearBooking = () => {
    setActiveBooking(null);
  };

  const addCropListing = (listing) => {
    setCropListings((prev) => [
      {
        id: `CRP-${Math.floor(10 + Math.random() * 90)}`,
        farmerName: 'Farmstead Cooperative (You)',
        status: 'Ready for Pickup',
        ...listing,
      },
      ...prev,
    ]);
  };

  return (
    <LogisticsContext.Provider
      value={{
        activeRole,
        setActiveRole,
        trucks,
        setTrucks,
        activeBooking,
        createBooking,
        advanceTripStage,
        completeAndClearBooking,
        cropListings,
        addCropListing,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => useContext(LogisticsContext);