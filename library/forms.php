<?php
// Server-side capture of Ninja Forms data with field names, excluding submit button
function capture_ninja_forms_data_with_names($form_data)
{
  // Create a structured data object
  $form_values = array(
    'formId' => $form_data['form_id'],
    'timestamp' => date('Y-m-d H:i:s')
  );

  // Extract all field values by their keys, ignoring numeric IDs and the submit button
  foreach ($form_data['fields'] as $field_id => $field) {
    if (isset($field['value']) && isset($field['key']) && !empty($field['key'])) {
      // Get field key and value
      $key = 'key_' . $field['key'];
      $value = $field['value'];

      // Skip if this is the submit button (request_a_callback)
      if (strpos($key, 'key_request_a_callback_') !== false) {
        continue;
      }

      // Store with named key
      $form_values[$key] = $value;
    }
  }

  // Create a unique identifier for this submission
  $submission_id = 'nf_submission_' . time() . '_' . mt_rand(1000, 9999);

  // Store the data in a transient
  set_transient($submission_id, $form_values, 3600); // 1 hour expiration

  // Set a cookie with the submission ID
  setcookie('nf_submission_id', $submission_id, time() + 3600, '/');

  return $form_data;
}
add_filter('ninja_forms_submit_data', 'capture_ninja_forms_data_with_names');

// Function to display captured form data on the thank you page
function display_captured_form_data_with_names()
{
  // Check if we're on any thank-you page
  if (is_page() && preg_match('/^thank-you/', get_post_field('post_name'))) {
    // Check if we have the submission ID cookie
    if (isset($_COOKIE['nf_submission_id'])) {
      $submission_id = sanitize_text_field($_COOKIE['nf_submission_id']);
      $form_data = get_transient($submission_id);

      if ($form_data) {
        // Output the data as JSON for JavaScript to use
?>
<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function() {
  // Log the server-captured data
  var formData = <?php echo json_encode($form_data); ?>;
  console.log('Server-side captured form data:', formData);

  // Store in sessionStorage for Ruler Analytics to use
  sessionStorage.setItem('rulerFormData', JSON.stringify(formData));

  // Display the data on the page for testing
  var dataHtml = '<div style="background:#f8f8f8; padding:15px; margin:20px 0; border:1px solid #ddd;">';
  dataHtml += '<h3>Captured Form Data</h3>';
  dataHtml += '<table style="width:100%; border-collapse:collapse;">';
  dataHtml +=
    '<tr><th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Field</th><th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Value</th></tr>';

  // Skip formId and timestamp for the display table
  Object.keys(formData).forEach(function(key) {
    if (key !== 'formId' && key !== 'timestamp') {
      dataHtml += '<tr>';
      dataHtml += '<td style="padding:8px; border-bottom:1px solid #eee;">' + key + '</td>';
      dataHtml += '<td style="padding:8px; border-bottom:1px solid #eee;">' + formData[key] + '</td>';
      dataHtml += '</tr>';
    }
  });

  dataHtml += '</table>';
  dataHtml += '</div>';

  var contentEl = document.querySelector('.entry-content');
  if (contentEl) {
    var dataDiv = document.createElement('div');
    dataDiv.innerHTML = dataHtml;
    contentEl.prepend(dataDiv.firstChild);
  }
});
</script>
<?php

        // Delete the transient after use
        delete_transient($submission_id);
      } else {
        // No data found in transient - no need to display an error on the page
      ?>
<script type="text/javascript">
console.log('No server-side form data found for ID:', '<?php echo $submission_id; ?>');
</script>
<?php
      }

      // Clear the cookie
      setcookie('nf_submission_id', '', time() - 3600, '/');
    }
  }
}
add_action('wp_head', 'display_captured_form_data_with_names');

// Add Ruler Analytics tracking code to thank you pages
function add_ruler_analytics_tracking()
{
  // Check if we're on any thank-you page
  if (is_page() && preg_match('/^thank-you/', get_post_field('post_name'))) {
    ?>
<script type="text/javascript">
window.addEventListener('load', function() {
  function RulerThankYouPageTracking() {
    try {
      // Check if Ruler Analytics is available
      if (typeof RulerAnalyticsVisitorId === 'undefined')
        throw "Ruler Analytics is not set on the page";

      // Get form data from sessionStorage
      var formDataStr = sessionStorage.getItem('rulerFormData');
      var formData = formDataStr ? JSON.parse(formDataStr) : {};

      console.log('Retrieved form data for Ruler tracking:', formData);

      // Create a mapping for field name standardization
      var fieldMappings = {
        'your_name': 'Name',
        'e_mail_address': 'Email',
        'email': 'Email',
        'phone_number': 'Phone',
        'preferred_date_and_time_of_call_back': 'PreferredTime',
        'utm_source': 'UTMSource',
        'utm_medium': 'UTMMedium',
        'utm_campaign': 'UTMCampaign',
        'utm_keyword': 'UTMKeyword',
        'gad_source': 'GADSource',
        'gclid': 'GCLID'
      };

      // Create conversion object dynamically
      var RAConv = {};

      Object.keys(formData).forEach(function(key) {
        // Skip formId and timestamp
        if (key === 'formId' || key === 'timestamp') return;

        // Process only keys that start with 'key_'
        if (key.startsWith('key_')) {
          // Extract the base field name without trailing ID
          // Pattern: key_field_name_123456789
          var matches = key.match(/^key_(.+)_\d+$/);

          if (matches && matches[1]) {
            var baseFieldName = matches[1];

            // Map to standard field name if it exists in our mapping
            if (fieldMappings[baseFieldName]) {
              RAConv[fieldMappings[baseFieldName]] = formData[key] || "";
            } else {
              // For fields not in our mapping, use the base field name as is
              // Convert to title case for better readability
              var titledFieldName = baseFieldName
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join('');

              RAConv[titledFieldName] = formData[key] || "";
            }
          } else {
            // For keys that don't match our expected pattern
            // Remove the 'key_' prefix and use as is
            var cleanKey = key.replace('key_', '');
            RAConv[cleanKey] = formData[key] || "";
          }
        }
      });

      // Log what we're sending to Ruler
      console.log('Sending to Ruler Analytics:', RAConv);

      // Send the data to Ruler Analytics
      RulerAnalytics.trackConversionAsync(RAConv, "", "", 500);

      // Clear the data after successful tracking
      sessionStorage.removeItem('rulerFormData');

      console.log('Ruler Analytics tracking complete');

    } catch (error) {
      console.error('Ruler tracking error:', error);
      // // Retry after a short delay
      // setTimeout(RulerThankYouPageTracking, 300);
    }
  }

  // Wait a moment for everything to load then run the tracking
  setTimeout(RulerThankYouPageTracking, 1000);
});
</script>
<?php
  }
}
add_action('wp_footer', 'add_ruler_analytics_tracking', 40);