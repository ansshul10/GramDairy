import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const ProfileProgress = ({ percentage, user }) => {
  const steps = [
    { label: 'Name', complete: !!user?.name },
    { label: 'Phone', complete: !!user?.phoneNumber },
    { label: 'Address', complete: !!user?.addresses?.length },
    { label: 'Avatar', complete: !!user?.avatar },
    { label: '2FA', complete: !!user?.twoFactorEnabled },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600 mb-2 italic">Profile Strength</h4>
          <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
            {percentage}% <span className="text-gray-400 font-medium text-lg italic">Complete</span>
          </p>
        </div>
        <div className="text-right">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 ${percentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
                {percentage === 100 ? 'Verified Account' : 'Action Required'}
            </span>
        </div>
      </div>

      <div className="relative pt-1">
        <div className="overflow-hidden h-1 text-xs flex bg-gray-100 dark:bg-gray-800 rounded-none">
          <div
            style={{ width: `${percentage}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${percentage === 100 ? 'bg-emerald-500' : 'bg-primary-600'}`}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            {step.complete ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            ) : (
              <Circle className="w-3 h-3 text-gray-300" />
            )}
            <span className={`text-[9px] font-bold uppercase tracking-widest ${step.complete ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileProgress;
