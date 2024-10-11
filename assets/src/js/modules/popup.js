import $ from 'jquery';
import Cookies from 'js-cookie';

$('[data-trigger]').on('click', function () {
  $('body, html').addClass('lock');
  let target = $(this).data('trigger');
  $(`#${target}`).fadeIn(300);
});

$('button.close').on('click', function () {
  $('body, html').removeClass('lock');
  $('.pop-up-overlay').fadeOut(300);
})


$(window).on('load', function () {
  function handlePopups() {

    const popups = $('[data-expiry]');
    console.log(popups);

    if (popups.length === 0) {
      return;
    }


    popups.each(function () {
      const popup = $(this);
      const expiry = popup.data('expiry');
      const popupId = popup.attr('id');
      if (!Cookies.get(`seen-popup-${popupId}`)) {
        popup.fadeIn(300);
        $('body, html').addClass('lock');
        if (expiry == "session") {
          Cookies.set(`seen-popup-${popupId}`, 'true');
        } else {
          Cookies.set(`seen-popup-${popupId}`, 'true', { expires: expiry });
        }
      }
    });
  }

  handlePopups();
});