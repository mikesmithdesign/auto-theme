import $ from 'jquery';
import { gsap } from 'gsap';
import matchHeight from 'jquery-match-height';

$(window).on('load', function () {
  $('.product-listing').each(function () {
    const listing = $(this);
    const grid = listing.find('.item-listing');
    const items = grid.find('.product-wrapper');
    const sort = listing.find('.sort');
    const filter = listing.find('.filter');
    let filterArray = [];
    let currentSort = 'best-seller';

    function checkForBestSellers(itemsToCheck = items) {
      const hasBestSellers = itemsToCheck.toArray().some(item =>
        $(item).attr('data-best-seller') === "1"
      );

      if (hasBestSellers) {
        sort.find('li:first-child').show();
      } else {
        sort.find('li:first-child').hide();
        if (sort.find('li:first-child').hasClass('active')) {
          sort.find('li:nth-child(2)').addClass('active').siblings().removeClass('active');
          currentSort = 'price-low';
        }
      }

      return hasBestSellers;
    }

    function sortItems(sortBy, itemsToSort, animate = true) {
      const sortedItems = itemsToSort.toArray().sort((a, b) => {
        const $a = $(a);
        const $b = $(b);
        const aIsBestSeller = $a.attr('data-best-seller') === "1";
        const bIsBestSeller = $b.attr('data-best-seller') === "1";
        const aPrice = parseFloat($a.attr('data-price'));
        const bPrice = parseFloat($b.attr('data-price'));

        switch (sortBy) {
          case 'best-seller':
            if (aIsBestSeller !== bIsBestSeller) return aIsBestSeller ? -1 : 1;
            return aPrice - bPrice;
          case 'price-low':
            return aPrice - bPrice;
          case 'price-high':
            return bPrice - aPrice;
          default:
            return 0;
        }
      });

      if (animate) {
        gsap.to(itemsToSort, {
          autoAlpha: 0,
          y: 30,
          duration: 0.1,
          onComplete: () => {
            grid.append(sortedItems);
            grid.find('.item-text').matchHeight();
            gsap.to(sortedItems, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.1 });
          }
        });
      } else {
        gsap.set(itemsToSort, { autoAlpha: 0, y: 30 });
        grid.append(sortedItems);
        gsap.set(sortedItems, { autoAlpha: 1, y: 0 });
        grid.find('.item-text').matchHeight();
      }
    }

    function filterItems() {
      const filteredItems = items.filter((_, item) => {
        if (filterArray.length === 0) return true;
        return filterArray.some(filter => $(item).hasClass(filter.substring(1)));
      });

      items.not(filteredItems).hide();
      filteredItems.show();

      checkForBestSellers(filteredItems);
      sortItems(currentSort, filteredItems, true);

      return filteredItems;
    }

    sort.find('button').on('click', function () {
      currentSort = $(this).data('sort');
      $(this).parent('li').addClass('active').siblings().removeClass('active');
      sortItems(currentSort, items.filter(':visible'), true);
    });

    filter.find('[data-filter]').on('click', function () {
      const filtering = $(this).data('filter');
      if (filterArray.includes(`.${filtering}`)) {
        filterArray = filterArray.filter(f => f !== `.${filtering}`);
      } else {
        filterArray.push(`.${filtering}`);
      }

      $(this).parent('li').toggleClass('active');

      if (filterArray.length > 0) {
        filter.find('.counter').text(`(${filterArray.length})`);
      } else {
        filter.find('.counter').text('');
      }

      filterItems();
    });

    filter.find('.reset').on('click', function () {
      filter.find('li').removeClass('active');
      filterArray = [];
      filter.find('.counter').text('');
      items.show();
      checkForBestSellers();
      sortItems(currentSort, items, true);
    });

    // Initial setup
    const initialSortBy = checkForBestSellers() ? 'best-seller' : 'price-low';
    currentSort = initialSortBy;
    sortItems(initialSortBy, items, false);
  });
});