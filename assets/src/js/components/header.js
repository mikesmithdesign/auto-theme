import $ from 'jquery';

function calculateIconNav() {
  let iconNavs = document.querySelectorAll('.icon-nav');

  iconNavs.forEach(iconNav => {
    let parent = iconNav.parentElement.parentElement;
    let mainNav = document.querySelector('.main-nav ul');


    let parentHeight = parent.offsetHeight;
    iconNav.style.height = parentHeight + 'px';

    let parentWidth = parent.offsetWidth;
    let containerWidth = mainNav.offsetWidth;
    let difference = mainNav.getBoundingClientRect().left - parent.getBoundingClientRect().left;

    iconNav.style.width = containerWidth - parentWidth + difference + 'px';
  });
}

window.addEventListener('load', calculateIconNav);
window.addEventListener('resize', calculateIconNav);

function calculateNavHeight() {
  let topHeight = $('.header-top').outerHeight() + $('.header-main').outerHeight();
  let windowHeight = $(window).innerHeight();
  $('.main-nav .row > ul').css('max-height', windowHeight - topHeight);
}


$('.hamburger').on('click', function () {
  $('body, html').toggleClass('lock');
  $(this).toggleClass('is-active');
  $('.main-nav .row > ul').slideToggle(300);
})
// Define the media query
const mediaQuery = window.matchMedia('(min-width: 1280px)');

// Function to handle the state change
function handleWidthChange(e) {


  if (e.matches) {
    $('.hamburger').removeClass('is-active');
    $('.main-nav .row > ul').css('display', 'flex');
    $('body, html').removeClass('lock');

  } else {
    $('.main-nav .row > ul').css('display', 'none');
    calculateNavHeight();
  }
}

// Add the listener for changes
mediaQuery.addListener(handleWidthChange);

// Initial check
handleWidthChange(mediaQuery);

