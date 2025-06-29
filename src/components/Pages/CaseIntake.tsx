import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  Users, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  Gavel,
  Phone,
  Mail,
  Home,
  CreditCard,
  Badge,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { Case } from '../../types';
import CaseDetails from './CaseDetails';

const CaseIntake: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [caseType, setCaseType] = useState<'criminal' | 'civil' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);
  const [showCaseDetails, setShowCaseDetails] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Common fields
    title: '',
    dateReported: new Date().toISOString().split('T')[0],
    timeReported: new Date().toTimeString().split(' ')[0].slice(0, 5),
    reportingOfficer: '',
    stationCode: '',
    narrative: '',
    incidentLocation: '',
    reportedBy: {
      name: '',
      id: '',
      contact: '',
      address: '',
      relationship: 'complainant'
    },
    assignedOfficer: '',
    assignedDetective: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    
    // Criminal specific
    suspect: {
      fullName: '',
      nationalId: '',
      dateOfBirth: '',
      age: '',
      gender: 'male' as 'male' | 'female' | 'other',
      contact: '',
      address: '',
      status: 'at_large' as 'arrested' | 'at_large' | 'surrendered',
      mugshot: null as File | null,
      isRepeatOffender: false
    },
    arrest: {
      dateTime: '',
      arrestingOfficer: '',
      location: '',
      warrantIssued: false,
      useOfForce: false,
      itemsSeized: ''
    },
    offense: {
      category: '',
      penalCode: '',
      victim: {
        name: '',
        contact: '',
        injuries: ''
      },
      witnesses: '',
      evidenceCollected: '',
      initialCharges: '',
      custodyStatus: 'held_station' as 'held_station' | 'released_bond' | 'escaped'
    },
    
    // Civil specific
    parties: {
      complainant: {
        name: '',
        contact: '',
        address: ''
      },
      opposingParty: {
        name: '',
        contact: '',
        address: ''
      }
    },
    civilDetails: {
      natureOfComplaint: '',
      physicalHarm: false,
      documentsProvided: false,
      witnesses: '',
      requestedAction: 'mediation' as 'mediation' | 'report_only' | 'court_referral'
    }
  });

  // Get available officers and detectives
  const availableOfficers = mockUsers.filter(user => 
    ['officer', 'detective', 'supervisor'].includes(user.role) && user.isActive
  );

  const availableDetectives = mockUsers.filter(user => 
    ['detective', 'supervisor'].includes(user.role) && user.isActive
  );

  const handleInputChange = (field: string, value: any, section?: string) => {
    setFormData(prev => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const generateCaseNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CASE-${year}-${month}-${random}`;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!caseType;
      case 2:
        return !!(formData.title.trim() && formData.assignedOfficer && formData.narrative.trim());
      case 3:
        if (caseType === 'criminal') {
          return !!(formData.suspect.fullName.trim() && formData.offense.category);
        } else {
          return !!(formData.parties.complainant.name.trim() && formData.parties.opposingParty.name.trim());
        }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Validate all steps
      for (let i = 1; i <= 3; i++) {
        if (!validateStep(i)) {
          throw new Error('Please complete all required fields in all steps');
        }
      }

      // Generate case number
      const caseNumber = generateCaseNumber();
      const newCaseId = Date.now().toString();

      // Create case object
      const newCase: Partial<Case> = {
        id: newCaseId,
        caseNumber,
        title: formData.title,
        type: caseType!,
        priority: formData.priority,
        status: 'open',
        assignedOfficer: formData.assignedOfficer,
        assignedDetective: caseType === 'criminal' ? formData.assignedDetective : undefined,
        description: formData.narrative,
        location: {
          address: formData.incidentLocation,
          coordinates: undefined // Would be geocoded in real implementation
        },
        evidence: [],
        suspects: caseType === 'criminal' && formData.suspect.fullName ? ['temp_suspect_id'] : [],
        witnesses: [],
        timeline: [
          {
            id: '1',
            date: new Date().toISOString(),
            type: 'created',
            description: `Case created via intake form by ${formData.reportingOfficer || 'System'}`,
            officer: formData.reportingOfficer || 'System'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Creating case:', newCase);
      console.log('Form data:', formData);

      setSubmitSuccess(true);
      setCreatedCaseId(newCaseId);
      
      // Show success message briefly, then redirect to case details
      setTimeout(() => {
        setShowCaseDetails(true);
      }, 2000);

    } catch (error) {
      console.error('Error creating case:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while creating the case');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setCaseType(null);
    setFormData({
      title: '',
      dateReported: new Date().toISOString().split('T')[0],
      timeReported: new Date().toTimeString().split(' ')[0].slice(0, 5),
      reportingOfficer: '',
      stationCode: '',
      narrative: '',
      incidentLocation: '',
      reportedBy: {
        name: '',
        id: '',
        contact: '',
        address: '',
        relationship: 'complainant'
      },
      assignedOfficer: '',
      assignedDetective: '',
      priority: 'medium',
      suspect: {
        fullName: '',
        nationalId: '',
        dateOfBirth: '',
        age: '',
        gender: 'male',
        contact: '',
        address: '',
        status: 'at_large',
        mugshot: null,
        isRepeatOffender: false
      },
      arrest: {
        dateTime: '',
        arrestingOfficer: '',
        location: '',
        warrantIssued: false,
        useOfForce: false,
        itemsSeized: ''
      },
      offense: {
        category: '',
        penalCode: '',
        victim: {
          name: '',
          contact: '',
          injuries: ''
        },
        witnesses: '',
        evidenceCollected: '',
        initialCharges: '',
        custodyStatus: 'held_station'
      },
      parties: {
        complainant: {
          name: '',
          contact: '',
          address: ''
        },
        opposingParty: {
          name: '',
          contact: '',
          address: ''
        }
      },
      civilDetails: {
        natureOfComplaint: '',
        physicalHarm: false,
        documentsProvided: false,
        witnesses: '',
        requestedAction: 'mediation'
      }
    });
    setSubmitSuccess(false);
    setSubmitError('');
    setCreatedCaseId(null);
    setShowCaseDetails(false);
  };

  // If case was created successfully and user wants to see details
  if (showCaseDetails && createdCaseId) {
    return (
      <CaseDetails 
        caseId={createdCaseId} 
        onBack={() => {
          setShowCaseDetails(false);
          resetForm();
        }} 
      />
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step <= currentStep 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {step < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{step}</span>
              )}
            </div>
            {step < 4 && (
              <div className={`w-12 h-0.5 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Case Type</h2>
        <p className="text-gray-600">Choose the type of case you're creating</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <label className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
          caseType === 'criminal' ? 'border-red-500 bg-red-50 shadow-lg' : 'border-gray-300 hover:bg-gray-50'
        }`}>
          <input
            type="radio"
            name="caseType"
            value="criminal"
            checked={caseType === 'criminal'}
            onChange={(e) => setCaseType(e.target.value as 'criminal' | 'civil')}
            className="sr-only"
          />
          <div className="flex flex-col items-center text-center w-full">
            <AlertTriangle className={`h-12 w-12 mb-4 ${caseType === 'criminal' ? 'text-red-600' : 'text-gray-400'}`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Criminal Case</h3>
            <p className="text-sm text-gray-600">Crimes, arrests, and criminal investigations</p>
            <ul className="text-xs text-gray-500 mt-3 space-y-1">
              <li>• Suspects & Arrests</li>
              <li>• Criminal Charges</li>
              <li>• Evidence Collection</li>
              <li>• Prosecution Forwarding</li>
            </ul>
          </div>
        </label>
        
        <label className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
          caseType === 'civil' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-300 hover:bg-gray-50'
        }`}>
          <input
            type="radio"
            name="caseType"
            value="civil"
            checked={caseType === 'civil'}
            onChange={(e) => setCaseType(e.target.value as 'criminal' | 'civil')}
            className="sr-only"
          />
          <div className="flex flex-col items-center text-center w-full">
            <Gavel className={`h-12 w-12 mb-4 ${caseType === 'civil' ? 'text-blue-600' : 'text-gray-400'}`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Civil Case</h3>
            <p className="text-sm text-gray-600">Disputes, complaints, and civil matters</p>
            <ul className="text-xs text-gray-500 mt-3 space-y-1">
              <li>• Parties Involved</li>
              <li>• Mediation Process</li>
              <li>• Resolution Tracking</li>
              <li>• Documentation</li>
            </ul>
          </div>
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Case Information</h2>
        <p className="text-gray-600">Enter the fundamental details about this {caseType} case</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Title / Summary *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the case"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Reported *
            </label>
            <input
              type="date"
              value={formData.dateReported}
              onChange={(e) => handleInputChange('dateReported', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Reported *
            </label>
            <input
              type="time"
              value={formData.timeReported}
              onChange={(e) => handleInputChange('timeReported', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Officer *
            </label>
            <select
              value={formData.assignedOfficer}
              onChange={(e) => handleInputChange('assignedOfficer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select an officer...</option>
              {availableOfficers.map((officer) => (
                <option key={officer.id} value={officer.fullName}>
                  {officer.fullName} - {officer.badge} ({officer.role.charAt(0).toUpperCase() + officer.role.slice(1)})
                </option>
              ))}
            </select>
          </div>
          
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location of Incident *
            </label>
            <input
              type="text"
              value={formData.incidentLocation}
              onChange={(e) => handleInputChange('incidentLocation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full address or location description"
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Case Description *
          </label>
          <textarea
            rows={4}
            value={formData.narrative}
            onChange={(e) => handleInputChange('narrative', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Detailed description of what happened..."
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {caseType === 'criminal' ? 'Criminal Case Details' : 'Civil Case Details'}
        </h2>
        <p className="text-gray-600">
          {caseType === 'criminal' 
            ? 'Enter suspect and offense information' 
            : 'Enter parties and dispute information'
          }
        </p>
      </div>

      {caseType === 'criminal' ? (
        <div className="space-y-6">
          {/* Suspect Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suspect Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.suspect.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value, 'suspect')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Suspect's full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.suspect.age}
                  onChange={(e) => handleInputChange('age', e.target.value, 'suspect')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.suspect.status}
                  onChange={(e) => handleInputChange('status', e.target.value, 'suspect')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="arrested">Arrested</option>
                  <option value="at_large">At Large</option>
                  <option value="surrendered">Surrendered</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  value={formData.suspect.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value, 'suspect')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone or email"
                />
              </div>
            </div>
          </div>

          {/* Offense Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Offense Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offense Category *</label>
                <select
                  value={formData.offense.category}
                  onChange={(e) => handleInputChange('category', e.target.value, 'offense')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category...</option>
                  <option value="theft">Theft</option>
                  <option value="assault">Assault</option>
                  <option value="robbery">Robbery</option>
                  <option value="burglary">Burglary</option>
                  <option value="fraud">Fraud</option>
                  <option value="drug_offense">Drug Offense</option>
                  <option value="domestic_violence">Domestic Violence</option>
                  <option value="murder">Murder</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Penal Code</label>
                <input
                  type="text"
                  value={formData.offense.penalCode}
                  onChange={(e) => handleInputChange('penalCode', e.target.value, 'offense')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Legal code reference"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Victim Name</label>
                <input
                  type="text"
                  value={formData.offense.victim.name}
                  onChange={(e) => handleNestedInputChange('offense', 'victim', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Victim's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Charges</label>
                <input
                  type="text"
                  value={formData.offense.initialCharges}
                  onChange={(e) => handleInputChange('initialCharges', e.target.value, 'offense')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Charges filed"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Civil Parties */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Parties Involved</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Complainant Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.parties.complainant.name}
                      onChange={(e) => handleNestedInputChange('parties', 'complainant', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Complainant name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                    <input
                      type="text"
                      value={formData.parties.complainant.contact}
                      onChange={(e) => handleNestedInputChange('parties', 'complainant', 'contact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Phone or email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.parties.complainant.address}
                      onChange={(e) => handleNestedInputChange('parties', 'complainant', 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Address"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Opposing Party Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.parties.opposingParty.name}
                      onChange={(e) => handleNestedInputChange('parties', 'opposingParty', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Opposing party name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                    <input
                      type="text"
                      value={formData.parties.opposingParty.contact}
                      onChange={(e) => handleNestedInputChange('parties', 'opposingParty', 'contact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Phone or email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.parties.opposingParty.address}
                      onChange={(e) => handleNestedInputChange('parties', 'opposingParty', 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Address"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Civil Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispute Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nature of Complaint</label>
                <select
                  value={formData.civilDetails.natureOfComplaint}
                  onChange={(e) => handleInputChange('natureOfComplaint', e.target.value, 'civilDetails')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select complaint type...</option>
                  <option value="land_dispute">Land Dispute</option>
                  <option value="debt">Debt</option>
                  <option value="family_dispute">Family Dispute</option>
                  <option value="contract_dispute">Contract Dispute</option>
                  <option value="neighbor_dispute">Neighbor Dispute</option>
                  <option value="property_damage">Property Damage</option>
                  <option value="harassment">Harassment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requested Action</label>
                <select
                  value={formData.civilDetails.requestedAction}
                  onChange={(e) => handleInputChange('requestedAction', e.target.value, 'civilDetails')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mediation">Mediation</option>
                  <option value="report_only">Report Only</option>
                  <option value="court_referral">Court Referral</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review all information before creating the case</p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-green-800">Case Created Successfully!</h3>
              <p className="text-green-700 mt-1">
                The case has been created and will open in the detailed view shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Creating Case</h3>
              <p className="text-red-700 mt-1">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {!submitSuccess && !submitError && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Type:</span> {caseType}</p>
                <p><span className="font-medium">Title:</span> {formData.title}</p>
                <p><span className="font-medium">Priority:</span> {formData.priority}</p>
                <p><span className="font-medium">Officer:</span> {formData.assignedOfficer}</p>
                <p><span className="font-medium">Location:</span> {formData.incidentLocation}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {caseType === 'criminal' ? 'Criminal Details' : 'Civil Details'}
              </h4>
              <div className="space-y-1 text-sm">
                {caseType === 'criminal' ? (
                  <>
                    <p><span className="font-medium">Suspect:</span> {formData.suspect.fullName || 'Not specified'}</p>
                    <p><span className="font-medium">Offense:</span> {formData.offense.category || 'Not specified'}</p>
                    <p><span className="font-medium">Victim:</span> {formData.offense.victim.name || 'Not specified'}</p>
                  </>
                ) : (
                  <>
                    <p><span className="font-medium">Complainant:</span> {formData.parties.complainant.name || 'Not specified'}</p>
                    <p><span className="font-medium">Respondent:</span> {formData.parties.opposingParty.name || 'Not specified'}</p>
                    <p><span className="font-medium">Nature:</span> {formData.civilDetails.natureOfComplaint || 'Not specified'}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{formData.narrative}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Case Intake Form</h2>
          <p className="text-gray-600 mt-1">Create new case records with detailed intake information</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Form</span>
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between max-w-4xl mx-auto">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={!validateStep(currentStep)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              !validateStep(currentStep)
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || submitSuccess}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isSubmitting || submitSuccess
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                <span>Creating Case...</span>
              </>
            ) : submitSuccess ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Case Created</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Create Case</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CaseIntake;