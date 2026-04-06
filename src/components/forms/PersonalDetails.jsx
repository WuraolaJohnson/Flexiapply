import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-number-input';
import Input from '../ui/Input';
import Button from '../ui/Button';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  phone: yup.string().required('Phone number is required'),
  dob: yup.string().required('Date of birth is required'),
});

export default function PersonalDetails({ defaultValues, onNext }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Email Address" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Choose a Password" type="password" {...register('password')} error={errors.password?.message} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <div className="w-full flex flex-col gap-1.5 focus-within:z-10">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
              <PhoneInput
                placeholder="Enter phone number"
                value={field.value}
                onChange={field.onChange}
                className={errors.phone ? '!border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
          )}
        />

        <Controller
          control={control}
          name="dob"
          render={({ field }) => (
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date of Birth</label>
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                placeholderText="Select your birth date"
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                className={errors.dob ? '!border-red-500' : ''}
              />
              {errors.dob && <p className="text-sm text-red-500 mt-1">{errors.dob.message}</p>}
            </div>
          )}
        />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
}
