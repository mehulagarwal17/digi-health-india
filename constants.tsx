
import React from 'react';
import { 
  UserRound, 
  Stethoscope, 
  Building2, 
  Ambulance, 
  BarChart3, 
  Globe2, 
  PlusCircle, 
  History, 
  Bell, 
  AlertTriangle 
} from 'lucide-react';
import { UserRole } from './types';

export const ROLE_CONFIG = {
  [UserRole.ASHA_WORKER]: {
    label: 'ASHA Worker',
    icon: <UserRound size={20} />,
    color: 'bg-emerald-600',
    description: 'Grassroots data collection'
  },
  [UserRole.DOCTOR]: {
    label: 'PHC Doctor',
    icon: <Stethoscope size={20} />,
    color: 'bg-blue-600',
    description: 'Clinical diagnosis & escalation'
  },
  [UserRole.HOSPITAL_MANAGER]: {
    label: 'Hospital Admin',
    icon: <Building2 size={20} />,
    color: 'bg-indigo-600',
    description: 'Resource & bed management'
  },
  [UserRole.AMBULANCE_DRIVER]: {
    label: 'Ambulance Driver',
    icon: <Ambulance size={20} />,
    color: 'bg-red-600',
    description: 'Emergency routing'
  },
  [UserRole.DHO]: {
    label: 'District Officer',
    icon: <BarChart3 size={20} />,
    color: 'bg-slate-800',
    description: 'District monitoring'
  },
  [UserRole.NATIONAL_AUTHORITY]: {
    label: 'National Authority',
    icon: <Globe2 size={20} />,
    color: 'bg-orange-600',
    description: 'Strategic planning'
  }
};
