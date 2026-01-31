
export enum UserRole {
  ASHA_WORKER = 'ASHA_WORKER',
  DOCTOR = 'DOCTOR',
  HOSPITAL_MANAGER = 'HOSPITAL_MANAGER',
  AMBULANCE_DRIVER = 'AMBULANCE_DRIVER',
  DHO = 'DHO',
  NATIONAL_AUTHORITY = 'NATIONAL_AUTHORITY'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum PatientStatus {
  OBSERVATION = 'Under Observation',
  REFERRED = 'Referred',
  RECOVERED = 'Recovered'
}

export interface ClinicalEvent {
  date: string;
  note: string;
  recordedBy: string;
  role: string;
  type: 'Symptom' | 'Vitals' | 'Diagnosis' | 'Update';
  progression?: 'Improving' | 'Worsening' | 'Stable';
}

export interface Patient {
  id: string;
  age: string;
  gender: string;
  village: string;
  reportingSource: string;
  symptoms: string[];
  vitals: {
    temp: string;
    pulse: string;
    bp?: string;
    respRate?: string;
  };
  riskLevel: RiskLevel;
  severity: 'Normal' | 'Serious' | 'Critical';
  status: PatientStatus;
  timestamp: string;
  aiDiagnosis?: string;
  aiReasoning?: string;
  aiConfidence?: number;
  clinicalTimeline: ClinicalEvent[];
  previousCare?: {
    lastFacility: string;
    facilityType: string;
    location: string;
    lastVisitDate: string;
    encounterType: string;
    priorDiagnosis: string;
    investigations: Array<{
      test: string;
      status: 'Completed' | 'Pending';
      findings: string;
    }>;
    reportType: string;
    reportSummary: string;
  };
}

export interface HospitalStats {
  id: string;
  name: string;
  totalBeds: number;
  availableBeds: number;
  icuAvailable: boolean;
  oxygenStock: number;
  emergencyStatus: 'Active' | 'Full';
}
