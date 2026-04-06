import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

export default function ReviewSubmit({ formData, onBack, onSubmit, isSubmitting, selectedProgram, selectedInstitution }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Review Your Application</h3>
      
      <div className="space-y-4">
        {/* Programme Selection Summary */}
        {selectedProgram && (
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-primary mb-2">Programme Applied For</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-slate-500">Institution:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedInstitution?.name || '—'}</span>
                <span className="text-slate-500">Course:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedProgram.name}</span>
                <span className="text-slate-500">Duration:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedProgram.duration}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold text-primary mb-2">Personal Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-500">Name:</span> <span className="text-slate-800 dark:text-slate-200">{formData.personal.firstName} {formData.personal.lastName}</span>
              <span className="text-slate-500">Email:</span> <span className="text-slate-800 dark:text-slate-200">{formData.personal.email}</span>
              <span className="text-slate-500">Phone:</span> <span className="text-slate-800 dark:text-slate-200">{formData.personal.phone}</span>
              <span className="text-slate-500">DOB:</span> <span className="text-slate-800 dark:text-slate-200">{formData.personal.dob}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold text-primary mb-2">Academic Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-500">Previous School:</span> <span className="text-slate-800 dark:text-slate-200">{formData.academic.previousSchool}</span>
              <span className="text-slate-500">Graduation Year:</span> <span className="text-slate-800 dark:text-slate-200">{formData.academic.graduationYear}</span>
              <span className="text-slate-500">GPA:</span> <span className="text-slate-800 dark:text-slate-200">{formData.academic.gpa}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold text-primary mb-2">Guardian Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-500">Name:</span> <span className="text-slate-800 dark:text-slate-200">{formData.guardian.guardianName}</span>
              <span className="text-slate-500">Email:</span> <span className="text-slate-800 dark:text-slate-200">{formData.guardian.guardianEmail}</span>
              <span className="text-slate-500">Phone:</span> <span className="text-slate-800 dark:text-slate-200">{formData.guardian.guardianPhone}</span>
              <span className="text-slate-500">Relation:</span> <span className="text-slate-800 dark:text-slate-200">{formData.guardian.relation}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>Back to Details</Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Final Application'}
        </Button>
      </div>
    </div>
  );
}

