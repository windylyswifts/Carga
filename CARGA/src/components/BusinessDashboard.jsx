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
import { getLocalizedText } from '../utils/translations';

const CATEGORY_KEYS = ['catAll', 'catFruits', 'catVegetables', 'catGrains', 'catRootCrops'];

export default function BusinessDashboard() {
  const { language, t, cropListings, procurementOrders, reserveCropSupply } = useLogistics();

  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'orders'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('catAll');
  const [businessName, setBusinessName] = useState('Caraga Fresh Mart & Trading');

  // Reservation Modal State
  const [selectedListing, setSelectedListing] = useState(null);
  const [sacksToReserve, setSacksToReserve] = useState(5);
  const [fulfillmentKey, setFulfillmentKey] = useState('optAgriHaul');
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const availableListings = cropListings.filter((item) => item.quantityKg > 0);
  const totalAvailableKg = availableListings.reduce((sum, item) => sum + item.quantityKg, 0);

  // Searches across English, Tagalog, and Cebuano fields simultaneously
  const filteredListings = cropListings.filter((item) => {
    const q = searchQuery.toLowerCase();
    const allCropNames =
      typeof item.cropName === 'object'
        ? Object.values(item.cropName).join(' ').toLowerCase()
        : String(item.cropName).toLowerCase();
    const allOrigins =
      typeof item.origin === 'object'
        ? Object.values(item.origin).join(' ').toLowerCase()
        : String(item.origin).toLowerCase();

    const matchesSearch =
      allCropNames.includes(q) ||
      allOrigins.includes(q) ||
      item.farmerName.toLowerCase().includes(q);
    const matchesCategory =
      selectedCategoryKey === 'catAll' || item.categoryKey === selectedCategoryKey;
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
      fulfillmentKey,
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">
            {t('businessBadge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
            {t('businessTitle')}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">{t('businessSub')}</p>
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
            {t('tabAvailableCrops', { count: availableListings.length })}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            {t('tabReservedOrders', { count: procurementOrders.length })}
          </button>
        </div>
      </div>

      {/* Live Reservation Toast */}
      {orderConfirmation && (
        <div className="mb-6 bg-emerald-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <p className="text-sm">
              {t('reservedToast', {
                sacks: orderConfirmation.sacks,
                crop: getLocalizedText(orderConfirmation.cropName, language),
                farmer: orderConfirmation.farmerName,
              })}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shrink-0 cursor-pointer"
          >
            {t('viewOrderBtn')}
          </button>
        </div>
      )}

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">
              {t('kpiTotalSupply')}
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              {totalAvailableKg.toLocaleString()} kg
            </span>
            <span className="text-xs text-slate-500 block">
              {t('kpiSacksReady', { sacks: Math.round(totalAvailableKg / KG_PER_SACK) })}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">
              {t('kpiActiveListings')}
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              {t('kpiFarmsCount', { count: availableListings.length })}
            </span>
            <span className="text-xs text-emerald-700 font-semibold block">
              {t('kpiZeroMarkup')}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block">
              {t('kpiYourReservations')}
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              {t('kpiOrdersCount', { count: procurementOrders.length })}
            </span>
            <span className="text-xs text-slate-500 block">{t('kpiDirectFarm')}</span>
          </div>
        </div>
      </div>

      {/* TAB 1: AVAILABLE FARM RESOURCES FEED */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_KEYS.map((catKey) => (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategoryKey(catKey)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategoryKey === catKey
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t(catKey)}
                </button>
              ))}
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-lg font-bold text-slate-800">{t('noMatchingCrops')}</p>
              <p className="text-sm text-slate-500 mt-1">{t('noMatchingSub')}</p>
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
                          {isSoldOut ? t('statusSoldOut') : t('statusReady')}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {t(item.categoryKey)}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 mt-3">
                        {getLocalizedText(item.cropName, language)}
                      </h3>
                      <p className="text-sm font-medium text-slate-600 mt-0.5">
                        {t('producerLabel')}{' '}
                        <span className="font-bold text-slate-900">{item.farmerName}</span>
                      </p>

                      <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Package className="w-3.5 h-3.5 text-slate-400" />{' '}
                            {t('availableVolumeLabel')}
                          </span>
                          <span className="font-extrabold text-slate-900">
                            {t('sacksUnit', { count: availableSacks })} (
                            {item.quantityKg.toLocaleString()} kg)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />{' '}
                            {t('farmOriginLabel')}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {getLocalizedText(item.origin, language)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-slate-400" />{' '}
                            {t('freshnessLabel')}
                          </span>
                          <span className="font-semibold text-emerald-700">
                            {getLocalizedText(item.harvestDate, language)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500">
                          {t('farmGatePriceLabel')}
                        </span>
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
                        {isSoldOut ? t('btnFullyReserved') : t('btnReserveSupply')}
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
              <p className="text-lg font-bold text-slate-800">{t('noOrdersTitle')}</p>
              <p className="text-sm text-slate-500 mt-1">{t('noOrdersSub')}</p>
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
                      {t('confirmedOrderBadge', { time: order.createdAt })}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {getLocalizedText(order.cropName, language)} —{' '}
                    {t('sacksUnit', { count: order.reservedSacks })} ({order.reservedKg} kg)
                  </h3>
                  <p className="text-xs text-slate-600">
                    {t('supplierLabel')} <strong>{order.farmerName}</strong> (
                    {getLocalizedText(order.origin, language)}) •{' '}
                    <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold">
                      <Phone className="w-3 h-3" /> {order.farmerPhone}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" /> {t('logisticsLabel')}{' '}
                    {t(order.fulfillmentKey)}
                  </p>
                </div>

                <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <span className="text-xs text-slate-500 block">
                    {t('directFarmGateRate', { price: order.pricePerKg })}
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
                  {t('modalHeaderTag')}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {getLocalizedText(selectedListing.cropName, language)}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('modalFromFarm', {
                    farmer: selectedListing.farmerName,
                    origin: getLocalizedText(selectedListing.origin, language),
                  })}
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
                  {t('modalBusinessName')}
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
                  {t('modalQtyLabel', {
                    max: Math.floor(selectedListing.quantityKg / KG_PER_SACK),
                  })}
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
                      {t('sacksUnit', { count: sacksToReserve })}
                    </span>
                    <span className="text-xs text-slate-500">
                      {sacksToReserve * KG_PER_SACK} kg
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
                  {t('modalTransportLabel')}
                </label>
                <select
                  value={fulfillmentKey}
                  onChange={(e) => setFulfillmentKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                >
                  <option value="optAgriHaul">{t('optAgriHaul')}</option>
                  <option value="optBusinessPickup">{t('optBusinessPickup')}</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-900 block">
                    {t('modalTotalPayout')}
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
                {t('btnConfirmReservation')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}