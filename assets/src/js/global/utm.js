import $ from 'jquery';

// List of UTM parameters we want to track
const utmParams = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_keyword',
  'gad_source',
  'gclid'
];

// Function to capture UTM parameters and save to localStorage
const trackUTMParameters = () => {
  const urlParams = new URLSearchParams(window.location.search);

  // Object to store our UTM data, initialize all params with empty string
  const utmData = Object.fromEntries(utmParams.map(param => [param, '']));

  // Update with any parameters that exist in URL
  utmParams.forEach(param => {
    const value = urlParams.get(param);
    if (value && !value.startsWith('http')) {
      utmData[param] = value;
    }
  });

  // Save UTM data if we have any non-empty values
  if (Object.values(utmData).some(value => value !== '')) {
    localStorage.setItem('utm_data', JSON.stringify(utmData));
  }
  return utmData;
};

// Function to populate UTM fields
const populateUTMFields = () => {
  const utmData = JSON.parse(localStorage.getItem('utm_data') || '{}');
  const formContainers = document.querySelectorAll('.nf-form-cont');

  let totalFieldsFound = 0;

  formContainers.forEach((formContainer) => {
    const hiddenFields = Array.from(formContainer.querySelectorAll('input[type="hidden"]'));
    totalFieldsFound += hiddenFields.length;

    // If we found fields, populate them
    if (hiddenFields.length >= 6) {
      const utmFields = hiddenFields.slice(0, 6);

      utmParams.forEach((param, index) => {
        const field = utmFields[index];
        if (field) {
          const value = utmData[param] || ''; // Use empty string as default
          field.value = value;
          // Trigger change event to ensure form picks up the value
          field.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
  });

  return totalFieldsFound;
};

// Initialize tracking
document.addEventListener('DOMContentLoaded', () => {
  trackUTMParameters();
});

// Keep track of attempts to find and populate fields
let attempts = 0;
const maxAttempts = 50; // 5 seconds maximum (50 * 100ms)

// Check for forms and fields
const formCheck = setInterval(() => {
  attempts++;
  const totalFields = populateUTMFields();

  // If we found enough fields in both forms OR we've exceeded max attempts
  if (totalFields >= 12 || attempts >= maxAttempts) {
    clearInterval(formCheck);
  }
}, 100);