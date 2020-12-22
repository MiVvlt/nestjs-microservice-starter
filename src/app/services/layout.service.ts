import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface IAlert {
  dismissAfter?: number,
  type: 'danger' | 'success' | 'info' | 'warn',
  dismissable: boolean,
  message: string
}

@Injectable( {
               providedIn: 'root',
             } )
export class LayoutService {
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
