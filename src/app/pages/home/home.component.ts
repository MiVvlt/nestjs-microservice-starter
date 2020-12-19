import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {PublicLayoutService} from "../../services/public-layout.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(public publicLayoutService: PublicLayoutService) {

  }

  ngOnInit(): void {
    this.publicLayoutService.hasSideNav.next(true);
  }

  ngOnDestroy(): void {
    // set back to default value so we only have to do the setup when we need a sidenav
    this.publicLayoutService.hasSideNav.next(false);
  }

}
