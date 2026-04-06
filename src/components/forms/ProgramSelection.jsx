import { useState, useEffect } from 'react';
import mockApi from '../../api/mockApi';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function ProgramSelection({ defaultSelection, onNext }) {
  const [institutions, setInstitutions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(defaultSelection?.institutionId || '');
  const [selectedProgramId, setSelectedProgramId] = useState(defaultSelection?.programId || '');
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [instRes, progRes] = await Promise.all([
          mockApi.get('/institutions'),
          mockApi.get('/programs'),
        ]);
        setInstitutions(instRes.data || []);
        setPrograms(progRes.data || []);
      } catch (e) {
        console.error('Failed to load institutions/programs', e);
      } finally {
        setLoadingInstitutions(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedInstitutionId) {
      const filtered = programs.filter(p => p.institutionId === selectedInstitutionId);
      setFilteredPrograms(filtered);
      // Reset program selection if institution changes
      if (!filtered.find(p => p.id === selectedProgramId)) {
        setSelectedProgramId('');
      }
    } else {
      setFilteredPrograms([]);
      setSelectedProgramId('');
    }
  }, [selectedInstitutionId, programs]);

  const handleContinue = () => {
    if (!selectedInstitutionId || !selectedProgramId) {
      setError('Please select both an institution and a program before continuing.');
      return;
    }
    setError('');
    const institution = institutions.find(i => i.id === selectedInstitutionId);
    const program = programs.find(p => p.id === selectedProgramId);
    onNext({ institution, program });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          Choose Your Program
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select the institution and course you're applying for.
        </p>
      </div>

      {loadingInstitutions ? (
        <div className="flex items-center gap-3 py-8 justify-center text-slate-500">
          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="text-sm font-medium">Loading available programs...</span>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Institution Dropdown */}
          <div className="space-y-1">
            <Select
              label="Institution"
              placeholder="— Select an institution —"
              value={selectedInstitutionId}
              onChange={e => setSelectedInstitutionId(e.target.value)}
            >
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}
                  className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
                  {inst.name}
                </option>
              ))}
            </Select>
            {selectedInstitutionId && (
              <p className="text-xs text-slate-400 pl-1">
                {institutions.find(i => i.id === selectedInstitutionId)?.location}
              </p>
            )}
          </div>

          {/* Course Dropdown — cascading */}
          <div className="space-y-1">
            <Select
              label="Course / Program"
              placeholder={selectedInstitutionId ? '— Select a program —' : '— Select an institution first —'}
              value={selectedProgramId}
              onChange={e => setSelectedProgramId(e.target.value)}
              disabled={!selectedInstitutionId || filteredPrograms.length === 0}
            >
              {filteredPrograms.map(prog => (
                <option key={prog.id} value={prog.id}
                  className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
                  {prog.name}
                </option>
              ))}
            </Select>
            {selectedProgramId && (() => {
              const prog = programs.find(p => p.id === selectedProgramId);
              return prog ? (
                <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{prog.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fee</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{prog.fee}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200 dark:border-slate-700 text-slate-500 text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Requirements: </span>
                    {prog.requirements}
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          {error && (
            <div className="text-sm text-red-500 font-medium bg-red-50 dark:bg-red-900/20 p-3 border border-red-100 dark:border-red-900/30 rounded-lg">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" onClick={handleContinue} disabled={loadingInstitutions}>
          Continue to Personal Details →
        </Button>
      </div>
    </div>
  );
}
