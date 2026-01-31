
import React from 'react';
import { UserRole } from '../types';
import { ROLE_CONFIG } from '../constants';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white border-b sticky top-0 z-50 overflow-x-auto shadow-sm">
      {Object.entries(ROLE_CONFIG).map(([role, config]) => (
        <button
          key={role}
          onClick={() => onRoleChange(role as UserRole)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentRole === role
              ? `${config.color} text-white shadow-md scale-105`
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {config.icon}
          <span className="whitespace-nowrap">{config.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
