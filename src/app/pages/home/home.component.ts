import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LayoutService } from '../../services/layout.service';

@Component( {
              selector: 'app-home',
              templateUrl: './home.component.html',
              styleUrls: [ './home.component.scss' ],
            } )
export class HomeComponent implements OnInit, OnDestroy {

  constructor( public layoutService: LayoutService ) {

  }

  ngOnInit(): void {
    this.layoutService.hasSideNav.next( true );
  }

  ngOnDestroy(): void {
    // set back to default value so we only have to do the setup when we need a sidenav
    this.layoutService.hasSideNav.next( false );
  }

}
