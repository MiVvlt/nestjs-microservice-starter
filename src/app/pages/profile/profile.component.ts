import {
  Component,
  OnInit,
} from '@angular/core';
import { PrivateLayoutService } from '../../services/private-layout.service';
import {
  Apollo,
  gql,
} from 'apollo-angular';


const ME = gql`
  query {
    me{id, firstname, lastname,email, dateCreated, roles}
  }
`;

interface IProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  dateCreated: Date;
  roles: string[];
}

@Component( {
              selector: 'app-profile',
              templateUrl: './profile.component.html',
              styleUrls: [ './profile.component.scss' ],
            } )
export class ProfileComponent implements OnInit {
  public profile: IProfile | undefined;

  constructor( private privateLayoutService: PrivateLayoutService, private apollo: Apollo ) {
  }

  async ngOnInit(): Promise<void> {
    this.privateLayoutService.hasSideNav.next( true );
    this.privateLayoutService.showBreadcrumbs.next( true );
    this.profile = await this.getProfile();
  }

  private getProfile(): Promise<IProfile> {
    return new Promise( ( resolve, reject ) => {
      this.apollo.watchQuery( {
                                query: ME,
                              } )
          .valueChanges
          .subscribe( ( result ) => {
            resolve( ( ( result.data as any ).me ) as IProfile );
          }, ( err ) => {
            reject( err );
          } );
    } );
  }

}
