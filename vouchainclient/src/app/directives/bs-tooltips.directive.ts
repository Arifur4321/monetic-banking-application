import { Directive } from '@angular/core';

/* jQuery */
declare var $: any;

@Directive({
  selector: '[appBsTooltips]'
})
export class BsTooltipsDirective {

  constructor() {

    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });

  }


}
