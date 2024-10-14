<?php 

function scripts_styles() {
    wp_enqueue_style('app', get_template_directory_uri() . '/assets/dist/app.css', array(), '0.0.28');
    wp_enqueue_script('app', get_template_directory_uri() . '/assets/dist/app.js', array(), '0.0.16', true);
}
add_action('wp_enqueue_scripts', 'scripts_styles');

function deregister_media_elements()
{
    wp_deregister_script('mediaelement');
    wp_deregister_style('mediaelement');
}
add_action('wp_enqueue_scripts', 'deregister_media_elements');