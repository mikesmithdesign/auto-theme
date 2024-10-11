import $ from 'jquery';
import slick from 'slick-carousel';

$(window).on('load', function () {
  $('.carousel-slider').each(function () {
    let slider = $(this);
    slider.slick({
      rows: 0,
      slidesToShow: 3,
      autoplay: true,
      autoplaySpeed: 2500,
      slidesToScroll: 1,
      speed: 500,
      arrows: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            adaptiveHeight: true
          }
        }
      ]
    })
  })
})