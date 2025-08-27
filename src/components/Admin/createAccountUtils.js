// Validation and backend error mapping utilities for CreateAccountModal

export const serviceIdPattern = /^AFP-\d{4}-\d{3}$/;

export function validateCreateAccountForm(formData) {
  const errors = {};

  if (!formData.firstName?.trim()) {
    errors.firstName = "First Name is required";
  }
  if (!formData.lastName?.trim()) {
    errors.lastName = "Last Name is required";
  }
  if (!formData.serviceId?.trim()) {
    errors.serviceId = "Service ID is required";
  } else if (!serviceIdPattern.test(formData.serviceId)) {
    errors.serviceId = "Service ID must be in format AFP-YYYY-XXX";
  }
  if (!formData.email?.trim()) {
    errors.email = "Email is required";
  }
  if (!formData.branchOfService) {
    errors.branchOfService = "Branch of Service is required";
  }
  if (!formData.division) {
    errors.division = "Division is required";
  }
  if (!formData.unit) {
    errors.unit = "Unit is required";
  }
  if (!formData.address?.trim()) {
    errors.address = "Address is required";
  }
  if (!formData.contactNumber?.trim()) {
    errors.contactNumber = "Contact Number is required";
  } else if (!/^9\d{9}$/.test(formData.contactNumber)) {
    errors.contactNumber =
      "Contact Number must be 10 digits starting with 9 (e.g., 9344324323)";
  }
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = "Date of Birth is required";
  } else {
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (age < 18 || (age === 18 && monthDiff < 0)) {
      errors.dateOfBirth = "Age must be at least 18 years old";
    }
  }
  if (!formData.role) {
    errors.role = "Role is required";
  }

  return errors;
}

export function mapBackendErrorsToFields(error) {
  const fieldErrors = {};
  const msg = error?.data?.message;
  const list = error?.data?.errors;

  const apply = (text) => {
    if (!text) return;
    if (text.includes("Service ID")) fieldErrors.serviceId = text;
    else if (text.includes("Email")) fieldErrors.email = text;
    else if (text.includes("Age")) fieldErrors.dateOfBirth = text;
    else if (text.includes("Role")) fieldErrors.role = text;
    else if (text.includes("First Name")) fieldErrors.firstName = text;
    else if (text.includes("Last Name")) fieldErrors.lastName = text;
    else if (text.includes("Unit")) fieldErrors.unit = text;
    else if (text.includes("Branch")) fieldErrors.branchOfService = text;
    else if (text.includes("Division")) fieldErrors.division = text;
    else if (text.includes("Address")) fieldErrors.address = text;
    else if (text.includes("Contact")) fieldErrors.contactNumber = text;
  };

  if (msg) apply(msg);
  if (Array.isArray(list)) list.forEach(apply);

  return fieldErrors;
}

export function deriveServiceCodeFromBranch(branchLabel) {
  const v = (branchLabel || "").toLowerCase();
  if (v.includes("navy")) return "NAVY";
  if (v.includes("air")) return "AIRFORCE";
  if (v.includes("army")) return "ARMY";
  return "";
}
