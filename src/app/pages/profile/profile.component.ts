import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DomSanitizer,
  SafeUrl,
} from '@angular/platform-browser';
import { FetchPolicy } from '@apollo/client/core/watchQueryOptions';
import { ClrWizard } from '@clr/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PrivateLayoutService } from '../../services/private-layout.service';
import {
  Apollo,
  gql,
} from 'apollo-angular';


const ME = gql`
  query {
    me{id, firstname, lastname, email, dateCreated, roles, avatar}
  }
`;

const UPLOAD_AVATAR = gql`
  mutation($avatar: String!) {
    updateAvatar(avatarRequest: {avatar: $avatar})
  }
`;

interface IProfile {
  id: string;
  firstname: string;
  lastname: string;
  avatar: string | undefined;
  email: string;
  dateCreated: Date;
  roles: string[];
}

@Component( {
              selector   : 'app-profile',
              templateUrl: './profile.component.html',
              styleUrls  : [ './profile.component.scss' ],
            } )
export class ProfileComponent
  implements OnInit {
  public profile: IProfile | undefined;
  imageChangedEvent: any       = '';
  croppedImage?: string | null = '';
  openAvatarModal: boolean     = false;
  defaultAvatar: string        = '';
  safeAvatar: SafeUrl          = '';

  @ViewChild('wizard', {static: false})
  // @ts-ignore
  wizard: ClrWizard

  constructor( private privateLayoutService: PrivateLayoutService,
               private apollo: Apollo,
               private sanitization: DomSanitizer,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.privateLayoutService.hasSideNav.next( true );
    this.privateLayoutService.showBreadcrumbs.next( true );
    this.profile = await this.getProfile();
  }

  private getProfile( fetchPolicy?: FetchPolicy ): Promise<IProfile> {
    return new Promise( ( resolve, reject ) => {
      this.apollo.watchQuery( {
                           query      : ME,
                           fetchPolicy: fetchPolicy,
                         } )
          .valueChanges
          .subscribe( ( { data }: any ) => {
            this.safeAvatar = data.me.avatar ?
                              this.sanitization.bypassSecurityTrustUrl( data.me.avatar as string ) :
                              this.sanitization.bypassSecurityTrustUrl( this.defaultAvatar );
            resolve( ( data.me ) as IProfile );
          }, ( err ) => {
            reject( err );
          } );
    } );
  }


  fileChangeEvent( event: any ): void {
    this.imageChangedEvent = event;
  }

  imageCropped( event: ImageCroppedEvent ) {
    this.croppedImage = event.base64;
  }

  resetAvatarModal() {
    this.croppedImage      = undefined;
    this.imageChangedEvent = undefined;
    this.openAvatarModal   = false;
  }

  public async uploadAvatar() {

    await ( this.apollo.mutate( {
                                  mutation : UPLOAD_AVATAR,
                                  variables: { avatar: this.croppedImage },
                                } ).toPromise() );
    this.profile = await this.getProfile('no-cache');
    this.wizard.reset();
    this.resetAvatarModal();

  }


}
