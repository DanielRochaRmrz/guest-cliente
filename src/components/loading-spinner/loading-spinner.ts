import { Component } from '@angular/core';
@Component({
  selector: 'loading-spinner',
  templateUrl: 'loading-spinner.html'
})
export class LoadingSpinnerComponent {

  text: string;

  constructor() {
    console.log('Hello LoadingSpinnerComponent Component');
    this.text = 'Hello World';
  }

}
