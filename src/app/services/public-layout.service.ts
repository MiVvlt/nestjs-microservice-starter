import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable( {
               providedIn: 'root',
             } )
export class PublicLayoutService {
  public hasSideNav: Subject<boolean>       = new Subject<boolean>();
  public sideNavCollapsed: Subject<boolean> = new Subject<boolean>();
  public showBreadcrumbs: Subject<boolean>  = new Subject<boolean>();

  constructor() {
  }
}
