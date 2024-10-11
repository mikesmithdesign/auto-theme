import $ from 'jquery';
import matchHeight from 'jquery-match-height';
import slick from 'slick-carousel';

$(window).on('load', function () {
  $('.price-comparison').each(function () {
    let controls = $(this).find('.controls');
    let slider = $(this).find('.comparison-tables') || $(this).find('.comparison-slider');

    slider.on('init', function () {
      slider.find('h3').matchHeight();
      slider.find('h4').matchHeight();
    })
    slider.slick({
      rows: 0,
      slidesToShow: 3,
      nextArrow: controls.find('.next'),
      prevArrow: controls.find('.prev'),
      slidesToScroll: 1,
      speed: 500,
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

    slider.find('.img-slider').each(function () {
      let imgSlider = $(this);
      imgSlider.slick({
        rows: 0,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        speed: 500
      })
    })
  })

  $('.product-comparison').each(function () {
    let controls = $(this).find('.controls');
    let slider = $(this).find('.comparison-slider');

    slider.on('init', function () {
      slider.find('.title').matchHeight();
      slider.find('.text').matchHeight();
      slider.find('.product-card').matchHeight();
    })
    slider.slick({
      rows: 0,
      slidesToShow: 3,
      nextArrow: controls.find('.next'),
      prevArrow: controls.find('.prev'),
      slidesToScroll: 1,
      speed: 500,
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