import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
import { LayoutService } from '../../services/layout.service';

@Component( {
              selector   : 'app-public-layout',
              templateUrl: './public-layout.component.html',
              styleUrls  : [ './public-layout.component.scss' ],
            } )
export class PublicLayoutComponent
  implements OnInit, OnDestroy {
  public title: string      = AppComponent.productName;
  showBreadcrumbs: boolean  = false;
  sideNavCollapsed: boolean = false;
  hasSideNav: boolean       = false;

  private hasSideNavSub: Subscription;
  private sideNavCollapsedSub: Subscription;
  private showBreadcrumbsSub: Subscription;
  private alertsSub: Subscription;

  public alert = {
    visible    : false,
    type       : 'info',
    dismissable: false,
    message    : '',
  };

  constructor( public layoutService: LayoutService, private cdr: ChangeDetectorRef ) {
    this.hasSideNavSub = this.layoutService.hasSideNav.subscribe( ( val ) => {
      this.hasSideNav = val;
      this.cdr.detectChanges();
    } );

    this.sideNavCollapsedSub = this.layoutService.sideNavCollapsed.subscribe( ( val ) => {
      this.sideNavCollapsed = val;
      this.cdr.detectChanges();
    } );

    this.showBreadcrumbsSub = this.layoutService.showBreadcrumbs.subscribe( ( val ) => {
      this.showBreadcrumbs = val;
      this.cdr.detectChanges();
    } );

    this.alertsSub = this.layoutService.alert.subscribe( ( val ) => {
      if ( val ) {
        this.alert.dismissable = !val.dismissAfter ? true : val.dismissable;
        this.alert.type        = val.type;
        this.alert.message     = val.message;

        this.alert.visible = true;

        if ( val.dismissAfter ) {
          setTimeout( () => {
            this.alert.visible = false;
            this.cdr.detectChanges();
          }, val.dismissAfter );
        }

        this.cdr.detectChanges();
      }
    } );
  }

  ngOnInit(): void {
  }

  dismissAlert() {
    this.alert.visible = false;
  }

  ngOnDestroy(): void {
    this.hasSideNavSub.unsubscribe();
    this.sideNavCollapsedSub.unsubscribe();
    this.showBreadcrumbsSub.unsubscribe();
  }
}
