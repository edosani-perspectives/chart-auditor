import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patient list
const PATIENTS = [
  { id: '137766', name: 'Jessica Hull', mrNumber: '2025-127', folderName: '137766-jessica-hull', originalPdfName: '137766_2025-127_jessica_hull-full-casefile.pdf' },
  { id: '137768', name: 'Audrey Chaing', mrNumber: '2025-133', folderName: '137768-audrey-chaing', originalPdfName: '137768_2025-133_audrey_chaing-full-casefile.pdf' },
  { id: '137770', name: 'Carson Sheaffer', mrNumber: '2025-132', folderName: '137770-carson-sheaffer', originalPdfName: '137770_2025-132_carson_sheaffer-full-casefile.pdf' },
  { id: '137771', name: 'Lily Leo', mrNumber: '2025-130', folderName: '137771-lily-leo', originalPdfName: '137771_2025-130_lily_leo-full-casefile.pdf' },
  { id: '137772', name: 'Megan Vinson', mrNumber: '2025-128', folderName: '137772-megan-vinson', originalPdfName: '137772_2025-128_megan_vinson-full-casefile.pdf' },
  { id: '137773', name: 'Randall Clark Morrison', mrNumber: '2025-129', folderName: '137773-randall-clark-morrison', originalPdfName: '137773_2025-129_randall_clark_morrison-full-casefile.pdf' },
  { id: '137774', name: 'Ryan Bohannon', mrNumber: '2025-124', folderName: '137774-ryan-bohannon', originalPdfName: '137774_2025-124_ryan_bohannon-full-casefile.pdf' },
  { id: '137775', name: 'Scott Gilbert', mrNumber: '2025-125', folderName: '137775-scott-gilbert', originalPdfName: '137775_2025-125_scott_gilbert-full-casefile.pdf' }
];

// Hardcoded data from App.tsx
const AUDIT_CATEGORIES = [
  {
    id: 'critical',
    title: 'Critical Actions',
    severity: 'critical',
    items: [
      { id: 'mtp', title: 'Master Treatment Plan', description: 'Document completely absent. No goals or signatures.', status: 'missing' },
      { id: 'itp', title: 'Initial Treatment Plan', description: 'Required within 24hrs. Not found.', status: 'missing' },
      { id: 'vob', title: 'Verification of Benefits', description: 'Source document missing from chart.', status: 'missing' }
    ]
  },
  {
    id: 'process',
    title: 'Process & Timeliness',
    severity: 'warning',
    items: [
      { id: 'outcome', title: 'Outcome Measures (BDI)', description: 'Completed Day 8. Req: < 72 Hours.', status: 'late' },
      { id: 'aftercare', title: 'Initial Aftercare Plan', description: 'Completed Day 11. Req: < 72 Hours.', status: 'late' },
      { id: 'peer', title: 'Peer Integration', description: 'No Peer Goal found in Master Plan.', status: 'incomplete' }
    ]
  },
  {
    id: 'hygiene',
    title: 'Data Hygiene',
    severity: 'admin',
    items: [
      { id: 'demo', title: 'Demographics', description: 'Missing: Race, Ethnicity, Pronouns.', status: 'empty' },
      { id: 'cards', title: 'ID & Insurance Cards', description: 'Images of physical cards are missing.', status: 'upload' }
    ]
  },
  {
    id: 'good',
    title: 'Compliant Systems',
    severity: 'good',
    items: [
      { id: 'med', title: 'Medical / Psych', description: 'H&P, UDS, Detox Protocols verified.', status: 'compliant' },
      { id: 'clinical', title: 'Clinical Notes', description: 'Weekly Summaries present.', status: 'compliant' },
      { id: 'legal', title: 'Legal', description: 'Consents & ROIs fully signed.', status: 'compliant' }
    ]
  }
];

const TIMELINE_DATA = [
  {
    label: "Day 0: Admission (12/04)",
    events: [
      { title: "Admission Consents", description: "All legal consents signed.", status: 'success' },
      { title: "Initial Tx Plan", description: "MISSING: Not initiated within 24hr.", status: 'fail' }
    ]
  },
  {
    label: "Day 3: Clinical (12/07)",
    events: [
      { title: "Outcome Measures", description: "LATE: BDI/BAI not found in window.", status: 'fail' },
      { title: "Aftercare Plan", description: "LATE: Discharge strategy missing.", status: 'fail' }
    ]
  },
  {
    label: "Day 7: Weekly (12/11)",
    events: [
      { title: "Weekly Clinical Note", description: "Progress documented.", status: 'success' },
      { title: "Master Treatment Plan", description: "CRITICAL: No MTP on record.", status: 'fail' }
    ]
  }
];

