import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, Plus, MapPin, Edit, Trash2, Clock, Map } from 'lucide-react';
import storeService from '../../services/storeService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const AdminStoreLocator = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const initialFormState = {
    name: '',
    type: 'Retail Store',
    address: '',
    city: '',
    pinCode: '',
    lat: '',
    lng: '',
    contactPhone: '',
    contactEmail: '',
    openTime: '08:00',
    closeTime: '20:00',
    amenities: '', // comma separated initially
    isActive: true
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);

  // Fetch stores
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: () => storeService.getStores(), // getting all active and inactive can be handled by backend, assuming getStores gets all here for simplicity, or we can use admin specific route
  });

  const stores = data?.data || [];

  const createMutation = useMutation({
    mutationFn: storeService.createStore,
    onSuccess: () => {
      toast.success('Store added successfully');
      queryClient.invalidateQueries(['admin-stores']);
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error occurred')
  });

  const updateMutation = useMutation({
    mutationFn: (args) => storeService.updateStore(args.id, args.data),
    onSuccess: () => {
      toast.success('Store updated');
      queryClient.invalidateQueries(['admin-stores']);
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error occurred')
  });

  const deleteMutation = useMutation({
    mutationFn: storeService.deleteStore,
    onSuccess: () => {
      toast.success('Store removed');
      queryClient.invalidateQueries(['admin-stores']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error occurred')
  });

  const openModal = (store = null) => {
    if (store) {
      setIsEditing(true);
      setEditId(store._id);
      setFormData({
        name: store.name,
        type: store.type,
        address: store.address,
        city: store.city,
        pinCode: store.pinCode,
        lat: store.location?.coordinates[1] || '',
        lng: store.location?.coordinates[0] || '',
        contactPhone: store.contactPhone || '',
        contactEmail: store.contactEmail || '',
        openTime: store.operatingHours?.openTime || '08:00',
        closeTime: store.operatingHours?.closeTime || '20:00',
        amenities: store.amenities ? store.amenities.join(', ') : '',
        isActive: store.isActive
      });
    } else {
      setIsEditing(false);
      setEditId(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormState);
    setIsEditing(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) {
      toast.error('Latitude and Longitude are required');
      return;
    }

    const payload = {
      name: formData.name,
      type: formData.type,
      address: formData.address,
      city: formData.city,
      pinCode: formData.pinCode,
      location: {
        type: 'Point',
        coordinates: [Number(formData.lng), Number(formData.lat)] // [long, lat] for GeoJSON
      },
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      operatingHours: { openTime: formData.openTime, closeTime: formData.closeTime },
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      isActive: formData.isActive
    };

    if (isEditing) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-end justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-2">Location Manager</h2>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
            <Store className="w-8 h-8 opacity-50" /> Stores Map
          </h1>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2 rounded-none">
          <Plus className="w-4 h-4" /> Add New Location
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>
      ) : stores.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-[#0a0a0a] border border-dashed border-gray-300 dark:border-gray-800">
          <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No store locations added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map(store => (
            <div key={store._id} className={`p-6 border ${store.isActive ? 'border-gray-200 dark:border-gray-800' : 'border-red-200 bg-red-50 dark:bg-red-900/10'} bg-white dark:bg-[#0a0a0a] relative group`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1">{store.type}</span>
                  <h3 className="text-lg font-black uppercase tracking-tighter mt-3">{store.name}</h3>
                </div>
                {!store.isActive && <span className="text-[10px] font-bold text-red-600 uppercase">Inactive</span>}
              </div>
              
              <p className="text-xs text-gray-500 flex items-start gap-2 mb-4">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                {store.address}, {store.city} - {store.pinCode}
              </p>
              
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <Clock className="w-4 h-4 opacity-50" /> {store.operatingHours?.openTime} to {store.operatingHours?.closeTime}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openModal(store)} className="flex-1 flex justify-center gap-2 rounded-none">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => { if(window.confirm('Delete store?')) deleteMutation.mutate(store._id); }} className="flex justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 rounded-none w-12">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal manually built for simplicity and direct control */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl relative">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#111111] sticky top-0 z-10">
              <h2 className="text-xl font-black uppercase tracking-tighter">{isEditing ? 'Edit Store Location' : 'Add New Location'}</h2>
              <button type="button" onClick={closeModal} className="text-gray-500 hover:text-black dark:hover:text-white text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Store Name</label>
                  <Input name="name" value={formData.name} onChange={handleChange} required className="!rounded-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Store Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-transparent border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm focus:outline-none focus:border-primary-600 rounded-none">
                    <option value="Retail Store">Retail Store</option>
                    <option value="Farm">Farm</option>
                    <option value="Distribution Hub">Distribution Hub</option>
                    <option value="Partner Store">Partner Store</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Address Line</label>
                <Input name="address" value={formData.address} onChange={handleChange} required className="!rounded-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City</label>
                  <Input name="city" value={formData.city} onChange={handleChange} required className="!rounded-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">PIN Code</label>
                  <Input name="pinCode" value={formData.pinCode} onChange={handleChange} required className="!rounded-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-[#111111] p-4 border border-gray-200 dark:border-gray-800">
                <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3 text-red-500" /> Coordinates (GeoJSON format uses Long,Lat but map usually needs Lat,Long. Just input correctly below.)</div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Latitude (e.g. 28.7041)</label>
                  <Input name="lat" type="number" step="any" value={formData.lat} onChange={handleChange} required className="!rounded-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Longitude (e.g. 77.1025)</label>
                  <Input name="lng" type="number" step="any" value={formData.lng} onChange={handleChange} required className="!rounded-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Contact Phone</label>
                  <Input name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="!rounded-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Contact Email</label>
                  <Input name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="!rounded-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Opens At (HH:mm)</label>
                  <Input name="openTime" type="time" value={formData.openTime} onChange={handleChange} required className="!rounded-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Closes At (HH:mm)</label>
                  <Input name="closeTime" type="time" value={formData.closeTime} onChange={handleChange} required className="!rounded-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Amenities (Comma separated)</label>
                <Input name="amenities" value={formData.amenities} onChange={handleChange} placeholder="e.g. Fresh Milk, Subscriptions Handled" className="!rounded-none" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/50">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 accent-primary-600 rounded-none cursor-pointer" />
                <span className="text-[10px] font-black uppercase tracking-widest">Store is Active & Visible</span>
              </label>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-[#0a0a0a]">
                <Button type="button" variant="outline" onClick={closeModal} className="rounded-none">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-none min-w-[120px]">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Details'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoreLocator;
