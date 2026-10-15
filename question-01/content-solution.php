<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package bcm-developer-test-theme
 */

?>

<?php
    // Reject invalid page numbers before they reach the query.
    $page = filter_input(
        INPUT_GET,
        'page',
        FILTER_VALIDATE_INT,
        ['options' => ['min_range' => 1]]
    );
    $page = $page ?: 1;

    // Treat a missing or malformed search term as an empty search.
    $search = isset($_GET['s']) && is_string($_GET['s'])
        ? sanitize_text_field(wp_unslash($_GET['s']))
        : '';

    // WP_Query is a class, so use "new" to create its query object.
    $q = new WP_Query([
        'posts_per_page' => 10,
        // WP_Query uses "paged" to select a search-results page.
        'paged'          => $page,
        's'              => $search,
    ]);

    $pages = (int) $q->max_num_pages;
?>

<?php if ($search !== '') : ?>
<h1>
    Page <?= esc_html((string) $page) ?>
    of <?= esc_html((string) $pages) ?>:
    Search for <?= esc_html($search) ?>
</h1>
<?php endif; ?>

<?php if ($q->have_posts()) : ?>

<?php while ($q->have_posts()) : $q->the_post(); ?>

<?php
        // Apply the standard WordPress formatting before replacing placeholders.
        $content = apply_filters('the_content', get_the_content());

        // Escape the brackets so the pattern matches the literal [ad] marker.
        $content = preg_replace_callback(
            '/\[ad\]/',
            static function ($matches) {
                return '<div class="ad"></div>';
            },
            $content
        );
        ?>

<article>
    <h2><?= esc_html(get_the_title()) ?></h2>
    <div class="post-content">
        <?= $content ?>
    </div>
</article>

<?php endwhile; ?>

<?php if ($pages > 1) : ?>
<nav aria-label="Search results pagination">
    <?php
            echo wp_kses_post(
                paginate_links([
                    'base'    => add_query_arg('page', '%#%'),
                    'format'  => '',
                    'current' => $page,
                    'total'   => $pages,
                ])
            );
            ?>
</nav>
<?php endif; ?>

<?php else : ?>

<p>No posts found.</p>

<?php endif; ?>

<?php wp_reset_postdata(); ?>