// Hardcoded data from constants.tsx
const DETAILED_AUDIT_DATA = [
  {
    title: "Admissions & Demographics",
    items: [
      { id: "adm-1", question: "Is the Pre-Admission Assessment attached?", answer: "YES", page: 4 },
      { id: "adm-2", question: "Is the VOB attached?", answer: "NO", page: 1 },
      { id: "adm-3", question: "Are medical records attached?", answer: "YES", page: 76 },
      { id: "adm-4", question: "Are all consents completed and signed?", answer: "YES", page: 14 },
      { id: "adm-5", question: "Are all ROIs completed and signed?", answer: "YES", page: 46 },
      { id: "adm-6", question: "Is insurance card uploaded?", answer: "NO", page: 9 },
      { id: "adm-7", question: "Is Preferred Language answered?", answer: "NO", page: 9 }
    ]
  },
  {
    title: "Medical & Safety",
    items: [
      { id: "med-1", question: "Provider completing Psych Eval/H&P?", answer: "YES", page: 111 },
      { id: "med-2", question: "Was H&P completed within 72 hrs?", answer: "YES", page: 111 },
      { id: "med-3", question: "Was a UDS completed upon admission?", answer: "YES", page: 66 },
      { id: "med-4", question: "Was initial Safe-T Assessment completed?", answer: "YES", page: 35 }
    ]
  },
  {
    title: "Clinical Intake",
    items: [
      { id: "cli-1", question: "Was BPS completed within 24 hours?", answer: "YES", page: 287 },
      { id: "cli-2", question: "Was Outcome Measure completed?", answer: "NO", page: 286 },
      { id: "cli-3", question: "Was Case Mgmt Assessment completed?", answer: "NO", page: 1 }
    ]
  },
  {
    title: "Treatment Planning",
    items: [
      { id: "tx-1", question: "Was Master Treatment Plan created?", answer: "NO", page: 1 },
      { id: "tx-2", question: "Are problems/goals reflected on Plan?", answer: "N/A", page: 1 },
      { id: "tx-3", question: "Have member/counselor signed Plan?", answer: "NO", page: 1 }
    ]
  }
];

const MOCK_UR_DATA = {
  payer: "Blue Cross Blue Shield",
  planType: "PPO Gold Plus",
  deductibleMet: "$2,500 / $3,000",
  oopMax: "$1,800 / $6,000",

  clinicalCycle: {
    currentCycle: "Day 21 Assessment",
    nextReviewDate: "12/29/25",
    notesSummary: [
      "Patient continues to engage actively in individual therapy sessions, demonstrating improved coping strategies for managing anxiety and depression triggers.",
      "Group therapy participation has increased significantly, with patient taking on peer mentor role and offering support to newer residents.",
      "Medication compliance remains excellent with mood stabilization noted. Sleep patterns have normalized from initial insomnia presentation."
    ],
    barriersToStepDown: "Patient reports continued anxiety about returning to independent living environment. Family dynamics remain unresolved with ongoing conflict with spouse regarding financial responsibilities.",
    reasonsForStepDown: "Demonstrated medication compliance, active engagement in treatment programming, acquisition of new coping skills, and expressed readiness for increased independence in supervised setting.",
    remedies: "Intensive outpatient programming with family therapy component, weekly case management follow-up, and connection to community-based peer support groups before discharge."
  },

  reviews: [
    {
      id: "ur-1",
      type: "Initial",
      date: "12/08/25",
      reviewer: "Dr. Sarah Chen, MD",
      status: "Approved",
      days: 14,
      clinicalNotes: "Patient presented with severe depression with psychotic features following job loss and financial stressors. Demonstrates active suicidal ideation with plan requiring intensive stabilization and safety monitoring. Medical necessity clearly established for residential level of care.",
      criteriaMet: ["Acute Safety Risk", "Failed Outpatient", "Medical Complexity"],
      datesAuthorized: "12/08/25 - 12/22/25",
      authNumber: "UR2025-44821"
    },
    {
      id: "ur-2",
      type: "Continued Stay",
      date: "12/22/25",
      reviewer: "Lisa Rodriguez, LCSW",
      status: "Approved",
      days: 7,
      clinicalNotes: "Continued progress with mood stabilization on medication regimen. Patient actively engaging in individual and group therapy with improved insight into triggers. Still requires 24/7 support structure as outpatient resources being coordinated.",
      criteriaMet: ["Active Treatment Response", "Discharge Planning", "Safety Monitoring"],
      datesAuthorized: "12/22/25 - 12/29/25",
      authNumber: "UR2025-45190"
    }
  ],

  assessment: {
    diagnoses: ["Major Depressive Disorder, Severe with Psychotic Features", "Generalized Anxiety Disorder", "Alcohol Use Disorder, Moderate"],
    precipitatingEvent: "Job termination and subsequent financial crisis leading to marital conflict and increased alcohol use",

    mentalStatus: {
      appearance: "Well-groomed, appropriate dress",
      mood: "Euthymic",
      affect: "Mood congruent, increased range",
      risk: "Low risk - no current SI/HI",
      judgement: "Improving, adequate",
      orientation: "Person, place, time, situation"
    },

    biomedicalConditions: "Hypertension (controlled), Type 2 Diabetes (well-managed)",
    medications: "Sertraline 100mg daily, Metformin 500mg BID, Lisinopril 10mg daily",
    substanceUseHistory: "Alcohol use escalated to 8-10 drinks daily prior to admission. 21 days sober.",
    treatmentHistory: "Previous outpatient therapy 2019-2020 for anxiety. No prior residential treatment.",

    traumaHistory: {
      physical: false,
      sexual: false,
      emotional: true
    },

    psychosocialStressors: {
      housing: "At risk of foreclosure, behind 3 months on mortgage",
      financial: "Severe - recent job loss, mounting debt",
      employment: "Unemployed x 2 months, actively job searching",
      relationships: "Marital strain, considering separation",
      legal: "No current legal issues"
    },

    moodSymptoms: "Depression significantly improved from admission. Anxiety symptoms decreased with coping skill implementation.",

    barriersToDischarge: "Incomplete discharge planning, need for intensive outpatient placement, ongoing family/marital therapy needs",
    treatmentPlanGoals: "1) Maintain mood stability 2) Develop relapse prevention plan 3) Secure stable housing 4) Family therapy engagement",
    dischargePlan: "Intensive outpatient program 5x/week, weekly individual therapy, couples counseling, case management for housing assistance"
  }
};

