import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Stepper from '../components/ui/Stepper';
import PersonalDetails from '../components/forms/PersonalDetails';
import AcademicInfo from '../components/forms/AcademicInfo';
import GuardianDetails from '../components/forms/GuardianDetails';
import ReviewSubmit from '../components/forms/ReviewSubmit';
import { useApplication } from '../context/ApplicationContext';
import mockApi from '../api/mockApi';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { calculateAdmissionScore } from '../utils/scoreCalculator';

const STEPS = [
  { title: 'Personal Details' },
  { title: 'Academic Info' },
  { title: 'Guardian Details' },
  { title: 'Review & Submit' }
];

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const { formData, updateFormData, resetFormData } = useApplication();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const programId = params.get('programId');
    const institutionId = params.get('institutionId');

    if (programId && institutionId) {
      const fetchProgramDetails = async () => {
        try {
          const [progRes, instRes] = await Promise.all([
            mockApi.get(`/programs/${programId}`),
            mockApi.get(`/institutions/${institutionId}`)
          ]);
          setSelectedProgram(progRes.data);
          setSelectedInstitution(instRes.data);
        } catch (error) {
          console.error("Failed to fetch pre-fill details", error);
        }
      };
      fetchProgramDetails();
    }
  }, [location.search]);

  const handleNext = (step, data) => {
    updateFormData(step, data);
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const { score, likelihood } = calculateAdmissionScore(
        Number(formData.academic.gpa),
        Number(formData.academic.graduationYear)
      );

      let currentUserId = user ? user.email : formData.personal.email;

      // Auto-register and log the user in if they are guests
      if (!user) {
        try {
          const existingUser = await mockApi.get(`/users?email=${encodeURIComponent(formData.personal.email)}`);
          
          if (!existingUser.data || existingUser.data.length === 0) {
            await mockApi.post('/users', {
              email: formData.personal.email,
              password: formData.personal.password,
              role: 'APPLICANT',
              name: `${formData.personal.firstName} ${formData.personal.lastName}`
            });
          }
          await login(formData.personal.email, formData.personal.password);
        } catch (authErr) {
          console.error("Failed to auto-register/login:", authErr);
        }
      }

      const payload = {
        ...formData,
        programId: selectedProgram?.id,
        programName: selectedProgram?.name,
        institutionName: selectedInstitution?.name,
        userId: currentUserId,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        admissionScore: score,
        acceptanceLikelihood: likelihood
      };
      await mockApi.post('/applications', payload);
      resetFormData();
      navigate('/dashboard/applicant', { state: { success: true } });
    } catch (error) {
      console.error("Failed to submit", error);
      alert("Failed to connect to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      {selectedProgram && (
        <div className="mb-8 p-6 bg-slate-900 text-white rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-primary-light text-xs font-bold uppercase tracking-widest mb-1">Applying for</p>
          <h2 className="text-2xl font-bold">{selectedProgram.name}</h2>
          <p className="text-slate-400 text-sm">{selectedInstitution?.name}</p>
        </div>
      )}

      <Stepper steps={STEPS} currentStep={currentStep} />
      
      <Card className="mt-8">
        <CardContent className="pt-8">
          {currentStep === 0 && (
            <PersonalDetails 
              defaultValues={formData.personal} 
              onNext={(data) => handleNext('personal', data)} 
            />
          )}
          {currentStep === 1 && (
            <AcademicInfo 
              defaultValues={formData.academic} 
              onNext={(data) => handleNext('academic', data)}
              onBack={handleBack}
            />
          )}
          {currentStep === 2 && (
            <GuardianDetails 
              defaultValues={formData.guardian} 
              onNext={(data) => handleNext('guardian', data)}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <ReviewSubmit 
              formData={formData} 
              onBack={handleBack} 
              onSubmit={handleSubmitApplication}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

