import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Search, Navigation, Phone, Mail, Clock, CheckCircle, Store, Car, ArrowLeft, Compass } from 'lucide-react';
import storeService from '../../services/storeService';
import Button from '../../components/ui/Button';

// Fix leafet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A component to auto-recenter map when user location is found or active store is clicked
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom, { animate: true, duration: 1.5 });
  return null;
};

// Distance calculation using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

const isStoreOpen = (openTime, closeTime) => {
  if (!openTime || !closeTime) return false;
  const now = new Date();
  const currentHours = now.getHours();
  const currentMins = now.getMinutes();

  const [oH, oM] = openTime.split(':').map(Number);
  const [cH, cM] = closeTime.split(':').map(Number);

  const currentTotal = currentHours * 60 + currentMins;
  const openTotal = oH * 60 + oM;
  const closeTotal = cH * 60 + cM;

  if (closeTotal < openTotal) {
    // overnight store
    return currentTotal >= openTotal || currentTotal <= closeTotal;
  }
  return currentTotal >= openTotal && currentTotal <= closeTotal;
};

const StoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [userLocation, setUserLocation] = useState(null); // [lat, lng]
  const [mapCenter, setMapCenter] = useState([22.9734, 78.6569]); // Default to center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch stores
  const { data, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeService.getStores(),
  });

  const stores = data?.data || [];

  // Filter stores
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchType = activeType === 'All' || store.type === activeType;
      const term = searchQuery.toLowerCase();
      const matchSearch = store.city.toLowerCase().includes(term) ||
        store.pinCode.includes(term) ||
        store.name.toLowerCase().includes(term);
      return matchType && matchSearch;
    }).map(s => {
      let distance = null;
      if (userLocation && s.location?.coordinates) {
        distance = calculateDistance(userLocation[0], userLocation[1], s.location.coordinates[1], s.location.coordinates[0]);
      }
      return { ...s, distance };
    }).sort((a, b) => {
      if (a.distance && b.distance) return a.distance - b.distance;
      return 0;
    });
  }, [stores, activeType, searchQuery, userLocation]);

  // Handle Find My Location
  const handleFindMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
          setMapZoom(13);
        },
        (error) => {
          console.error("Error obtaining location: ", error);
          alert('Could not get your location. Please check browser permissions.');
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const focusStore = (store) => {
    if (store.location && store.location.coordinates) {
      // coordinates in GeoJSON are [lng, lat]
      setMapCenter([store.location.coordinates[1], store.location.coordinates[0]]);
      setMapZoom(15);
      setSelectedStore(store);
    }
  };

  const storeTypes = ['All', 'Farm', 'Distribution Hub', 'Partner Store', 'Retail Store'];

  if (isLoading) {
    return <div className="h-[calc(100vh-80px)] mt-20 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="h-[calc(100vh-88px)] md:h-[calc(100vh-96px)] lg:h-[calc(100vh-106px)] mt-[15px] md:mt-24 lg:mt-[106px] overflow-hidden flex flex-col md:flex-row bg-gray-50 dark:bg-[#0a0a0a]">

      {/* ---------------------------------------------------------------------- */}
      {/* SIDEBAR FOR STORES LIST OR DETAILS (Takes Top half on Mobile Layout)   */}
      {/* ---------------------------------------------------------------------- */}
      <div
        className={`w-full md:w-[400px] lg:w-[450px] ${isMobile ? 'h-[55%]' : 'h-full'} flex flex-col bg-white dark:bg-[#0a0a0a] md:border-r border-b md:border-b-0 border-gray-200 dark:border-gray-800 z-10 shrink-0 relative`}
      >

        {/* DETAILED VIEW REPLACES LIST WHEN STORE IS SELECTED */}
        {selectedStore ? (
          <div className="bg-white dark:bg-[#0a0a0a] animate-in fade-in h-full flex flex-col absolute inset-0 z-20">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111] sticky top-0 z-10 flex flex-row items-center justify-between">
              <button
                onClick={() => setSelectedStore(null)}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to map
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <span className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-primary-600/20 rounded-sm">
                {selectedStore.type}
              </span>

              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter uppercase">{selectedStore.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                {selectedStore.address}, {selectedStore.city} - {selectedStore.pinCode}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {selectedStore.contactPhone && (
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#111] p-4 border border-gray-200 dark:border-gray-800 rounded-none">
                    <Phone className="w-4 h-4 opacity-50" />
                    {selectedStore.contactPhone}
                  </div>
                )}
                {selectedStore.operatingHours && (
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#111] p-4 border border-gray-200 dark:border-gray-800 rounded-none">
                    <Clock className="w-4 h-4 opacity-50" />
                    {selectedStore.operatingHours.openTime} - {selectedStore.operatingHours.closeTime}
                  </div>
                )}
              </div>

              {selectedStore.amenities && selectedStore.amenities.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Amenities Available</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStore.amenities.map((amenity, idx) => (
                      <span key={idx} className="flex items-center gap-2 text-[10px] font-bold bg-white dark:bg-[#0a0a0a] text-gray-700 dark:text-gray-300 px-3 py-1.5 uppercase border border-gray-200 dark:border-gray-700 shadow-sm rounded-none">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Pinned to Bottom */}
            <div className="p-4 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 gap-3 flex sticky bottom-0">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.location.coordinates[1]},${selectedStore.location.coordinates[0]}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-primary-700 transition-colors rounded-none"
              >
                <Car className="w-4 h-4" /> Get Directions
              </a>
              {selectedStore.contactEmail && (
                <a
                  href={`mailto:${selectedStore.contactEmail}`}
                  className="flex items-center justify-center px-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity rounded-none"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ) : (

          /* SEARCH AND LIST VIEW (Default state) */
          <>
            <div className="pt-2 px-4 pb-3 md:p-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <div className="flex justify-between items-center mb-1 md:mb-6">
                <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                  Store <span className="text-primary-600 font-medium">Locator</span>
                </h1>
                {/* Find my location float button to right */}
                <button
                  onClick={handleFindMyLocation}
                  className="w-8 h-8 md:w-10 md:h-10 border border-gray-200 dark:border-gray-700 bg-gray-50 flex items-center justify-center dark:bg-[#111] hover:bg-gray-100 hover:dark:bg-[#1a1a1a] transition-colors rounded-none text-primary-600"
                  aria-label="Find my location"
                >
                  <Compass className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="relative mb-2 md:mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="SEARCH CITY OR PIN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-primary-600 dark:focus:border-primary-500 rounded-none text-xs font-bold uppercase tracking-widest transition-colors text-gray-900 dark:text-white placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {storeTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`py-1.5 px-4 rounded-none text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors border ${activeType === type
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredStores.length === 0 ? (
                <div className="text-center py-10 text-gray-400 dark:text-gray-600">
                  <Store className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase">No Match Found</p>
                </div>
              ) : (
                filteredStores.map(store => {
                  const openStatus = isStoreOpen(store.operatingHours?.openTime, store.operatingHours?.closeTime);
                  return (
                    <div
                      key={store._id}
                      onClick={() => focusStore(store)}
                      className="p-5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary-400 dark:hover:border-primary-600/50 transition-colors rounded-none shadow-sm flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{store.name}</h3>
                        {store.distance && (
                          <span className="text-[9px] bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-2 py-0.5 border border-gray-200 dark:border-gray-800 font-black uppercase tracking-widest whitespace-nowrap">
                            {store.distance} KM
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        {store.address}, {store.city} - {store.pinCode}
                      </p>

                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] mt-auto">
                        <span className={`flex items-center gap-1.5 ${openStatus ? 'text-emerald-500' : 'text-red-500'}`}>
                          {openStatus ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                          {openStatus ? 'OPEN NOW' : 'CLOSED'}
                        </span>
                        <span className="text-gray-400 dark:text-gray-600 border px-1.5 py-0.5 border-gray-200 dark:border-gray-800">
                          {store.type}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MAP VIEW CONTAINER (Takes Bottom half on Mobile Layout)                */}
      {/* ---------------------------------------------------------------------- */}
      <div className={`w-full ${isMobile ? 'h-[45%]' : 'flex-1'} relative bg-gray-200 dark:bg-gray-900 z-0`}>
        <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full" zoomControl={false}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={mapCenter} zoom={mapZoom} />

          {userLocation && (
            <Marker position={userLocation}>
              <Popup className="gramdairy-popup">
                <div className="text-[10px] uppercase font-black text-center tracking-widest">You are here</div>
              </Popup>
            </Marker>
          )}

          {filteredStores.map(store => {
            if (!store.location?.coordinates) return null;
            // GeoJSON coordinates are [longitude, latitude]
            const pos = [store.location.coordinates[1], store.location.coordinates[0]];
            const isSelected = selectedStore?._id === store._id;

            return (
              <React.Fragment key={`marker-group-${store._id}`}>
                <Marker
                  position={pos}
                  eventHandlers={{
                    click: () => focusStore(store),
                  }}
                >
                  <Popup className="gramdairy-popup">
                    <div className="p-1 min-w-[150px]">
                      <h3 className="font-bold text-sm mb-1 uppercase tracking-widest">{store.name}</h3>
                      <p className="text-[10px] text-gray-500 mb-3">{store.address}</p>
                      <button
                        onClick={() => focusStore(store)}
                        className="w-full bg-primary-600 text-white text-center py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-none border-b-2 border-primary-800 hover:bg-primary-500"
                      >
                        Detail View
                      </button>
                    </div>
                  </Popup>
                </Marker>

                {isSelected && (
                  <Circle
                    center={pos}
                    pathOptions={{ color: '#059669', fillColor: '#10b981', fillOpacity: 0.1, weight: 2, dashArray: '4, 8' }}
                    radius={500} // Radius reduced significantly for much tighter circle!
                  />
                )}
              </React.Fragment>
            )
          })}
        </MapContainer>
      </div>

      {/* Required style overrides for Leaflet & Custom Scroll */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-container { font-family: inherit; z-index: 10; padding-bottom: env(safe-area-inset-bottom); }
        .dark .leaflet-container { filter: invert(1) hue-rotate(180deg) brightness(95%) contrast(90%); }
        .leaflet-popup-content-wrapper { border-radius: 0; border: 1px solid #e5e7eb; background: var(--bg-primary); }
        .dark .leaflet-popup-content-wrapper { border: 1px solid #1f2937; }
        .leaflet-popup-tip { background: var(--bg-primary); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 0px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
      `}} />
    </div>
  );
};

export default StoreLocator;
