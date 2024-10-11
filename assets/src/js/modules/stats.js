import $ from 'jquery';
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(window).on('load', function () {
  $('.animated-stats').each(function () {
    let wrapper = $(this);
    let stats = wrapper.find('.stat [data-count]');

    stats.each(function (index) {
      let stat = $(this);
      let endVal = parseInt(stat.attr('data-count'));
      let increment = parseInt(stat.attr('data-increment'));
      gsap.to(stat, {
        textContent: endVal,
        duration: 2.5,
        snap: { textContent: increment },
        ease: 'none',
        onUpdate: function () {
          stat.text(numberWithCommas(stat.text()));
        },
        scrollTrigger: {
          trigger: wrapper,
          top: 'top bottom',
        }
      })
    })
  })
})