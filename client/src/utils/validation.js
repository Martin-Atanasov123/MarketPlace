/**
 * Validation utilities
 */

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {string[]} Array of error messages (empty if valid)
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  if (password && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (password && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (password && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return errors;
};

/**
 * Validates listing form data
 * @param {object} formData - Form data to validate
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validateListingForm = (formData) => {
  const errors = [];

  // Validate formData exists
  if (!formData || typeof formData !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid form data'],
    };
  }

  // Validate title
  if (!formData.title || typeof formData.title !== 'string' || !formData.title.trim()) {
    errors.push('Title is required');
  } else if (formData.title.trim().length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  // Validate description
  if (!formData.description || typeof formData.description !== 'string' || !formData.description.trim()) {
    errors.push('Description is required');
  } else if (formData.description.trim().length > 5000) {
    errors.push('Description must be less than 5000 characters');
  }

  // Validate price
  if (formData.price === undefined || formData.price === null || formData.price === '') {
    errors.push('Price is required');
  } else {
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue)) {
      errors.push('Price must be a valid number');
    } else if (priceValue < 0) {
      errors.push('Price cannot be negative');
    } else if (priceValue > 1000000000) {
      errors.push('Price is too large');
    }
  }

  // Validate category
  if (!formData.category || typeof formData.category !== 'string') {
    errors.push('Category is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

