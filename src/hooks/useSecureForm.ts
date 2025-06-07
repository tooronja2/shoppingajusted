
import { useState } from 'react';
import { sanitizeInput, validateEmail, validatePhone } from '../utils/security';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

export const useSecureForm = <T extends Record<string, string>>(
  initialData: T,
  validationRules: ValidationRules = {}
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = (field: string, value: string): string | undefined => {
    const rule = validationRules[field];
    if (!rule) return undefined;

    if (rule.required && !value.trim()) {
      return `${field} es requerido`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${field} debe tener al menos ${rule.minLength} caracteres`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `${field} no puede tener más de ${rule.maxLength} caracteres`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return `${field} tiene un formato inválido`;
    }

    if (rule.custom && !rule.custom(value)) {
      return `${field} no es válido`;
    }

    return undefined;
  };

  const updateField = (field: keyof T, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    const error = validateField(field as string, sanitizedValue);
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    setErrors(prev => ({ ...prev, [field]: error as any }));
    
    // Check overall form validity
    const allErrors = { ...errors, [field]: error };
    const hasErrors = Object.values(allErrors).some(err => err);
    setIsValid(!hasErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<T> = {};
    let valid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error as any;
        valid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(valid);
    return valid;
  };

  return {
    formData,
    errors,
    isValid,
    updateField,
    validateForm
  };
};
