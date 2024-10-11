import $ from 'jquery';
import slick from 'slick-carousel';

$(window).on('load', function () {
  $('.product-info').each(function () {
    let slider = $(this).find('.product-gallery');
    let thumbnail = $(this).find('.thumbs button');

    slider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      adaptiveHeight: true,
      speed: 500
    })

    thumbnail.on('click', function () {
      $(this).addClass('active').siblings().removeClass('active');
      let index = $(this).data('index');
      slider.slick('slickGoTo', index);
    })
  })

})