import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../ui/Input';
import Button from '../ui/Button';

const schema = yup.object().shape({
  hasNoPreviousSchool: yup.boolean().default(false),
  previousSchool: yup.string().when('hasNoPreviousSchool', {
    is: false,
    then: (s) => s.required('Previous school is required'),
    otherwise: (s) => s.nullable().notRequired()
  }),
  graduationYear: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .when('hasNoPreviousSchool', {
      is: false,
      then: (s) => s.required('Graduation year is required')
        .min(1900, 'Invalid year')
        .max(new Date().getFullYear(), 'Cannot be in the future'),
      otherwise: (s) => s.nullable().notRequired()
    }),
  gpa: yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .when('hasNoPreviousSchool', {
      is: false,
      then: (s) => s.required('GPA is required')
        .min(0, 'Minimum 0')
        .max(5, 'Maximum 5.0'),
      otherwise: (s) => s.nullable().notRequired()
    }),
});

export default function AcademicInfo({ defaultValues, onNext, onBack }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { hasNoPreviousSchool: false, ...defaultValues }
  });

  const hasNoPreviousSchool = useWatch({
    control,
    name: "hasNoPreviousSchool"
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      
      <div className="flex items-center gap-2 mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
        <input 
          type="checkbox" 
          id="hasNoPreviousSchool"
          {...register('hasNoPreviousSchool')}
          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-900 cursor-pointer" 
        />
        <label htmlFor="hasNoPreviousSchool" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          I have not attended any previous school
        </label>
      </div>

      {!hasNoPreviousSchool && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <Input label="Previous School Attended" {...register('previousSchool')} error={errors.previousSchool?.message} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Graduation Year" type="number" {...register('graduationYear')} error={errors.graduationYear?.message} />
            <Input label="Cumulative GPA (out of 5.0)" type="number" step="0.01" {...register('gpa')} error={errors.gpa?.message} />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
}
