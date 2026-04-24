import React from 'react';
import zxcvbn from 'zxcvbn';

const PasswordMeter = ({ password }) => {
  const result = zxcvbn(password || '');
  const score = password ? result.score : -1;

  const getColor = () => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-emerald-500';
      default: return 'bg-gray-200 dark:bg-gray-800';
    }
  };

  const getLabel = () => {
    switch (score) {
      case 0: return 'Weak';
      case 1: return 'Fair';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Enter a password';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
        <span>Strength</span>
        <span className={score >= 0 ? 'text-gray-900 dark:text-white' : ''}>{getLabel()}</span>
      </div>
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 flex overflow-hidden">
        {[0, 1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex-1 mr-0.5 last:mr-0 transition-all duration-500 ${
              score >= step ? getColor() : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordMeter;
