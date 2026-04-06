import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import mockApi from '../api/mockApi';
import { initialData } from '../api/initialData';

export default function LandingPage() {
  const [institutions, setInstitutions] = useState(initialData.institutions || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['All', 'University', 'Polytechnic', 'Private University'];

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await mockApi.get('/institutions');
        if (response.data && response.data.length > 0) {
          setInstitutions(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch institutions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitutions();
  }, []);

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         inst.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || inst.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 text-white">
        {/* Abstract Background patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find your path to <span className="text-primary-light">success</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Discover and apply to top institutions and programs across the country. Your future starts here.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text"
                  placeholder="Search for institution or program..."
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-slate-400 text-lg transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="w-full md:w-auto md:px-12 py-5 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform">
                Search Institutions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Section */}
      <section className="px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Institutions</h2>
            <p className="text-slate-500 dark:text-slate-400">Find the right organization for your academic journey</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat 
                  ? 'bg-primary text-slate-900 shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInstitutions.length > 0 ? (
              filteredInstitutions.map(inst => (
                <Card 
                  key={inst.id} 
                  className="group hover:border-primary/50 hover:shadow-2xl transition-all duration-500 rounded-[2rem] border-none bg-white dark:bg-slate-900 cursor-pointer h-full flex flex-col shadow-lg shadow-slate-200/50 dark:shadow-none"
                  onClick={() => navigate(`/institution/${inst.id}`)}
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="h-40 bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-8 rounded-t-[2rem] border-2 border-primary/20 dark:border-primary/10 group-hover:border-primary transition-all duration-500 relative overflow-hidden">
                      <img 
                        src={inst.logo} 
                        alt={inst.name} 
                        className="max-h-24 max-w-24 object-contain rounded-2xl drop-shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${inst.shortName}&background=random&size=128`;
                        }}
                      />
                      {/* Subtler decorative accent */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/[0.05]" />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary px-2 py-1 bg-primary/10 rounded">
                          {inst.category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {inst.location}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {inst.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                        {inst.description}
                      </p>
                      <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                          View Programs
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-slate-900 transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No institutions found</h3>
                <p className="text-slate-500">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-8 md:p-12 text-center border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-200 uppercase tracking-widest text-sm opacity-50">
          Trusted by top academic institutions
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-black">UNIVERSITY PLAZA</span>
          <span className="text-2xl font-black">ACADEMIA</span>
          <span className="text-2xl font-black">EDUCATE</span>
          <span className="text-2xl font-black">SCHOLR</span>
        </div>
      </section>
    </div>
  );
}
