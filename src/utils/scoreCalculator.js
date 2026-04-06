/**
 * Calculates an admission score and a likelihood categorical value
 * based on rule-based logic evaluated against application data.
 * @param {number} gpa - GPA out of 5.0
 * @param {number} graduationYear - The year the applicant graduated
 * @returns {{ score: number, likelihood: 'High' | 'Medium' | 'Low' }}
 */
export function calculateAdmissionScore(gpa, graduationYear) {
  if (gpa === undefined || isNaN(gpa) || graduationYear === undefined || isNaN(graduationYear)) {
    return {
      score: 40,
      likelihood: 'Low'
    };
  }

  // Convert GPA out of 5.0 to a percentage score
  let score = (gpa / 5.0) * 100;
  
  // Apply a small penalty if the graduation year is older than 5 years
  const currentYear = new Date().getFullYear();
  const yearsSinceGrad = currentYear - graduationYear;
  if (yearsSinceGrad > 5) {
    score -= (yearsSinceGrad * 1.5); // 1.5% penalty per year over 5
  }
  
  // Ensure the score remains within realistic bounds
  score = Math.max(0, Math.min(100, score));
  
  // Determine likelihood
  let likelihood = 'Low';
  if (score >= 80) likelihood = 'High';
  else if (score >= 60) likelihood = 'Medium';
  
  return {
    score: Math.round(score),
    likelihood
  };
}
