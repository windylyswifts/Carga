import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  Sprout,
  Star,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Minus,
  Plus,
  PackageCheck,
} from 'lucide-react';
import { useLogistics, calculateRouteEstimate, KG_PER_SACK } from '../context/LogisticsContext';
import { getLocalizedText } from '../utils/translations';
import LiveTruckTracker from './LiveTruckTracker';

const QUICK_FARMS = ['Brgy. Sumilihon Farm', 'Brgy. Ampayon Farm', 'Brgy. Libertad Farm'];
const QUICK_DESTINATIONS = ['Langihan Public Market', 'Butuan Trading Post', 'Baan Bagsakan Center'];

const QUICK_CROPS = [
  { en: 'Bananas (Saba)', tl: 'Saging (Saba)', ceb: 'Saging (Sab-a)' },
  { en: 'Rice / Palay', tl: 'Bigas / Palay', ceb: 'Bugas / Humay' },
  { en: 'Fresh Vegetables', tl: 'Sariwang Gulay', ceb: 'Preskong Utanon' },
  { en: 'Corn', tl: 'Mais', ceb: 'Mais' },
];

export default function OrdinaryDashboard() {
  const {
    language,
    t,
    trucks,
    activeBooking,
    createBooking,
    cropListings,
    addCropListing,
  } = useLogistics();

  const [activeTab, setActiveTab] = useState('transport'); // 'transport' | 'harvests'

  // Point-to-point trip state
  const [pickup, setPickup] = useState('Brgy. Sumilihon Farm');
  const [destination, setDestination] = useState('Langihan Public Market');
  const [cropType, setCropType] = useState('Bananas (Saba)');
  const [sackCount, setSackCount] = useState(12);
  const [bookingTruckId, setBookingTruckId] = useState(null);

  // Harvest listing state
  const [newCropName, setNewCropName] = useState('');
  const [newSacks, setNewSacks] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [isPostingCrop, setIsPostingCrop] = useState(false);
  const [listingSuccess, setListingSuccess] = useState(false);

  const totalWeightKg = sackCount * KG_PER_SACK;
  const availableTrucks = trucks.filter((tr) => tr.isAvailable);

  const handleBookTruck = async (truck) => {
    if (!pickup.trim() || !destination.trim() || bookingTruckId) return;
    setBookingTruckId(truck.id);
    await createBooking({
      truck,
      pickup,
      destination,
      cropType,
      weightKg: totalWeightKg,
    });
    setBookingTruckId(null);
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!newCropName || !newSacks || !newPrice || isPostingCrop) return;
    setIsPostingCrop(true);
    await addCropListing({
      cropName: newCropName,
      quantityKg: Number(newSacks) * KG_PER_SACK,
      pricePerKg: Number(newPrice),
      origin: pickup,
    });
    setIsPostingCrop(false);
    setNewCropName('');
    setNewSacks('');
    setNewPrice('');
    setListingSuccess(true);
    setTimeout(() => setListingSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header & Large Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {t('farmerBadge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
            {t('farmerTitle')}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:flex bg-slate-200 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-5 py-3 rounded-xl text-sm sm:text-base font-bold transition cursor-pointer ${
              activeTab === 'transport'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            {t('tabFindTruck')}
          </button>
          <button
            onClick={() => setActiveTab('harvests')}
            className={`px-5 py-3 rounded-xl text-sm sm:text-base font-bold transition cursor-pointer ${
              activeTab === 'harvests'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            {t('tabSellCrops', { count: cropListings.length })}
          </button>
        </div>
      </div>

      {/* TAB 1: POINT-TO-POINT TRUCK BOOKING & TRACKING */}
      {activeTab === 'transport' && (
        <div className="space-y-8">
          {activeBooking && <LiveTruckTracker />}

          {/* Step 1: Trip Details */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-7 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-base shrink-0">
                1
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {t('step1Title')}
                </h2>
                <p className="text-sm text-slate-500">{t('step1Sub')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup */}
              <div>
                <label className="flex items-center gap-1.5 text-base font-bold text-slate-800 mb-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  {t('labelPickup')}
                </label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-medium focus:outline-none focus:border-emerald-600"
                  placeholder={t('placeholderPickup')}
                />
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {QUICK_FARMS.map((place) => (
                    <button
                      key={place}
                      type="button"
                      onClick={() => setPickup(place)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        pickup === place
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {place}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="flex items-center gap-1.5 text-base font-bold text-slate-800 mb-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  {t('labelDestination')}
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-medium focus:outline-none focus:border-emerald-600"
                  placeholder={t('placeholderDestination')}
                />
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {QUICK_DESTINATIONS.map((market) => (
                    <button
                      key={market}
                      type="button"
                      onClick={() => setDestination(market)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        destination === market
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {market}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Selection */}
              <div>
                <label className="flex items-center gap-1.5 text-base font-bold text-slate-800 mb-2">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  {t('labelCropSending')}
                </label>
                <input
                  type="text"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-medium focus:outline-none focus:border-emerald-600"
                  placeholder={t('placeholderCropSending')}
                />
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {QUICK_CROPS.map((cropObj) => {
                    const label = getLocalizedText(cropObj, language);
                    const isSelected =
                      cropType.toLowerCase() === cropObj.en.toLowerCase() ||
                      cropType.toLowerCase() === label.toLowerCase();
                    return (
                      <button
                        key={cropObj.en}
                        type="button"
                        onClick={() => setCropType(label)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Large +/- Sack Counter */}
              <div>
                <label className="block text-base font-bold text-slate-800 mb-2">
                  {t('labelSackCount')}{' '}
                  <span className="text-sm font-normal text-slate-500">{t('sackHint')}</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSackCount((prev) => Math.max(1, prev - 2))}
                    className="w-14 h-14 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-800 cursor-pointer active:scale-95 transition"
                  >
                    <Minus className="w-6 h-6" />
                  </button>

                  <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-4 text-center">
                    <span className="text-2xl font-extrabold text-slate-900 block leading-none">
                      {t('sacksUnit', { count: sackCount })}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {t('aboutKgTotal', { kg: totalWeightKg.toLocaleString() })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSackCount((prev) => prev + 2)}
                    className="w-14 h-14 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-800 cursor-pointer active:scale-95 transition"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Choose an Available Truck */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-base shrink-0">
                2
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {t('step2Title', { count: availableTrucks.length })}
                </h2>
                <p className="text-sm text-slate-500">{t('step2Sub')}</p>
              </div>
            </div>

            {availableTrucks.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 text-center">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-slate-800">{t('noTrucksTitle')}</p>
                <p className="text-sm text-slate-500 mt-1">{t('noTrucksSub')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableTrucks.map((truck) => {
                  const maxSacks = Math.floor(truck.capacityKg / KG_PER_SACK);
                  const isTooSmall = totalWeightKg > truck.capacityKg;
                  const { totalFare } = calculateRouteEstimate(pickup, destination, truck);
                  const isCurrentlyBooked = activeBooking?.truck.id === truck.id;
                  const isBookingThis = bookingTruckId === truck.id;

                  return (
                    <div
                      key={truck.id}
                      className={`bg-white rounded-2xl border-2 p-5 flex flex-col justify-between transition ${
                        isTooSmall
                          ? 'border-slate-200 opacity-65'
                          : 'border-slate-200 hover:border-emerald-500 shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          {isTooSmall ? (
                            <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                              {t('tooSmallBadge', { max: maxSacks })}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                              <PackageCheck className="w-3.5 h-3.5" />
                              {t('fitsLoadBadge', { count: sackCount })}
                            </span>
                          )}

                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            {truck.rating}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-xl mt-3">
                          {truck.vehicleModel}
                        </h3>
                        <p className="text-sm font-medium text-slate-600 mt-0.5">
                          {t('driverLabel')}{' '}
                          <span className="text-slate-900 font-bold">{truck.driverName}</span>
                        </p>

                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">{t('canCarryLabel')}</span>
                            <span className="font-bold text-slate-900">
                              {t('upToSacks', {
                                max: maxSacks,
                                kg: truck.capacityKg.toLocaleString(),
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">{t('parkedNearLabel')}</span>
                            <span className="font-semibold text-slate-800">
                              {truck.currentLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-slate-600">
                            {t('totalTripCost')}
                          </span>
                          <span className="text-2xl font-extrabold text-slate-900">
                            ₱{totalFare.toLocaleString()}
                          </span>
                        </div>

                        {isTooSmall ? (
                          <div className="w-full py-3.5 px-4 rounded-xl bg-red-50 text-red-700 text-sm font-bold text-center">
                            {t('chooseBiggerTruck')}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBookTruck(truck)}
                            disabled={Boolean(activeBooking) || Boolean(bookingTruckId)}
                            className={`w-full py-3.5 px-4 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
                              isCurrentlyBooked
                                ? 'bg-emerald-100 text-emerald-900 cursor-default'
                                : activeBooking
                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            }`}
                          >
                            {isBookingThis ? (
                              t('bookingProgress')
                            ) : isCurrentlyBooked ? (
                              <>
                                <CheckCircle2 className="w-5 h-5" /> {t('truckOnTheWay')}
                              </>
                            ) : activeBooking ? (
                              t('finishCurrentTrip')
                            ) : (
                              <>
                                <Truck className="w-5 h-5" /> {t('bookThisTruck')}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SELL HARVEST */}
      {activeTab === 'harvests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleCreateListing}
            className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-2xs space-y-4 self-start"
          >
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              {t('postCropsTitle')}
            </h2>
            <p className="text-sm text-slate-600">{t('postCropsSub')}</p>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                {t('labelCropName')}
              </label>
              <input
                type="text"
                required
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                placeholder={t('placeholderCropName')}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">
                  {t('labelHowManySacks')}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newSacks}
                  onChange={(e) => setNewSacks(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">
                  {t('labelPricePerKilo')}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="35"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-base"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPostingCrop}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold text-base rounded-xl transition cursor-pointer"
            >
              {isPostingCrop ? t('btnPostingCrops') : t('btnPostCrops')}
            </button>

            {listingSuccess && (
              <p className="text-sm text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> {t('postSuccessMsg')}
              </p>
            )}
          </form>

          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              {t('yourPostedCrops')}
            </h2>
            {cropListings.map((item) => {
              const isSoldOut = item.quantityKg <= 0;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 p-5 flex items-center justify-between"
                >
                  <div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isSoldOut
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isSoldOut ? t('statusSoldOut') : t('statusReady')}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1.5">
                      {getLocalizedText(item.cropName, language)}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {getLocalizedText(item.origin, language)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-slate-900">
                      {t('sacksUnit', { count: Math.round(item.quantityKg / KG_PER_SACK) })} (
                      {item.quantityKg} kg)
                    </p>
                    <p className="text-sm font-bold text-emerald-700">₱{item.pricePerKg} / kg</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}