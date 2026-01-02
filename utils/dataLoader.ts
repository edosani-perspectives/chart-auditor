import { PatientMetadata, PatientDataComplete, ExecutiveSummaryData, AuditDetailsData, URAnalysisData } from '../types';

const PATIENT_DATA_DIR = '/patient-data';

/**
 * Discovers all patient folders by scanning the patient-data directory
 * Returns metadata for each patient found
 */
export async function discoverPatients(): Promise<PatientMetadata[]> {
  try {
    const response = await fetch(`${PATIENT_DATA_DIR}/patients-manifest.json`);
    if (response.ok) {
      const manifest: PatientMetadata[] = await response.json();
      return manifest;
    }
  } catch (error) {
    console.warn('No patients manifest found, falling back to empty list', error);
  }

  return [];
}

/**
 * Loads executive summary data for a patient
 */
export async function loadExecutiveSummary(patientId: string, folderPath: string): Promise<ExecutiveSummaryData | null> {
  try {
    const response = await fetch(`${PATIENT_DATA_DIR}/${folderPath}/executive-summary.json`);
    if (!response.ok) throw new Error('Failed to load executive summary');
    return await response.json();
  } catch (error) {
    console.error(`Error loading executive summary for ${patientId}:`, error);
    return null;
  }
}

/**
 * Loads audit details data for a patient
 */
export async function loadAuditDetails(patientId: string, folderPath: string): Promise<AuditDetailsData | null> {
  try {
    const response = await fetch(`${PATIENT_DATA_DIR}/${folderPath}/audit-details.json`);
    if (!response.ok) throw new Error('Failed to load audit details');
    return await response.json();
  } catch (error) {
    console.error(`Error loading audit details for ${patientId}:`, error);
    return null;
  }
}

/**
 * Loads UR analysis data for a patient
 */
export async function loadURAnalysis(patientId: string, folderPath: string): Promise<URAnalysisData | null> {
  try {
    const response = await fetch(`${PATIENT_DATA_DIR}/${folderPath}/ur-analysis.json`);
    if (!response.ok) throw new Error('Failed to load UR analysis');
    return await response.json();
  } catch (error) {
    console.error(`Error loading UR analysis for ${patientId}:`, error);
    return null;
  }
}

/**
 * Gets the PDF path for a patient
 */
export function getPatientPDFPath(folderPath: string): string {
  return `${PATIENT_DATA_DIR}/${folderPath}/casefile.pdf`;
}

/**
 * Loads complete patient data (all three JSON files)
 */
export async function loadPatientData(patientId: string, folderPath: string): Promise<PatientDataComplete | null> {
  try {
    const [executiveSummary, auditDetails, urAnalysis] = await Promise.all([
      loadExecutiveSummary(patientId, folderPath),
      loadAuditDetails(patientId, folderPath),
      loadURAnalysis(patientId, folderPath)
    ]);

    if (!executiveSummary || !auditDetails || !urAnalysis) {
      throw new Error('Missing required patient data files');
    }

    return {
      executiveSummary,
      auditDetails,
      urAnalysis,
      pdfPath: getPatientPDFPath(folderPath)
    };
  } catch (error) {
    console.error(`Error loading patient data for ${patientId}:`, error);
    return null;
  }
}
