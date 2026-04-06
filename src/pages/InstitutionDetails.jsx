import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import mockApi from '../api/mockApi';
import { initialData } from '../api/initialData';

export default function InstitutionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [instRes, progRes] = await Promise.all([
          mockApi.get(`/institutions/${id}`),
          mockApi.get(`/programs?institutionId=${id}`)
        ]);
        
        // Use API data if available, otherwise fallback to static bundle
        setInstitution(instRes.data || initialData.institutions.find(inst => inst.id === id));
        setPrograms((progRes.data && progRes.data.length > 0) 
          ? progRes.data 
          : initialData.programs.filter(prog => prog.institutionId === id));
          
      } catch (error) {
        console.error("Failed to fetch institution details", error);
        // Fallback to static bundle if API fails
        setInstitution(initialData.institutions.find(inst => inst.id === id));
        setPrograms(initialData.programs.filter(prog => prog.institutionId === id));
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-96 rounded-3xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Institution not found</h2>
        <Button onClick={() => navigate('/')} className="mt-4">Go Back Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Institution Header */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent relative p-8">
          <div className="absolute -bottom-12 left-8 w-40 h-40 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-3xl shadow-2xl border-2 border-primary/30 dark:border-primary/20 relative z-10 transition-transform duration-500 hover:scale-105">
            <img 
              src={institution.logo} 
              alt={institution.name} 
              className="max-h-24 max-w-24 object-contain rounded-2xl drop-shadow-2xl"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${institution.shortName}&background=random&size=128`;
              }}
            />
          </div>
        </div>
        
        <div className="pt-16 pb-10 px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">
                  {institution.category}
                </span>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {institution.location}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                {institution.name}
              </h1>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.open(institution.website, '_blank')}>
                Visit Website
              </Button>
              <Button onClick={() => document.getElementById('programs-list')?.scrollIntoView({ behavior: 'smooth' })}>
                View Programs
              </Button>
            </div>
          </div>
          
          <div className="mt-8 prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
            <p>{institution.description}</p>
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section id="programs-list" className="mt-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Available Programs</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {programs.length > 0 ? (
            programs.map(prog => (
              <Card key={prog.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary">
                        {prog.name}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {prog.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {prog.fee}
                        </span>
                      </div>
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Requirements</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{prog.requirements}</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full md:w-auto px-10 py-4 font-bold shadow-lg shadow-primary/10"
                      onClick={() => navigate(`/apply?programId=${prog.id}&institutionId=${institution.id}`)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500">No programs currently listed for this institution.</p>
            </div>
          )}
        </div>
      </section>

      {/* Side Info / FAQ / CTA */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Admission Process
          </h3>
          <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-slate-900 flex items-center justify-center font-bold text-xs">1</span>
              Browse and select a program that fits your career goals.
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-slate-900 flex items-center justify-center font-bold text-xs">2</span>
              Fill in your personal, academic, and guardian details.
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-slate-900 flex items-center justify-center font-bold text-xs">3</span>
              Submit your application and track the status in your dashboard.
            </li>
          </ul>
        </div>
        
        <div className="bg-slate-900 dark:bg-black p-8 rounded-3xl text-white">
          <h3 className="text-lg font-bold mb-4">Need Assistance?</h3>
          <p className="text-slate-400 text-sm mb-6">Our admissions support team is here to help you with any questions during your application process.</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@admissionsportal.com
            </div>
            <div className="flex items-center gap-3 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +234 800 ADMISSIONS
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
