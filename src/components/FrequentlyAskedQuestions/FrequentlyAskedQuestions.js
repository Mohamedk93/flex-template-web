import React from 'react';
import config from '../../config';
import { StaticPage, TopbarContainer } from '../../containers';

const FrequentlyAskedQuestions = () => {

   $(function() {
	var Accordion = function(el, multiple) {
		this.el = el || {};
		this.multiple = multiple || false;

		// Variables privadas
		var links = this.el.find('.link');
		// Evento
		links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
	}

	Accordion.prototype.dropdown = function(e) {
		var $el = e.data.el;
			$this = $(this),
			$next = $this.next();

		$next.slideToggle();
		$this.parent().toggleClass('open');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
		};
	}	

	var accordion = new Accordion($('#accordion'), false);
});

return (
<ul id="accordion" className={css.accordion}>
  <li>
    <div className={css.link}>
        <i className={css.fa-database}></i>Web Design<i className={css.fa-chevron-down}></i>
        </div>
    <ul class={css.submenu}>
      <li><a href="#">Photoshop</a></li>
      <li><a href="#">HTML</a></li>
      <li><a href="#">CSS</a></li>
    </ul>
  </li>
  <li>
    <div className={css.link}><i className={css.fa-code}></i>Coding<i className={css.fa-chevron-down}></i></div>
    <ul className={css.submenu}>
      <li><a href="#">Javascript</a></li>
      <li><a href="#">jQuery</a></li>
      <li><a href="#">Ruby</a></li>
    </ul>
  </li>
  <li>
    <div className={css.link}><i className={css.fa-mobile}></i>Devices<i className={css.fa-chevron-down}></i></div>
    <ul className={css.submenu}>
      <li><a href="#">Tablet</a></li>
      <li><a href="#">Mobile</a></li>
      <li><a href="#">Desktop</a></li>
    </ul>
  </li>
  <li>
    <div className={css.link}><i className={css.fa-globe}></i>Global<i className={css.fa-chevron-down}></i></div>
    <ul className={css.submenu}>
      <li><a href="#">Google</a></li>
      <li><a href="#">Bing</a></li>
      <li><a href="#">Yahoo</a></li>
    </ul>
  </li>
</ul>

)
}
export default FrequentlyAskedQuestions;