<?php function theme_customize_register($wp_customize)
{
  //Colours
  $wp_customize->add_setting('text_colour', array(
    'default'   => '#ffffff',
    'sanitize_callback' => 'sanitize_hex_color',
  ));

  $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'text_colour', array(
    'section' => 'colors',
    'label'   => esc_html__('Text Colour', 'theme'),
    'settings' => 'text_colour',
  )));

  $wp_customize->add_setting('light_bg_colour', array(
    'default'   => '#ffffff',
    'sanitize_callback' => 'sanitize_hex_color',
  ));

  $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'light_bg_colour', array(
    'section' => 'colors',
    'label'   => esc_html__('Light Background Colour', 'theme'),
    'settings' => 'light_bg_colour',
  )));

  $wp_customize->add_setting('dark_bg_colour', array(
    'default'   => '#ffffff',
    'sanitize_callback' => 'sanitize_hex_color',
  ));

  $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'dark_bg_colour', array(
    'section' => 'colors',
    'label'   => esc_html__('Dark Background Colour', 'theme'),
    'settings' => 'dark_bg_colour',
  )));


  $wp_customize->add_setting('accent_colour', array(
    'default'   => '#ffffff',
    'sanitize_callback' => 'sanitize_hex_color',
  ));

  $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'accent_colour', array(
    'section' => 'colors',
    'label'   => esc_html__('Accent Colour', 'theme'),
    'settings' => 'accent_colour',
  )));

  $wp_customize->add_setting('secondary_accent_colour', array(
    'default'   => '#ffffff',
    'sanitize_callback' => 'sanitize_hex_color',
  ));

  $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'secondary_accent_colour', array(
    'section' => 'colors',
    'label'   => esc_html__('Secondary Accent Colour', 'theme'),
    'settings' => 'secondary_accent_colour',
  )));


  


  // Logo

  class WP_Customize_Range_Control extends WP_Customize_Control
  {
    public $type = 'custom_range';
    public function enqueue()
    {
      wp_enqueue_script(
        'cs-range-control',
        get_template_directory_uri() . '/assets/dist/range.js',
        array('jquery'),
        false,
        true
      );
    }
    public function render_content()
    {
?>
<label>
  <?php if (!empty($this->label)) : ?>
  <span class="customize-control-title"><?php echo esc_html($this->label); ?></span>
  <?php endif; ?>
  <div class="cs-range-value"><?php echo esc_attr($this->value()); ?>px</div>
  <input data-input-type="range" type="range" <?php $this->input_attrs(); ?>
    value="<?php echo esc_attr($this->value()); ?>" <?php $this->link(); ?> />
  <?php if (!empty($this->description)) : ?>
  <span class="description customize-control-description"><?php echo $this->description; ?></span>
  <?php endif; ?>
</label>
<?php
    }
  }

  $wp_customize->add_setting('logo');

  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'logo', array(
    'label' => 'Logo',
    'section' => 'title_tagline',
    'settings' => 'logo',
  )));

  $wp_customize->add_setting(
    'logo_size',
    array(
      'default'    => '180',
      'type'       => 'theme_mod'
    )
  );

  $wp_customize->add_control(new WP_Customize_Range_Control(
    $wp_customize,
    'logo_size',
    array(
      'label'      => __('Logo Size', 'theme'),
      'settings'   => 'logo_size',
      'section'    => 'title_tagline',
      'input_attrs' => array(
        'min' => 0,
        'max' => 350,
        'step' => 5,
      ),
    )
  ));
}


add_action('customize_register', 'theme_customize_register');

function remove_styles_sections($wp_customize)
{
  $wp_customize->remove_control('blogname');
  $wp_customize->remove_control('site_icon');
  $wp_customize->remove_control('blogdescription');
  $wp_customize->remove_section('static_front_page');
}
add_action('customize_register', 'remove_styles_sections', 20, 1);