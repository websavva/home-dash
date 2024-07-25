export const isFormValid = <Form extends Record<string, string>>(form: Form) =>
  Object.values(form).every(Boolean);
