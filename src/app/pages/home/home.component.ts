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
  }

  ngOnDestroy(): void {

  }

}
