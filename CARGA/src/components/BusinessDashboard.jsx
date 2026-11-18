import React, { useState } from 'react';
import {
  Store,
  Search,
  MapPin,
  Sprout,
  Phone,
  CheckCircle2,
  ShoppingBag,
  Package,
  X,
  Minus,
  Plus,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useLogistics, KG_PER_SACK } from '../context/LogisticsContext';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Grains & Corn', 'Root Crops'];

export default function BusinessDashboard() {
  const { cropListings, procurementOrders, reserveCropSupply, setActiveRole } = useLogistics();

  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'orders'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [businessName, setBusinessName] = useState('Caraga Fresh Mart & Trading');

  // Reservation Modal State
  const [selectedListing, setSelectedListing] = useState(null);
  const [sacksToReserve, setSacksToReserve] = useState(5);
  const [fulfillmentMethod, setFulfillmentMethod] = useState('Farmer Delivers via AgriHaul');
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const availableListings = cropListings.filter((item) => item.quantityKg > 0);
  const totalAvailableKg = availableListings.reduce((sum, item) => sum + item.quantityKg, 0);

  const filteredListings = cropListings.filter((item) => {
    const matchesSearch =
      item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openReservationModal = (listing) => {
    const maxSacks = Math.max(1, Math.floor(listing.quantityKg / KG_PER_SACK));
    setSelectedListing(listing);
    setSacksToReserve(Math.min(5, maxSacks));
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!selectedListing) return;

    reserveCropSupply({
      listingId: selectedListing.id,
      businessName,
      sacksRequested: sacksToReserve,
      fulfillmentMethod,
    });

    setOrderConfirmation({
      cropName: selectedListing.cropName,
      sacks: sacksToReserve,
      farmerName: selectedListing.farmerName,
    });
    setSelectedListing(null);
    setTimeout(() => setOrderConfirmation(null), 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header & Business Identity */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">
            Business Portal • Direct Procurement
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
            Available Farm Resources
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Source fresh harvests directly from local farmers at transparent farm-gate prices.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-200 p-1.5 rounded-2xl self-start">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === 'marketplace'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            Available Crops ({availableListings.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            Reserved Orders ({procurementOrders.length})
          </button>
        </div>
      </div>

      {/* Live Toast Notification after Reservation */}
      {orderConfirmation && (
        <div className="mb-6 bg-emerald-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <p className="text-sm">
              Reserved <strong>{orderConfirmation.sacks} sacks</strong> of{' '}
              <strong>{orderConfirmation.cropName}</strong> from{' '}
              <strong>{orderConfirmation.farmerName}</strong>! Inventory updated live.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shrink-0 cursor-pointer"
          >
            View Order
          </button>
        </div>
      )}

      {/* Executive KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">
              Total Available Supply
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              {totalAvailableKg.toLocaleString()} kg
            </span>
            <span className="text-xs text-slate-500 block">
              ({Math.round(totalAvailableKg / KG_PER_SACK)} sacks ready today)
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">
              Active Farm Listings
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              {availableListings.length} Farms
            </span>
            <span className="text-xs text-emerald-700 font-semibold block">
              0% middleman markup
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">
              Your Reservations
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              {procurementOrders.length} Orders
            </span>
            <span className="text-xs text-slate-500 block">Direct farm-to-business</span>
          </div>
        </div>
      </div>

      {/* TAB 1: AVAILABLE FARM RESOURCES FEED */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop, farm location, or farmer..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-lg font-bold text-slate-800">No matching crops found</p>
              <p className="text-sm text-slate-500 mt-1">
                Try clearing your search filter or post a new harvest in the{' '}
                <button
                  onClick={() => setActiveRole('ordinary')}
                  className="text-indigo-600 font-bold underline cursor-pointer"
                >
                  Ordinary (Farmer)
                </button>{' '}
                tab.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredListings.map((item) => {
                const isSoldOut = item.quantityKg <= 0;
                const availableSacks = Math.floor(item.quantityKg / KG_PER_SACK);

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border-2 p-5 flex flex-col justify-between transition ${
                      isSoldOut
                        ? 'border-slate-200 opacity-65'
                        : 'border-slate-200 hover:border-indigo-500 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isSoldOut
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 mt-3">
                        {item.cropName}
                      </h3>
                      <p className="text-sm font-medium text-slate-600 mt-0.5">
                        Producer: <span className="font-bold text-slate-900">{item.farmerName}</span>
                      </p>

                      <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Package className="w-3.5 h-3.5 text-slate-400" /> Available Volume:
                          </span>
                          <span className="font-extrabold text-slate-900">
                            {availableSacks} Sacks ({item.quantityKg.toLocaleString()} kg)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> Farm Origin:
                          </span>
                          <span className="font-semibold text-slate-800">{item.origin}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-slate-400" /> Freshness:
                          </span>
                          <span className="font-semibold text-emerald-700">{item.harvestDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500">Farm-Gate Price</span>
                        <div>
                          <span className="text-2xl font-extrabold text-slate-900">
                            ₱{item.pricePerKg}
                          </span>
                          <span className="text-xs font-bold text-slate-500"> / kg</span>
                        </div>
                      </div>

                      <button
                        onClick={() => openReservationModal(item)}
                        disabled={isSoldOut}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
                          isSoldOut
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {isSoldOut ? 'Fully Reserved' : 'Reserve Supply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESERVED PROCUREMENT ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {procurementOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-lg font-bold text-slate-800">No reserved orders yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Go to <strong>Available Crops</strong> and reserve produce from a local farm.
              </p>
            </div>
          ) : (
            procurementOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                      {order.id}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      Confirmed Reservation • {order.createdAt}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {order.cropName} — {order.reservedSacks} Sacks ({order.reservedKg} kg)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Supplier: <strong>{order.farmerName}</strong> ({order.origin}) •{' '}
                    <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold">
                      <Phone className="w-3 h-3" /> {order.farmerPhone}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" /> Logistics:{' '}
                    {order.fulfillmentMethod}
                  </p>
                </div>

                <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <span className="text-xs text-slate-500 block">
                    ₱{order.pricePerKg}/kg direct farm-gate
                  </span>
                  <span className="text-2xl font-extrabold text-indigo-700">
                    ₱{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* RESERVE SUPPLY MODAL */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-indigo-700">
                  Direct Farm Reservation
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedListing.cropName}
                </h3>
                <p className="text-xs text-slate-500">
                  From {selectedListing.farmerName} ({selectedListing.origin})
                </p>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReservation} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Business / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Quantity to Reserve (Max {Math.floor(selectedListing.quantityKg / KG_PER_SACK)}{' '}
                  Sacks)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSacksToReserve((s) => Math.max(1, s - 1))}
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center bg-slate-50 border border-slate-200 rounded-xl py-2">
                    <span className="text-lg font-extrabold text-slate-900 block leading-none">
                      {sacksToReserve} Sacks
                    </span>
                    <span className="text-xs text-slate-500">
                      {sacksToReserve * KG_PER_SACK} kg total
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSacksToReserve((s) =>
                        Math.min(Math.floor(selectedListing.quantityKg / KG_PER_SACK), s + 1)
                      )
                    }
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transport Arrangement
                </label>
                <select
                  value={fulfillmentMethod}
                  onChange={(e) => setFulfillmentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                >
                  <option>Farmer Delivers via AgriHaul</option>
                  <option>Business Pick-up at Farm Gate</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-900 block">
                    Total Farm-Gate Payout
                  </span>
                  <span className="text-[11px] text-indigo-700">
                    {sacksToReserve * KG_PER_SACK} kg × ₱{selectedListing.pricePerKg}/kg
                  </span>
                </div>
                <span className="text-2xl font-extrabold text-indigo-700">
                  ₱{(sacksToReserve * KG_PER_SACK * selectedListing.pricePerKg).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition cursor-pointer shadow-sm"
              >
                Confirm Harvest Reservation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}