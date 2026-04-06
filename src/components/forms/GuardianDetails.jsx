import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PhoneInput from 'react-phone-number-input';
import Input from '../ui/Input';
import Button from '../ui/Button';

const schema = yup.object().shape({
  guardianName: yup.string().required('Guardian name is required'),
  guardianPhone: yup.string().required('Guardian phone is required'),
  guardianEmail: yup.string().email('Invalid email').required('Guardian email is required'),
  relation: yup.string().required('Relation to applicant is required'),
});

export default function GuardianDetails({ defaultValues, onNext, onBack }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <Input label="Full Name" {...register('guardianName')} error={errors.guardianName?.message} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Email Address" type="email" {...register('guardianEmail')} error={errors.guardianEmail?.message} />
        
        <Controller
          control={control}
          name="guardianPhone"
          render={({ field }) => (
            <div className="w-full flex flex-col gap-1.5 focus-within:z-10">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
              <PhoneInput
                placeholder="Enter phone number"
                value={field.value}
                onChange={field.onChange}
                className={errors.guardianPhone ? '!border-red-500' : ''}
              />
              {errors.guardianPhone && <p className="text-sm text-red-500 mt-1">{errors.guardianPhone.message}</p>}
            </div>
          )}
        />
      </div>
      <Input label="Relation to Applicant" placeholder="e.g., Father, Mother, Uncle" {...register('relation')} error={errors.relation?.message} />
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Review Application</Button>
      </div>
    </form>
  );
}
