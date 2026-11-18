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

const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'ACT-102',
    type: 'trip',
    title: 'Delivered 20 Sacks of Cardava Bananas (1,000 kg)',
    subtitle: 'Brgy. Sumilihon Farm → Langihan Public Market • Isuzu Elf (KAG 4821)',
    amountText: '₱1,130',
    status: 'Completed',
    timestamp: 'Nov 15, 2026 • 8:40 AM',
  },
  {
    id: 'ACT-101',
    type: 'permit',
    title: 'Plant Transport Permit Cleared (PTP-2026-48192)',
    subtitle: 'Main Road Clearance • 1,500 kg Fresh Harvest',
    amountText: 'Verified',
    status: 'Approved',
    timestamp: 'Nov 12, 2026 • 2:15 PM',
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NTF-1',
    title: 'Welcome to CARGA',
    message: 'Book verified hauling trucks directly or apply for a Plant Transport Permit anytime.',
    timestamp: 'Today',
    read: false,
  },
];

export const TRIP_STAGES = [
  { id: 0, labelKey: 'stage0Label', subKey: 'stage0Sub', driverBtnKey: 'stage0DriverBtn', progress: 5 },
  { id: 1, labelKey: 'stage1Label', subKey: 'stage1Sub', driverBtnKey: 'stage1DriverBtn', progress: 35 },
  { id: 2, labelKey: 'stage2Label', subKey: 'stage2Sub', driverBtnKey: 'stage2DriverBtn', progress: 55 },
  { id: 3, labelKey: 'stage3Label', subKey: 'stage3Sub', driverBtnKey: 'stage3DriverBtn', progress: 82 },
  { id: 4, labelKey: 'stage4Label', subKey: 'stage4Sub', driverBtnKey: null, progress: 100 },
];

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

  // Shared Farmer Navigation State
  const [farmerTab, setFarmerTab] = useState('home');
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isLiveTrackerOpen, setIsLiveTrackerOpen] = useState(false);

  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);
  const [activeBooking, setActiveBooking] = useState(null);
  const [transportPermit, setTransportPermit] = useState(null);

  const [farmerProfile, setFarmerProfile] = useState({
    fullName: 'Juan Dela Cruz',
    farmLocation: 'Brgy. Sumilihon Farm',
    phone: '+63 919 304 5512',
    coopName: 'Sumilihon Growers Coop',
  });
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const navigateToFarmerHome = () => {
    setActiveRole('ordinary');
    setFarmerTab('home');
    setIsBookingFormOpen(false);
    setIsLiveTrackerOpen(false);
  };

  const t = (key, params = {}) => {
    const dict = UI_STRINGS[language] || UI_STRINGS.en;
    let template = dict[key] || UI_STRINGS.en[key] || key;
    for (const [paramKey, paramVal] of Object.entries(params)) {
      template = template.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
    return template;
  };

  const formatNow = () =>
    new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  const pushActivityLog = (entry) => {
    setActivityLogs((prev) => [
      {
        id: `ACT-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        timestamp: formatNow(),
        ...entry,
      },
      ...prev,
    ]);
  };

  const pushNotification = ({ title, message }) => {
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        title,
        message,
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const updateFarmerProfile = (updates) => {
    setFarmerProfile((prev) => ({ ...prev, ...updates }));
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
      submittedAt: formatNow(),
      issuedAt: null,
    };
    setTransportPermit(newPermit);

    pushActivityLog({
      type: 'permit',
      refId: permitId,
      title: `Permit Application Submitted (${permitId})`,
      subtitle: `${newPermit.plantDetails} • ${newPermit.weightInKilos.toLocaleString()} kg`,
      amountText: 'On Hold',
      status: 'Pending',
    });

    pushNotification({
      title: 'Transport Permit Submitted',
      message: `Application ${permitId} (${newPermit.weightInKilos.toLocaleString()} kg) is now awaiting clearance.`,
    });

    return newPermit;
  };

  const approveTransportPermit = () => {
    setTransportPermit((prev) => {
      if (!prev) return null;
      const issuedAt = formatNow();

      pushActivityLog({
        type: 'permit',
        refId: prev.id,
        title: `Plant Transport Permit Approved (${prev.id})`,
        subtitle: `${prev.plantDetails} • Soft Copy Ready for Driver`,
        amountText: 'Verified',
        status: 'Approved',
      });

      pushNotification({
        title: `Permit Approved (${prev.id})`,
        message: 'Your official soft copy is ready and can now be attached to your truck booking.',
      });

      return {
        ...prev,
        status: 'approved',
        issuedAt,
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

    const bookingId = `TRIP-${Math.floor(1000 + Math.random() * 9000)}`;
    const farmerDisplay = farmerProfile.coopName
      ? `${farmerProfile.fullName} (${farmerProfile.coopName})`
      : farmerProfile.fullName;

    setActiveBooking({
      id: bookingId,
      truck,
      farmerName: transportPermit?.applicantFullName || farmerDisplay,
      farmerPhone: farmerProfile.phone,
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

    setIsBookingFormOpen(false);
    setFarmerTab('home');
    setIsLiveTrackerOpen(true);

    pushActivityLog({
      type: 'trip',
      refId: bookingId,
      title: `Booked ${truck.vehicleModel} (${Number(sackCount)} Sacks ${cropType})`,
      subtitle: `${pickup} → ${destination} • ${weightKg.toLocaleString()} kg`,
      amountText: `₱${fareBreakdown.customerFare.toLocaleString()}`,
      status: 'In Progress',
    });

    pushNotification({
      title: `Truck Request Sent (#${bookingId})`,
      message: `Waiting for ${truck.driverName} (${truck.vehicleModel}) to accept your ${weightKg.toLocaleString()} kg harvest load.`,
    });
  };

  const advanceTripStage = () => {
    setActiveBooking((prev) => {
      if (!prev || prev.stageIndex >= TRIP_STAGES.length - 1) return prev;
      const nextStage = prev.stageIndex + 1;

      if (nextStage === 1) {
        pushNotification({
          title: 'Driver Accepted Your Trip',
          message: `${prev.truck.driverName} is now on the way to your farm.`,
        });
      } else if (nextStage === TRIP_STAGES.length - 1) {
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

        setActivityLogs((logs) =>
          logs.map((entry) =>
            entry.refId === prev.id ? { ...entry, status: 'Completed' } : entry
          )
        );

        pushNotification({
          title: 'Harvest Delivered Safely!',
          message: `${prev.truck.driverName} completed delivery for trip #${prev.id}.`,
        });
      }

      return {
        ...prev,
        stageIndex: nextStage,
        liveProgress: TRIP_STAGES[nextStage].progress,
      };
    });
  };

  const cancelBooking = () => {
    if (activeBooking) {
      const cancelledId = activeBooking.id;
      setActivityLogs((logs) =>
        logs.map((entry) =>
          entry.refId === cancelledId ? { ...entry, status: 'Cancelled' } : entry
        )
      );
      pushNotification({
        title: `Booking Cancelled (#${cancelledId})`,
        message: 'Your hauling request was cancelled. You can book another truck anytime.',
      });
    }
    setActiveBooking(null);
    setIsLiveTrackerOpen(false);
  };

  const completeAndClearBooking = () => {
    setActiveBooking(null);
    setTransportPermit(null);
    setIsLiveTrackerOpen(false);
  };

  return (
    <LogisticsContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeRole,
        setActiveRole,
        farmerTab,
        setFarmerTab,
        isBookingFormOpen,
        setIsBookingFormOpen,
        isLiveTrackerOpen,
        setIsLiveTrackerOpen,
        navigateToFarmerHome,
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
        farmerProfile,
        updateFarmerProfile,
        activityLogs,
        notifications,
        markAllNotificationsRead,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => useContext(LogisticsContext);