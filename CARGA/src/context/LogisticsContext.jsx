import React, { createContext, useContext, useState, useEffect } from 'react';

const LogisticsContext = createContext();

const INITIAL_TRUCKS = [
  {
    id: 'TRK-101',
    driverName: 'Mang Ramon Reyes',
    phone: '+63 917 482 1904',
    vehicleModel: 'Isuzu Elf 6-Wheeler Drop-side',
    plateNumber: 'KAG 4821',
    capacityKg: 3500,
    ratePerKm: 45,
    baseFare: 850,
    rating: 4.9,
    tripsCompleted: 142,
    isAvailable: true,
    currentLocation: 'Ampayon Highway Junction',
  },
  {
    id: 'TRK-102',
    driverName: 'Kuya Dante Navarro',
    phone: '+63 928 710 3392',
    vehicleModel: 'Suzuki Carry Multicab (High-Side)',
    plateNumber: 'LMA 9034',
    capacityKg: 800,
    ratePerKm: 25,
    baseFare: 400,
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
    ratePerKm: 35,
    baseFare: 650,
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
    ratePerKm: 55,
    baseFare: 1100,
    rating: 4.9,
    tripsCompleted: 210,
    isAvailable: false, // Offline truck to demonstrate filtering
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
    origin: 'Brgy. Sumilihon Farm Lot 4',
    status: 'Ready for Pickup',
  },
];

export const TRIP_STAGES = [
  { id: 0, label: 'Booking Confirmed', subtext: 'Driver notified & route locked', progress: 10 },
  { id: 1, label: 'Heading to Farm', subtext: 'Truck en route to pickup pin', progress: 30 },
  { id: 2, label: 'Loading Harvest', subtext: 'Weighing & securing sacks at farm', progress: 50 },
  { id: 3, label: 'In Transit to Market', subtext: 'On highway toward destination', progress: 80 },
  { id: 4, label: 'Delivered', subtext: 'Cargo unloaded at drop-off point', progress: 100 },
];

export const LogisticsProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('ordinary'); // 'ordinary' | 'business' | 'driver'
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);
  const [activeBooking, setActiveBooking] = useState(null);
  const [cropListings, setCropListings] = useState(INITIAL_LISTINGS);
  const [autoSimulate, setAutoSimulate] = useState(true);

  // Smoothly animate truck movement along the route when in transit
  useEffect(() => {
    if (!activeBooking || !autoSimulate || activeBooking.stageIndex >= 4) return;

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
  }, [activeBooking, autoSimulate]);

  const createBooking = ({ truck, pickup, destination, cropType, weightKg, estimatedKm }) => {
    const totalFare = truck.baseFare + truck.ratePerKm * estimatedKm;
    const newBooking = {
      id: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
      truck,
      pickup,
      destination,
      cropType,
      weightKg: Number(weightKg),
      estimatedKm,
      totalFare,
      stageIndex: 0,
      liveProgress: 5,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        autoSimulate,
        setAutoSimulate,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => useContext(LogisticsContext);