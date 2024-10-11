import $ from 'jquery';

$(window).on('load resize', function () {
  let windowWidth = $(window).width();
  let rowWidth = $('.subnav .row').width();
  let wrapperWidth = $('.subnav .wrapper.images').width();
  let padding = $('.subnav .row').css('padding-right');
  let difference = ((windowWidth - rowWidth) / 2) - parseInt(padding);
  let headingWidth = $('.subnav .wrapper.images h2').width();
  let mobile = windowWidth < 1024;
  if (mobile) {
    $('.subnav .images nav').removeAttr('style')
  } else {
    $('.subnav .images nav').css('width', `calc(${wrapperWidth - headingWidth}px + ${difference}px)`);
  }

})