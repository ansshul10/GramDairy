import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCw, ZoomIn } from 'lucide-react';
import Button from '../ui/Button';

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);

  const onCropEnd = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const img = await createImage(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const maxSize = Math.max(img.width, img.height);
      const safeMargin = 2 * ((maxSize / 2) * Math.sqrt(2));
      canvas.width = safeMargin;
      canvas.height = safeMargin;

      ctx.translate(safeMargin / 2, safeMargin / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-safeMargin / 2, -safeMargin / 2);

      ctx.drawImage(
        img,
        safeMargin / 2 - img.width * 0.5,
        safeMargin / 2 - img.height * 0.5
      );

      const data = ctx.getImageData(0, 0, safeMargin, safeMargin);
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.putImageData(
        data,
        Math.round(0 - safeMargin / 2 + img.width * 0.5 - croppedAreaPixels.x),
        Math.round(0 - safeMargin / 2 + img.height * 0.5 - croppedAreaPixels.y)
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg');
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleSave = async () => {
    const croppedBlob = await getCroppedImg();
    onCropComplete(croppedBlob);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-300">
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">Image Studio</h3>
          <p className="text-xl font-black text-white italic tracking-tighter uppercase">Crop Profile Photo</p>
        </div>
        <button onClick={onCancel} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-none">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 relative bg-[#0a0a0a]">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          rotation={rotation}
          onCropChange={onCropChange}
          onCropComplete={onCropEnd}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="p-8 bg-[#0a0a0a] border-t border-white/10 space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-4xl mx-auto">
          <div className="w-full space-y-3">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-2"><ZoomIn className="w-3 h-3" /> Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
             </div>
             <input
               type="range"
               value={zoom}
               min={1}
               max={3}
               step={0.1}
               aria-labelledby="Zoom"
               onChange={(e) => setZoom(e.target.value)}
               className="w-full h-1 bg-gray-800 appearance-none cursor-pointer accent-primary-600"
             />
          </div>
          <div className="w-full space-y-3">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-2"><RotateCw className="w-3 h-3" /> Rotation</span>
                <span>{rotation}°</span>
             </div>
             <input
               type="range"
               value={rotation}
               min={0}
               max={360}
               step={1}
               aria-labelledby="Rotation"
               onChange={(e) => setRotation(e.target.value)}
               className="w-full h-1 bg-gray-800 appearance-none cursor-pointer accent-amber-500"
             />
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button 
            onClick={onCancel}
            className="h-14 px-10 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="h-14 px-10 bg-primary-600 text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-primary-500 transition-all"
          >
            <Check className="w-4 h-4" /> Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
