import $ from "jquery";

$('.accordion-title').on('click', function () {
  let target = $(this).parents('li').find('.accordion-content');


  $('.accordion-title').not(this).removeClass('active')
  $('.accordion-content').not(target).slideUp(300)
  $(this).toggleClass('active')
  target.slideToggle(300)
})