import { useReducer, useState } from 'react';

export default function useForm(initialState, validator = () => {}) {
  const [errors, setErrors] = useState(validator(initialState));
  const [form, updateForm] = useReducer((prevState, updates) => {
    const newForm = { ...prevState, ...updates };
    if (validator) {
      setErrors(validator(newForm));
    }
    return newForm;
  }, initialState);

  return { form, updateForm, errors };
}
