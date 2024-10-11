import $ from 'jquery';
import matchHeight from 'jquery-match-height';

$(window).on('load', function () {
  $('article .text-wrap').matchHeight();
})