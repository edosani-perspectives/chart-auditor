
import React from 'react';

export enum AuditStatus {
  MISSING = 'missing',
  LATE = 'late',
  INCOMPLETE = 'incomplete',
  EMPTY = 'empty',
  UPLOAD = 'upload',
  COMPLIANT = 'compliant'
}

export enum CategorySeverity {
  CRITICAL = 'critical',
  WARNING = 'warning',
  ADMIN = 'admin',
  GOOD = 'good'
}

export interface AuditItem {
  id: string;
  title: string;
  description: string;
  status?: AuditStatus;
}

export interface AuditCategory {
  id: string;
  title: string;
  severity: CategorySeverity;
  items: AuditItem[];
  icon: React.ReactNode;
}

export interface TimelineEvent {
  title: string;
  status: 'success' | 'fail';
  description?: string;
}

export interface TimelineGroup {
  label: string;
  events: TimelineEvent[];
}

export interface PatientData {
  name: string;
  mrNumber: string;
  careType: string;
  admitDate: string;
  rings: {
    compliance: number;
    process: number;
    data: number;
  };
}

// Detailed Audit Types
export type DetailedStatus = 'YES' | 'NO' | 'N/A';

export interface DetailedAuditItem {
  id: string;
  question: string;
  answer: DetailedStatus;
  page: number;
}

export interface DetailedAuditCategory {
  title: string;
  items: DetailedAuditItem[];
}

// Patient metadata for discovery
export interface PatientMetadata {
  patientId: string;
  name: string;
  folderPath: string;
}

// Complete patient data structure
export interface PatientDataComplete {
  executiveSummary: ExecutiveSummaryData;
  auditDetails: AuditDetailsData;
  urAnalysis: URAnalysisData;
  pdfPath: string;
}

export interface ExecutiveSummaryData {
  patientId: string;
  name: string;
  mrNumber: string;
  careType: string;
  admitDate: string;
  rings: {
    compliance: number;
    process: number;
    data: number;
  };
  categories: AuditCategory[];
  timeline: TimelineGroup[];
  perspectives_reclaim?: any;
}

export interface AuditDetailsData {
  patientId: string;
  categories: DetailedAuditCategory[];
}

export interface URAnalysisData {
  patientId: string;
  payer: string;
  planType: string;
  deductibleMet: string;
  oopMax: string;
  clinicalCycle: ClinicalCycle;
  reviews: Review[];
  assessment: Assessment;
}

export interface ClinicalCycle {
  currentCycle: string;
  nextReviewDate: string;
  notesSummary: string[];
  barriersToStepDown: string;
  reasonsForStepDown: string;
  remedies: string;
}

export interface Review {
  id: string;
  type: string;
  date: string;
  reviewer: string;
  status: string;
  days: number;
  clinicalNotes: string;
  criteriaMet: string[];
  datesAuthorized: string;
  authNumber: string;
}

export interface Assessment {
  diagnoses: string[];
  precipitatingEvent: string;
  mentalStatus: MentalStatus;
  biomedicalConditions: string;
  medications: string;
  substanceUseHistory: string;
  treatmentHistory: string;
  traumaHistory: TraumaHistory;
  psychosocialStressors: PsychosocialStressors;
  moodSymptoms: string;
  barriersToDischarge: string;
  treatmentPlanGoals: string;
  dischargePlan: string;
}

export interface MentalStatus {
  appearance: string;
  mood: string;
  affect: string;
  risk: string;
  judgement: string;
  orientation: string;
}

export interface TraumaHistory {
  physical: boolean;
  sexual: boolean;
  emotional: boolean;
}

export interface PsychosocialStressors {
  housing: string;
  financial: string;
  employment: string;
  relationships: string;
  legal: string;
}
