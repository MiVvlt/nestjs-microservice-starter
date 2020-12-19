import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  public static readonly productName = 'Microservice App'
  public static readonly companyName = 'Ordina'
}
