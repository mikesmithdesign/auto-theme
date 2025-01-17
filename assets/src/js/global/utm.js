import $ from 'jquery';

// Function to capture UTM parameters and save to localStorage
const trackUTMParameters = () => {
  console.group('Tracking UTM Parameters');
  const urlParams = new URLSearchParams(window.location.search);

  // List of UTM parameters we want to track
  const utmParams = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_keyword',
    'gad_source',
    'gclid'
  ];

  // Object to store our UTM data
  const utmData = {};

  // Get each UTM parameter if it exists
  utmParams.forEach(param => {
    const value = urlParams.get(param);
    if (value && !value.startsWith('http')) {
      utmData[param] = value;
    }
  });

  // If we found any UTM parameters, save them
  if (Object.keys(utmData).length > 0) {
    localStorage.setItem('utm_data', JSON.stringify(utmData));
    console.log('UTM Parameters saved:', utmData);
  }
  console.groupEnd();
  return utmData;
};

// Function to populate UTM fields
const populateUTMFields = () => {
  const utmData = JSON.parse(localStorage.getItem('utm_data') || '{}');

  const formContainers = document.querySelectorAll('.nf-form-cont');
  console.log(`Found ${formContainers.length} form containers`);

  let totalFieldsFound = 0;

  formContainers.forEach((formContainer, formIndex) => {
    console.group(`Processing form ${formIndex + 1}`);

    const hiddenFields = Array.from(formContainer.querySelectorAll('input[type="hidden"]'));
    console.log(`Found ${hiddenFields.length} hidden fields`);

    totalFieldsFound += hiddenFields.length;

    // If we found fields, populate them
    if (hiddenFields.length >= 6) {
      const utmFields = hiddenFields.slice(0, 6);
      const utmParams = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_keyword',
        'gad_source',
        'gclid'
      ];

      utmParams.forEach((param, index) => {
        if (utmFields[index] && utmData[param]) {
          utmFields[index].value = utmData[param];
          console.log(`Set ${param} = ${utmData[param]}`);
        }
      });
    }

    console.groupEnd();
  });

  return totalFieldsFound;
};

// Keep track of attempts
let attempts = 0;
const maxAttempts = 50; // 5 seconds maximum (50 * 100ms)

// Check for forms and fields
const formCheck = setInterval(() => {
  attempts++;
  console.log(`Attempt ${attempts} to find form fields...`);

  const totalFields = populateUTMFields();

  // If we found enough fields in both forms OR we've exceeded max attempts
  if (totalFields >= 12 || attempts >= maxAttempts) {
    console.log(`Stopping checks - Found ${totalFields} fields after ${attempts} attempts`);
    clearInterval(formCheck);
  }
}, 100);

// Function to check current values
const checkNinjaFormFields = () => {
  const formContainers = document.querySelectorAll('.nf-form-cont');
  formContainers.forEach((formContainer, formIndex) => {
    console.group(`Form ${formIndex + 1}`);
    const hiddenFields = Array.from(formContainer.querySelectorAll('input[type="hidden"]'));
    hiddenFields.slice(0, 6).forEach(field => {
      console.log(`${field.id}: ${field.value || 'empty'}`);
    });
    console.groupEnd();
  });
};

// Make check function available globally
window.checkNinjaFormFields = checkNinjaFormFields;