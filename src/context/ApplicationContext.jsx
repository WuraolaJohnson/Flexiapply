import { createContext, useContext, useState } from 'react';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      password: ''
    },
    academic: {
      previousSchool: '',
      graduationYear: '',
      gpa: ''
    },
    guardian: {
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      relation: ''
    }
  });

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const resetFormData = () => {
    setFormData({
      personal: { firstName: '', lastName: '', email: '', phone: '', dob: '', password: '' },
      academic: { previousSchool: '', graduationYear: '', gpa: '' },
      guardian: { guardianName: '', guardianPhone: '', guardianEmail: '', relation: '' }
    });
  };

  return (
    <ApplicationContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error("useApplication must be used within ApplicationProvider");
  return context;
};