// Main migration function
async function migrate() {
  const projectRoot = path.resolve(__dirname, '..');
  const patientDataDir = path.join(projectRoot, 'patient-data');
  const casefilesDir = path.join(projectRoot, 'casefiles');

  console.log('Starting patient data migration...');
  console.log(`Project root: ${projectRoot}`);
  console.log(`Patient data directory: ${patientDataDir}`);

  // Create patient-data directory if it doesn't exist
  if (!fs.existsSync(patientDataDir)) {
    fs.mkdirSync(patientDataDir, { recursive: true });
    console.log('Created patient-data directory');
  }

  // Generate data for each patient
  const manifest = [];

  for (const patient of PATIENTS) {
    console.log(`\nProcessing ${patient.name}...`);

    const patientFolder = path.join(patientDataDir, patient.folderName);

    // Create patient folder
    if (!fs.existsSync(patientFolder)) {
      fs.mkdirSync(patientFolder, { recursive: true });
      console.log(`  Created folder: ${patient.folderName}`);
    }

    // Generate random compliance scores for variety
    const randomRings = {
      compliance: Math.floor(Math.random() * 40) + 20, // 20-60
      process: Math.floor(Math.random() * 50) + 30,    // 30-80
      data: Math.floor(Math.random() * 40) + 40        // 40-80
    };

    // Generate executive-summary.json
    const executiveSummary = {
      patientId: patient.id,
      name: patient.name,
      mrNumber: patient.mrNumber,
      careType: "Residential",
      admitDate: "12/04/2025",
      rings: randomRings,
      categories: AUDIT_CATEGORIES,
      timeline: TIMELINE_DATA
    };

    fs.writeFileSync(
      path.join(patientFolder, 'executive-summary.json'),
      JSON.stringify(executiveSummary, null, 2)
    );
    console.log('  ✓ Generated executive-summary.json');

    // Generate audit-details.json
    const auditDetails = {
      patientId: patient.id,
      categories: DETAILED_AUDIT_DATA
    };

    fs.writeFileSync(
      path.join(patientFolder, 'audit-details.json'),
      JSON.stringify(auditDetails, null, 2)
    );
    console.log('  ✓ Generated audit-details.json');

    // Generate ur-analysis.json
    const urAnalysis = {
      patientId: patient.id,
      ...MOCK_UR_DATA
    };

    fs.writeFileSync(
      path.join(patientFolder, 'ur-analysis.json'),
      JSON.stringify(urAnalysis, null, 2)
    );
    console.log('  ✓ Generated ur-analysis.json');

    // Copy PDF if it exists
    const originalPdfPath = path.join(casefilesDir, patient.originalPdfName);
    const newPdfPath = path.join(patientFolder, 'casefile.pdf');

    if (fs.existsSync(originalPdfPath)) {
      fs.copyFileSync(originalPdfPath, newPdfPath);
      console.log('  ✓ Copied PDF casefile');
    } else {
      console.log(`  ⚠ Warning: PDF not found at ${originalPdfPath}`);
    }

    // Add to manifest
    manifest.push({
      patientId: patient.id,
      name: patient.name,
      folderPath: patient.folderName
    });
  }

  // Generate patients-manifest.json
  fs.writeFileSync(
    path.join(patientDataDir, 'patients-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('\n✓ Generated patients-manifest.json');

  console.log('\n✅ Migration complete!');
  console.log(`   Created ${PATIENTS.length} patient folders with JSON data files`);
  console.log(`   Location: ${patientDataDir}`);
}

// Run migration
migrate().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
