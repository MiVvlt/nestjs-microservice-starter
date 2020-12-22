import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  DomSanitizer,
  SafeUrl,
} from '@angular/platform-browser';
import { FetchPolicy } from '@apollo/client/core/watchQueryOptions';
import { ClrWizard } from '@clr/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from '../../../environments/environment';
import { MustMatch } from '../../helpers/must-match.validator';
import {
  Apollo,
  gql,
} from 'apollo-angular';
import { LayoutService } from '../../services/layout.service';


const ME = gql`
  query {
    me{id, firstname, lastname, email, dateCreated, roles, avatar, bio}
  }
`;

const UPLOAD_AVATAR = gql`
  mutation($avatar: String!) {
    updateAvatar(avatarRequest: {avatar: $avatar})
  }
`;

const UPDATE_INFO = gql`
  mutation($firstname: String!, $lastname: String!, $email: String!, $bio: String!) {
    updateProfile(updateInfoRequest: {firstname: $firstname, lastname: $lastname, email: $email, bio: $bio,})
    {id}
  }
`;

const UPDATE_PASSWORD = gql`
  mutation($old: String!, $new: String!) {
    updatePassword(dto: {old: $old, new: $new})
  }
`;

interface IProfile {
  id: string;
  firstname: string;
  lastname: string;
  avatar: string | undefined;
  email: string;
  bio: string;
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

  public basicInfoForm: FormGroup;
  public editingBasicInfo: boolean = false;
  public updatePasswordForm: FormGroup;


  @ViewChild( 'wizard', { static: false } ) wizard: ClrWizard | undefined;

  constructor( private layoutService: LayoutService,
               private apollo: Apollo,
               private readonly fb: FormBuilder,
               private sanitization: DomSanitizer,
  ) {
    this.basicInfoForm      = this.fb.group( {
                                               email    : [ {
                                                 value   : '',
                                                 disabled: true,
                                               }, [ Validators.required, Validators.email ],
                                               ],
                                               bio      : [ {
                                                 value   : '',
                                                 disabled: true,
                                               },
                                               ],
                                               firstname: [ {
                                                 value   : '',
                                                 disabled: true,
                                               },
                                               ],
                                               lastname : [ {
                                                 value   : '',
                                                 disabled: true,
                                               },
                                               ],
                                             } );
    this.updatePasswordForm = this.fb.group( {
                                               old    : [ '', [ Validators.required ] ],
                                               new    : [ '',
                                                          [ Validators.required,
                                                            Validators.minLength( environment.MIN_PASSWORD_LENGTH ),
                                                          ],
                                               ],
                                               confirm: [ '', [ Validators.required ] ],
                                             }, { validators: [ MustMatch( 'new', 'confirm' ) ] } );
  }

  async ngOnInit(): Promise<void> {
    this.layoutService.hasSideNav.next( true );
    this.layoutService.showBreadcrumbs.next( true );
    this.profile = await this.getProfile();
    this.prefilForm( this.profile );
  }

  ngOnDestroy() {
    this.layoutService.hasSideNav.next( false );
    this.layoutService.showBreadcrumbs.next( false );
  }

  private prefilForm( profile: IProfile ) {
    this.basicInfoForm.patchValue( {
                                     email    : profile.email,
                                     bio      : profile.bio,
                                     firstname: profile.firstname,
                                     lastname : profile.lastname,
                                   } );
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

  activateBasicInfoForm() {
    this.enableBasicFormFields();
  }

  dismissBasicInfoForm() {
    this.prefilForm( this.profile as IProfile );
    this.disableBasicFormFields();
  }

  enableBasicFormFields() {
    this.basicInfoForm.controls[ 'email' ].enable();
    this.basicInfoForm.controls[ 'bio' ].enable();
    this.basicInfoForm.controls[ 'firstname' ].enable();
    this.basicInfoForm.controls[ 'lastname' ].enable();
  }

  disableBasicFormFields() {
    this.basicInfoForm.controls[ 'email' ].disable();
    this.basicInfoForm.controls[ 'bio' ].disable();
    this.basicInfoForm.controls[ 'firstname' ].disable();
    this.basicInfoForm.controls[ 'lastname' ].disable();
  }


  public async uploadAvatar() {
    await ( this.apollo.mutate( {
                                  mutation : UPLOAD_AVATAR,
                                  variables: { avatar: this.croppedImage },
                                } ).toPromise() );
    this.profile = await this.getProfile( 'no-cache' );

    if ( this.wizard ) this.wizard.reset();

    this.resetAvatarModal();

    this.layoutService.showAlert( {
                                           dismissAfter: 3000,
                                           dismissable : false,
                                           message     : 'Successfully updated avatar',
                                           type        : 'success',
                                         } );
  }

  public async updateProfile() {
    await ( this.apollo.mutate( {
                                  mutation : UPDATE_INFO,
                                  variables: {
                                    email    : this.basicInfoForm?.get( 'email' )?.value as string,
                                    firstname: this.basicInfoForm?.get( 'firstname' )?.value as string,
                                    lastname : this.basicInfoForm?.get( 'lastname' )?.value as string,
                                    bio      : this.basicInfoForm?.get( 'bio' )?.value as string,
                                  },
                                } ).toPromise() )
      .then( () => {
        this.layoutService.showAlert( {
                                               dismissAfter: 3000,
                                               dismissable : false,
                                               message     : 'Successfully updated profile',
                                               type        : 'success',
                                             } );
      } );
    this.profile = await this.getProfile( 'no-cache' );
    this.prefilForm( this.profile );
    this.disableBasicFormFields();
  }

  public async updatePassword() {
    await ( this.apollo.mutate( {
                                  mutation : UPDATE_PASSWORD,
                                  variables: {
                                    old: this.updatePasswordForm?.get( 'old' )?.value as string,
                                    new: this.updatePasswordForm?.get( 'new' )?.value as string,
                                  },
                                } ).toPromise() )
      .then( () => {
        this.layoutService.showAlert( {
                                               dismissAfter: 3000,
                                               dismissable : false,
                                               message     : 'Successfully updated password',
                                               type        : 'success',
                                             } );
      } )
      .catch( ( err ) => {
        if ( err.message.indexOf( 'message: "Invalid password"' ) !== -1 ) {
          this.layoutService.showAlert( {
                                                 dismissAfter: 0,
                                                 dismissable : true,
                                                 message     : 'Invalid password',
                                                 type        : 'danger',
                                               } );
        } else {
          this.layoutService.showAlert( {
                                                 dismissAfter: 0,
                                                 dismissable : true,
                                                 message     : 'Something went wrong',
                                                 type        : 'danger',
                                               } );
        }
      } );
  }

}
