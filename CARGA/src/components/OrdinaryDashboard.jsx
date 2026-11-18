import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  Scale,
  Sprout,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import LiveTruckTracker from './LiveTruckTracker';

export default function OrdinaryDashboard() {
  const { trucks, activeBooking, createBooking, cropListings, addCropListing } = useLogistics();
  const [activeTab, setActiveTab] = useState('transport'); // 'transport' | 'harvests'

  // Point-to-Point Booking Form State
  const [pickup, setPickup] = useState('Brgy. Sumilihon Farm Gate, Butuan');
  const [destination, setDestination] = useState('Langihan Public Market Trading Post');
  const [cropType, setCropType] = useState('Cardava Bananas (Saba)');
  const [weightKg, setWeightKg] = useState(650);
  const [estimatedKm, setEstimatedKm] = useState(14);

  // New Harvest Listing Form State
  const [newCropName, setNewCropName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [listingSuccess, setListingSuccess] = useState(false);

  const availableTrucks = trucks.filter((t) => t.isAvailable);

  const handleBookTruck = (truck) => {
    if (!pickup.trim() || !destination.trim()) return;
    createBooking({
      truck,
      pickup,
      destination,
      cropType,
      weightKg,
      estimatedKm,
    });
  };

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!newCropName || !newQty || !newPrice) return;
    addCropListing({
      cropName: newCropName,
      quantityKg: Number(newQty),
      pricePerKg: Number(newPrice),
      origin: pickup,
    });
    setNewCropName('');
    setNewQty('');
    setNewPrice('');
    setListingSuccess(true);
    setTimeout(() => setListingSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Farmer Header & Sub-navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
            Farmer Portal • Ordinary Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Harvest Transport & Supply
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Book direct point-to-point hauling from your farm to any market and track your shipment live.
          </p>
        </div>

        <div className="flex bg-slate-200/80 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeTab === 'transport'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Book & Track Transport
          </button>
          <button
            onClick={() => setActiveTab('harvests')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeTab === 'harvests'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Harvest Listings ({cropListings.length})
          </button>
        </div>
      </div>

      {/* TAB 1: POINT-TO-POINT TRANSPORT & LIVE TRACKER */}
      {activeTab === 'transport' && (
        <div className="space-y-8">
          {/* Show Live Tracker if a trip is active */}
          {activeBooking && <LiveTruckTracker />}

          {/* Route Planner Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              1. Set Point-to-Point Route & Cargo Load
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pickup Location (Farm / Barangay)
                </label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter farm pickup point"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Destination (Public Market / Drop-off)
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter drop-off destination"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Est. Distance (km)
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={estimatedKm}
                  onChange={(e) => setEstimatedKm(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Crop / Cargo Description
                </label>
                <input
                  type="text"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 15 Sacks of Palay, Fresh Vegetables"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Total Load Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">
                    KG
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Available Trucks Marketplace */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                2. Available Trucks Nearby ({availableTrucks.length} Online)
              </h2>
              <span className="text-xs text-slate-500">
                Showing vehicles ready for immediate dispatch
              </span>
            </div>

            {availableTrucks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800">No drivers currently online</p>
                <p className="text-sm text-slate-500 mt-1">
                  Switch to the <strong>Driver / Lender</strong> tab at the top to set a truck as available.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableTrucks.map((truck) => {
                  const isOverweight = weightKg > truck.capacityKg;
                  const estimatedFare = truck.baseFare + truck.ratePerKm * estimatedKm;
                  const isCurrentlyBooked = activeBooking?.truck.id === truck.id;

                  return (
                    <div
                      key={truck.id}
                      className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition ${
                        isOverweight
                          ? 'border-slate-200 opacity-65'
                          : 'border-slate-200 hover:border-emerald-400 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Available Now
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {truck.rating} ({truck.tripsCompleted})
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-lg mt-3">
                          {truck.vehicleModel}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Driver: <span className="font-medium text-slate-800">{truck.driverName}</span>
                        </p>

                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Scale className="w-3.5 h-3.5 text-slate-400" /> Max Load Capacity
                            </span>
                            <span
                              className={`font-bold ${
                                isOverweight ? 'text-red-600' : 'text-slate-900'
                              }`}
                            >
                              {truck.capacityKg.toLocaleString()} kg
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Current Position
                            </span>
                            <span className="font-medium text-slate-800">
                              {truck.currentLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="flex items-baseline justify-between mb-3">
                          <span className="text-xs text-slate-500">Est. Trip Total ({estimatedKm} km)</span>
                          <span className="text-xl font-extrabold text-slate-900">
                            ₱{estimatedFare.toLocaleString()}
                          </span>
                        </div>

                        {isOverweight ? (
                          <div className="w-full py-2.5 px-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold text-center">
                            Exceeds max capacity by {(weightKg - truck.capacityKg).toLocaleString()} kg
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBookTruck(truck)}
                            disabled={Boolean(activeBooking)}
                            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                              isCurrentlyBooked
                                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                : activeBooking
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            {isCurrentlyBooked ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> Currently Tracking
                              </>
                            ) : activeBooking ? (
                              'Finish Active Trip First'
                            ) : (
                              <>
                                Select & Track Truck <ArrowRight className="w-4 h-4" />
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

      {/* TAB 2: MY HARVEST LISTINGS (Feeds into the Business Interface) */}
      {activeTab === 'harvests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleCreateListing}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 self-start"
          >
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              Post Available Harvest
            </h2>
            <p className="text-xs text-slate-500">
              Listings published here immediately appear on the <strong>Business</strong> buyer feed.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Crop Name</label>
              <input
                type="text"
                required
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                placeholder="e.g., Highland Cabbage, Sweet Corn"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Volume (kg)
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  placeholder="500"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Price / kg (₱)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="35"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition cursor-pointer"
            >
              Publish to Business Marketplace
            </button>

            {listingSuccess && (
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Harvest listed! Visible to Business accounts.
              </p>
            )}
          </form>

          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              Your Active Farm Inventory
            </h2>
            {cropListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {item.status}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-1">{item.cropName}</h3>
                  <p className="text-xs text-slate-500">{item.origin}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-slate-900">{item.quantityKg} kg</p>
                  <p className="text-xs font-semibold text-emerald-700">₱{item.pricePerKg} / kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}