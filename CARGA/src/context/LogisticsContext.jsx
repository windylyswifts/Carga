import React, { createContext, useContext, useState, useEffect } from 'react';

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
    farmerName: 'Farmstead Cooperative (You)',
    farmerPhone: '+63 919 304 5512',
    cropName: 'Cardava Bananas (Saba)',
    category: 'Fruits',
    quantityKg: 650,
    pricePerKg: 28,
    origin: 'Brgy. Sumilihon Farm',
    harvestDate: 'Harvested Today',
    status: 'Ready for Pickup',
  },
  {
    id: 'CRP-02',
    farmerName: 'Agusan Valley Growers',
    farmerPhone: '+63 917 884 1209',
    cropName: 'Well-Milled White Rice (Palay)',
    category: 'Grains & Corn',
    quantityKg: 2500,
    pricePerKg: 44,
    origin: 'Brgy. Ampayon Rice Mill',
    harvestDate: 'Ready Now',
    status: 'Ready for Pickup',
  },
  {
    id: 'CRP-03',
    farmerName: 'Aling Nena Highland Plot',
    farmerPhone: '+63 926 419 7730',
    cropName: 'Fresh Eggplant & Okra Mix',
    category: 'Vegetables',
    quantityKg: 400,
    pricePerKg: 52,
    origin: 'Brgy. Libertad Farm Zone',
    harvestDate: 'Harvested Today',
    status: 'Ready for Pickup',
  },
  {
    id: 'CRP-04',
    farmerName: 'Sitio Masao Root Farmers',
    farmerPhone: '+63 908 551 9023',
    cropName: 'Sweet Cassava (Kamoteng Kahoy)',
    category: 'Root Crops',
    quantityKg: 1500,
    pricePerKg: 22,
    origin: 'Brgy. Masao Coastal Farm',
    harvestDate: 'Ready Now',
    status: 'Ready for Pickup',
  },
];

export const TRIP_STAGES = [
  {
    id: 0,
    label: 'Request Sent',
    subtext: 'Waiting for driver to accept your trip',
    driverAction: 'Accept Hauling Job',
    progress: 5,
  },
  {
    id: 1,
    label: 'On the Way',
    subtext: 'Driver accepted and is heading to your farm',
    driverAction: 'Confirm Arrival at Farm',
    progress: 35,
  },
  {
    id: 2,
    label: 'Loading',
    subtext: 'Loading your sacks onto the truck at the farm',
    driverAction: 'Finish Loading & Start Delivery',
    progress: 55,
  },
  {
    id: 3,
    label: 'Delivering',
    subtext: 'Truck is en route to the destination market',
    driverAction: 'Confirm Drop-off & Complete Trip',
    progress: 82,
  },
  {
    id: 4,
    label: 'Arrived',
    subtext: 'Crops delivered safely at destination!',
    driverAction: null,
    progress: 100,
  },
];

export function calculateRouteEstimate(pickup, destination, truck) {
  const combined = `${pickup.trim()}-${destination.trim()}`;
  const hash = combined.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const autoDistanceKm = 8 + (hash % 18);
  const estimatedMinutes = Math.round(autoDistanceKm * 2.5);
  const totalFare = truck ? truck.baseFare + truck.ratePerKm * autoDistanceKm : 0;

  return { estimatedMinutes, totalFare };
}

export const LogisticsProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('ordinary'); // 'ordinary' | 'business' | 'driver'
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);
  const [activeBooking, setActiveBooking] = useState(null);
  const [cropListings, setCropListings] = useState(INITIAL_LISTINGS);
  const [procurementOrders, setProcurementOrders] = useState([]);

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

  const createBooking = ({ truck, pickup, destination, cropType, weightKg }) => {
    const { estimatedMinutes, totalFare } = calculateRouteEstimate(pickup, destination, truck);

    setActiveBooking({
      id: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
      truck,
      farmerName: 'Juan Dela Cruz (Farmstead Coop)',
      farmerPhone: '+63 919 304 5512',
      pickup,
      destination,
      cropType,
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

  const cancelBooking = () => {
    setActiveBooking(null);
  };

  const completeAndClearBooking = () => {
    setActiveBooking(null);
  };

  const addCropListing = (listing) => {
    setCropListings((prev) => [
      {
        id: `CRP-${Math.floor(10 + Math.random() * 90)}`,
        farmerName: 'Farmstead Cooperative (You)',
        farmerPhone: '+63 919 304 5512',
        category: 'Vegetables',
        harvestDate: 'Just Listed',
        status: 'Ready for Pickup',
        ...listing,
      },
      ...prev,
    ]);
  };

  const reserveCropSupply = ({ listingId, businessName, sacksRequested, fulfillmentMethod }) => {
    const targetListing = cropListings.find((item) => item.id === listingId);
    if (!targetListing) return;

    const requestedKg = sacksRequested * KG_PER_SACK;
    const actualReservedKg = Math.min(requestedKg, targetListing.quantityKg);
    const totalAmount = actualReservedKg * targetListing.pricePerKg;

    // Deduct reserved volume from available inventory
    setCropListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        const remainingKg = Math.max(0, item.quantityKg - actualReservedKg);
        return {
          ...item,
          quantityKg: remainingKg,
          status: remainingKg === 0 ? 'Reserved / Sold Out' : 'Ready for Pickup',
        };
      })
    );

    // Record procurement order
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
        fulfillmentMethod,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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