import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AppComponent } from '../../app.component';
import { Subscription } from 'rxjs';
import {
  Apollo,
  gql,
} from 'apollo-angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

const ME = gql`
  query {
    me{id, firstname, lastname, roles}
  }
`;

interface IProfile {
  id: string,
  firstname: string,
  lastname: string,
  roles: string[]
}

@Component( {
              selector   : 'app-auth-layout',
              templateUrl: './auth-layout.component.html',
              styleUrls  : [ './auth-layout.component.scss' ],
            } )
export class AuthLayoutComponent
  implements OnInit, OnDestroy {
  public title: string      = AppComponent.productName;
  showBreadcrumbs: boolean  = false;
  sideNavCollapsed: boolean = false;
  hasSideNav: boolean       = false;

  private hasSideNavSub: Subscription;
  private sideNavCollapsedSub: Subscription;
  private showBreadcrumbsSub: Subscription;
  private alertsSub: Subscription;

  public profile: IProfile | undefined = undefined;

  public alert = {
    visible    : false,
    type       : 'info',
    dismissable: false,
    message    : '',
  };

  constructor( public layoutService: LayoutService,
               private cdr: ChangeDetectorRef,
               private apollo: Apollo,
               private authService: AuthService,
               private router: Router,
  ) {
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

  private fetchProfile() {
    return new Promise( ( resolve, reject ) => {
      this.apollo.watchQuery( {
                                query: ME,
                              } )
          .valueChanges
          .subscribe( ( result ) => {
            resolve( ( result.data as any ).me );
          }, ( err ) => {
            reject( err );
          } );
    } );
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate( [ '/home' ] );
  }

  async ngOnInit() {
    this.profile = ( await this.fetchProfile() ) as IProfile;
  }

  dismissAlert() {
    this.alert.visible = false;
  }

  ngOnDestroy() {
    this.hasSideNavSub.unsubscribe();
    this.sideNavCollapsedSub.unsubscribe();
    this.showBreadcrumbsSub.unsubscribe();
    this.alertsSub.unsubscribe();
  }
}
