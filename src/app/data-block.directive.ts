import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDataBlock]'
})
export class DataBlockDirective {

  constructor(public guideContainer:ViewContainerRef) { }

}
