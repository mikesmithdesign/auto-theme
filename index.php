<?php

use Timber\Timber;

global $paged;
// if (!isset($paged) || !$paged) {
//     $paged = 1;
// }
$context = Timber::context();
$args = [
    'post_type' => 'post',
    'posts_per_page' => -1
    // 'paged' => $paged,
];
$context['posts'] = new \Timber\PostQuery(new WP_Query($args));
function get_product_query($type, $categories)
{
    $args = [
        'post_type' => 'product',
        'posts_per_page' => -1,
    ];


 
    if ($type == 'cat' && !empty($categories)) {
        $term_ids = array_map(function ($term) {
            return $term->term_id;
        }, $categories);

   

        $args['tax_query'] = array(
            array(
                'taxonomy' => 'product-cat',
                'field'    => 'term_id',
                'terms'    => $term_ids,
            )
        );
    }

    $query = new WP_Query($args);

   
    return new \Timber\PostQuery($query);
}

$product_queries = [];
$product_listing_count = 0;

while (have_rows('modules')) : the_row();
    if (get_row_layout() == 'product_listing') {
        $listing_type = get_sub_field('listing_type');
        $categories = ($listing_type == 'cat') ? get_sub_field('category') : null;
        $product_queries[$product_listing_count] = get_product_query($listing_type, $categories);
        $product_listing_count++;
    }
endwhile;
    

$context['product_queries'] = $product_queries;
$context['product_listing_count'] = $product_listing_count;

$templates = [
'pages/index.twig'
];
Timber::render($templates, $context);