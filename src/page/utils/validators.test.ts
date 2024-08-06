import { describe, it, expect } from 'vitest';

import { isFormValid } from './validators';

describe('isFormValid', () => {
  it('should return true for a valid form with all fields filled', () => {
    const form = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    expect(isFormValid(form)).toBe(true);
  });

  it('should return false for a form with at least one empty field', () => {
    const formWithEmptyField = {
      name: 'John Doe',
      email: '',
      password: 'password123',
    };

    expect(isFormValid(formWithEmptyField)).toBe(false);
  });

  it('should return false for an empty form', () => {
    const emptyForm = {};

    expect(isFormValid(emptyForm)).toBe(false);
  });

  it('should return false for a form with null values', () => {
    const formWithNullValue = {
      name: 'John Doe',
      email: null as unknown as string,
      password: 'password123',
    };

    expect(isFormValid(formWithNullValue)).toBe(false);
  });

  it('should return false for a form with undefined values', () => {
    const formWithUndefinedValue = {
      name: 'John Doe',
      email: undefined as unknown as string,
      password: 'password123',
    };

    expect(isFormValid(formWithUndefinedValue)).toBe(false);
  });
});
