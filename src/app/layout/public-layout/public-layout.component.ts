import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PublicLayoutService } from '../../services/public-layout.service';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';

@Component( {
              selector   : 'app-public-layout',
              templateUrl: './public-layout.component.html',
              styleUrls  : [ './public-layout.component.scss' ],
            } )
export class PublicLayoutComponent implements OnInit, OnDestroy {
  public title: string      = AppComponent.productName;
  showBreadcrumbs: boolean  = false;
  sideNavCollapsed: boolean = false;
  hasSideNav: boolean       = false;

  private hasSideNavSub: Subscription;
  private sideNavCollapsedSub: Subscription;
  private showBreadcrumbsSub: Subscription;

  constructor( public publicLayoutService: PublicLayoutService, private cdr: ChangeDetectorRef ) {
    this.hasSideNavSub = this.publicLayoutService.hasSideNav.subscribe( ( val ) => {
      this.hasSideNav = val;
      this.cdr.detectChanges();
    } );

    this.sideNavCollapsedSub = this.publicLayoutService.sideNavCollapsed.subscribe( ( val ) => {
      this.sideNavCollapsed = val;
      this.cdr.detectChanges();
    } );

    this.showBreadcrumbsSub = this.publicLayoutService.showBreadcrumbs.subscribe( ( val ) => {
      this.showBreadcrumbs = val;
      this.cdr.detectChanges();
    } );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.hasSideNavSub.unsubscribe();
    this.sideNavCollapsedSub.unsubscribe();
    this.showBreadcrumbsSub.unsubscribe();
  }
}
