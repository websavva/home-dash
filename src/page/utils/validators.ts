export const isFormValid = <Form extends Record<string, string>>(
  form: Form,
) => {
  const formValues = Object.values(form);

  return formValues.length > 0 && formValues.every(Boolean);
};
