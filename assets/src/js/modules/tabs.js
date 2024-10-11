import $ from 'jquery';

let tabsHeight = 0;

$(window).on("load resize", function () {
  $('.tab-container').each(function () {
    let activeHeight = $(this).find('.content.active').outerHeight();
    tabsHeight = $(this).find('.tabs').outerHeight();
    $(this).find('.content-wrapper').css('height', `${activeHeight}px`);
    $(this).find('.content-wrapper').css('min-height', `${tabsHeight}px`);
  })
})
$(window).on("load", function () {

  $('.tab-title').on('click', function () {
    let index = $(this).data('index');
    let parent = $(this).parents('.tab-container');
    let target = parent.find(`.content[data-index=${index}]`);
    let targetHeight = target.outerHeight();
    $(this).addClass('active').siblings().removeClass('active');
    target.addClass('active').siblings().removeClass('active');
    parent.find('.content-wrapper').css('height', `${targetHeight}px`);

    if (targetHeight <= tabsHeight) {
      parent.find('.content-wrapper').addClass('remove-corner')
    } else {
      parent.find('.content-wrapper').removeClass('remove-corner')
    }
  })
})


