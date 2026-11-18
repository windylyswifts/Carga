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
import { useLogistics, calculateRouteEstimate } from '../context/LogisticsContext';
import LiveTruckTracker from './LiveTruckTracker';

const QUICK_FARMS = ['Brgy. Sumilihon Farm', 'Brgy. Ampayon Farm', 'Brgy. Libertad Farm'];
const QUICK_DESTINATIONS = ['Langihan Public Market', 'Butuan Trading Post', 'Baan Bagsakan Center'];
const QUICK_CROPS = ['Bananas (Saba)', 'Rice / Palay', 'Fresh Vegetables', 'Corn'];
const KG_PER_SACK = 50;

export default function OrdinaryDashboard() {
  const { trucks, activeBooking, createBooking, cropListings, addCropListing } = useLogistics();
  const [activeTab, setActiveTab] = useState('transport'); // 'transport' | 'harvests'

  // Simple, farmer-friendly form state (uses sacks, converts cleanly to kg)
  const [pickup, setPickup] = useState('Brgy. Sumilihon Farm');
  const [destination, setDestination] = useState('Langihan Public Market');
  const [cropType, setCropType] = useState('Bananas (Saba)');
  const [sackCount, setSackCount] = useState(12); // 12 sacks = 600 kg

  // Harvest listing form state
  const [newCropName, setNewCropName] = useState('');
  const [newSacks, setNewSacks] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [listingSuccess, setListingSuccess] = useState(false);

  const totalWeightKg = sackCount * KG_PER_SACK;
  const availableTrucks = trucks.filter((t) => t.isAvailable);

  const handleBookTruck = (truck) => {
    if (!pickup.trim() || !destination.trim()) return;
    createBooking({
      truck,
      pickup,
      destination,
      cropType,
      weightKg: totalWeightKg,
    });
  };

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!newCropName || !newSacks || !newPrice) return;
    addCropListing({
      cropName: newCropName,
      quantityKg: Number(newSacks) * KG_PER_SACK,
      pricePerKg: Number(newPrice),
      origin: pickup,
    });
    setNewCropName('');
    setNewSacks('');
    setNewPrice('');
    setListingSuccess(true);
    setTimeout(() => setListingSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Clear, High-Contrast Header & Big Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Farmer Home
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
            Send Your Harvest to Market
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:flex bg-slate-200 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-5 py-3 rounded-xl text-base font-bold transition cursor-pointer ${
              activeTab === 'transport'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            1. Find a Truck
          </button>
          <button
            onClick={() => setActiveTab('harvests')}
            className={`px-5 py-3 rounded-xl text-base font-bold transition cursor-pointer ${
              activeTab === 'harvests'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            2. Sell Crops ({cropListings.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SIMPLE POINT-TO-POINT TRUCK BOOKING & TRACKING */}
      {activeTab === 'transport' && (
        <div className="space-y-8">
          {/* Active Trip Live Tracker */}
          {activeBooking && <LiveTruckTracker />}

          {/* Step 1: Easy 1-Tap Trip Details */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-7 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-base shrink-0">
                1
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Tell Us About Your Trip
                </h2>
                <p className="text-sm text-slate-500">
                  Tap a quick choice below or type your own place
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Location */}
              <div>
                <label className="flex items-center gap-1.5 text-base font-bold text-slate-800 mb-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Where is your farm? (Pickup)
                </label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-medium focus:outline-none focus:border-emerald-600"
                  placeholder="Type your barangay or farm..."
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

              {/* Destination Location */}
              <div>
                <label className="flex items-center gap-1.5 text-base font-bold text-slate-800 mb-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Where are the crops going? (Drop-off)
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-medium focus:outline-none focus:border-emerald-600"
                  placeholder="Type market or drop-off place..."
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
                  What crop are you sending?
                </label>
                <input
                  type="text"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-medium focus:outline-none focus:border-emerald-600"
                  placeholder="e.g., Bananas, Rice, Corn..."
                />
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {QUICK_CROPS.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setCropType(crop)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        cropType === crop
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Large +/- Sack Counter */}
              <div>
                <label className="block text-base font-bold text-slate-800 mb-2">
                  How many sacks? <span className="text-sm font-normal text-slate-500">(1 sack ≈ 50 kg)</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSackCount((prev) => Math.max(1, prev - 2))}
                    className="w-14 h-14 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-800 cursor-pointer active:scale-95 transition"
                    aria-label="Decrease sacks"
                  >
                    <Minus className="w-6 h-6" />
                  </button>

                  <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-4 text-center">
                    <span className="text-2xl font-extrabold text-slate-900 block leading-none">
                      {sackCount} Sacks
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      About {totalWeightKg.toLocaleString()} kg total
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSackCount((prev) => prev + 2)}
                    className="w-14 h-14 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-800 cursor-pointer active:scale-95 transition"
                    aria-label="Increase sacks"
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
                  Choose a Truck ({availableTrucks.length} Ready Nearby)
                </h2>
                <p className="text-sm text-slate-500">
                  Tap the green button to book a driver and watch them on the map
                </p>
              </div>
            </div>

            {availableTrucks.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-10 text-center">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-slate-800">No trucks are online right now</p>
                <p className="text-sm text-slate-500 mt-1">
                  Switch to the <strong>Driver / Lender</strong> tab at the top to turn a truck ON.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableTrucks.map((truck) => {
                  const maxSacks = Math.floor(truck.capacityKg / KG_PER_SACK);
                  const isTooSmall = totalWeightKg > truck.capacityKg;
                  const { totalFare } = calculateRouteEstimate(pickup, destination, truck);
                  const isCurrentlyBooked = activeBooking?.truck.id === truck.id;

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
                              Too Small (Max {maxSacks} Sacks)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                              <PackageCheck className="w-3.5 h-3.5" />
                              Fits Your {sackCount} Sacks
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
                          Driver: <span className="text-slate-900 font-bold">{truck.driverName}</span>
                        </p>

                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Can Carry:</span>
                            <span className="font-bold text-slate-900">
                              Up to {maxSacks} Sacks ({truck.capacityKg.toLocaleString()} kg)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Parked Near:</span>
                            <span className="font-semibold text-slate-800">
                              {truck.currentLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-slate-600">Total Trip Cost:</span>
                          <span className="text-2xl font-extrabold text-slate-900">
                            ₱{totalFare.toLocaleString()}
                          </span>
                        </div>

                        {isTooSmall ? (
                          <div className="w-full py-3.5 px-4 rounded-xl bg-red-50 text-red-700 text-sm font-bold text-center">
                            Choose a Bigger Truck
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBookTruck(truck)}
                            disabled={Boolean(activeBooking)}
                            className={`w-full py-3.5 px-4 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
                              isCurrentlyBooked
                                ? 'bg-emerald-100 text-emerald-900 cursor-default'
                                : activeBooking
                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-98'
                            }`}
                          >
                            {isCurrentlyBooked ? (
                              <>
                                <CheckCircle2 className="w-5 h-5" /> Truck is On the Way
                              </>
                            ) : activeBooking ? (
                              'Finish Current Trip First'
                            ) : (
                              <>
                                <Truck className="w-5 h-5" /> Book This Truck
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

      {/* TAB 2: SELL HARVEST TO BUSINESS BUYERS */}
      {activeTab === 'harvests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleCreateListing}
            className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-2xs space-y-4 self-start"
          >
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              Post Crops for Sale
            </h2>
            <p className="text-sm text-slate-600">
              Buyers and stores in the <strong>Business</strong> tab will see your crops right away.
            </p>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Crop Name</label>
              <input
                type="text"
                required
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                placeholder="e.g., Sweet Corn, Cabbage"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">
                  How Many Sacks?
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
                  Price per Kilo (₱)
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
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-xl transition cursor-pointer"
            >
              Post My Crops
            </button>

            {listingSuccess && (
              <p className="text-sm text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> Posted! Buyers can now see your crops.
              </p>
            )}
          </form>

          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              Your Posted Crops
            </h2>
            {cropListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-5 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    {item.status}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1.5">{item.cropName}</h3>
                  <p className="text-sm text-slate-500">{item.origin}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-slate-900">
                    {Math.round(item.quantityKg / KG_PER_SACK)} Sacks ({item.quantityKg} kg)
                  </p>
                  <p className="text-sm font-bold text-emerald-700">₱{item.pricePerKg} / kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}