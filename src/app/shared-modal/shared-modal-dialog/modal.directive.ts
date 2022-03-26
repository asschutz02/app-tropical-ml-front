import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appModalDirective]'
})
export class ModalDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
