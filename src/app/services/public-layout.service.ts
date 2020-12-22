import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IAlert } from './private-layout.service';

@Injectable( {
               providedIn: 'root',
             } )
export class PublicLayoutService {
  public hasSideNav: Subject<boolean>       = new Subject<boolean>();
  public sideNavCollapsed: Subject<boolean> = new Subject<boolean>();
  public showBreadcrumbs: Subject<boolean>  = new Subject<boolean>();
  public alert: Subject<IAlert>             = new Subject<IAlert>();

  constructor() {
  }

  showAlert( alert: IAlert ) {
    this.alert.next( alert );
  }
}
