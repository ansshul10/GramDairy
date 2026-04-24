import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      // Show prompt after a delay or certain user interaction
      setTimeout(() => setShowPrompt(true), 5000); 
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If it's iOS and not already in standalone mode, show instructions
    if (isIOSDevice && !window.navigator.standalone) {
      setTimeout(() => setShowPrompt(true), 10000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (evt) => {
    evt.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setShowPrompt(false);
    });
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-900 dark:border-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 relative">
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Install GramDairy App</h4>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-1">
              {isIOS ? 'Tap Share and then "Add to Home Screen"' : 'Add to your home screen for a better experience'}
            </p>
          </div>
          {!isIOS ? (
            <button
              onClick={onClick}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Install
            </button>
          ) : (
            <div className="flex items-center gap-2 text-primary-600 animate-pulse">
              <Share className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
