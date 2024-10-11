<?php

use Timber\Timber;

global $wp_query;

$context = Timber::context();
$context['title'] = get_search_query();
$context['posts'] = Timber::get_posts($wp_query);
$templates = [
  'pages/search.twig'
];
Timber::render($templates, $context);