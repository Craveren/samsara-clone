/**
 * Enhanced validation utilities
 */

import * as yup from 'yup';

/**
 * Email validation schema
 */
export const emailSchema = yup
  .string()
  .email('Please enter a valid email address')
  .required('Email is required');

/**
 * Password validation schema with strength requirements
 */
export const passwordSchema = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )
  .required('Password is required');

/**
 * PIN validation schema
 */
export const pinSchema = yup
  .string()
  .length(4, 'PIN must be exactly 4 digits')
  .matches(/^\d+$/, 'PIN must contain only numbers')
  .required('PIN is required');

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  const reg = /[&<>"'/]/gi;
  return input.replace(reg, (match) => map[match]);
}

/**
 * Sanitize HTML content
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate and sanitize email
 */
export function validateAndSanitizeEmail(email) {
  try {
    const validated = emailSchema.validateSync(email);
    return sanitizeInput(validated);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Validate file upload
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = [],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      throw new Error(`File extension .${extension} is not allowed`);
    }
  }

  return true;
}

/**
 * Validate URL
 */
export function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate phone number (basic)
 */
export function validatePhoneNumber(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

