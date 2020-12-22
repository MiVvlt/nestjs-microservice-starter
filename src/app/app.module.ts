import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routes';
import { PublicLayoutModule } from './layout/public-layout/public-layout.module';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthLayoutModule } from './layout/auth-layout/auth-layout.module';
import { PublicLayoutService } from './services/public-layout.service';
import {
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';


import { onError } from '@apollo/client/link/error';
import { GraphQLModule } from './graphql.module';

const link = onError( ( {
                          graphQLErrors,
                          networkError,
                        } ) => {
  if ( graphQLErrors ) {
    graphQLErrors.map( ( {
                           message,
                           locations,
                           path,
                         } ) => {
      console.error( `Location: ${ locations }, Path: ${ path }` );
      console.error( `[GraphQL error]: Message: ${ message }` );
    } );
  }

  if ( networkError ) {
    console.log( `[Network error]: ${ networkError }` );
  }
} );

export function HttpLoaderFactory( http: HttpClient ) {
  return new TranslateHttpLoader( http, './assets/i18n/', '.json' );
}

@NgModule( {
             declarations: [ AppComponent ],
             imports     : [ BrowserModule,
                             BrowserAnimationsModule,
                             ClarityModule,
                             PublicLayoutModule,
                             AuthLayoutModule,
                             RouterModule.forRoot( AppRoutes ),
                             HttpClientModule,
                             GraphQLModule,
                             TranslateModule.forRoot( {
                                                        defaultLanguage: 'en',
                                                        loader         : {
                                                          provide   : TranslateLoader,
                                                          useFactory: HttpLoaderFactory,
                                                          deps      : [ HttpClient ],
                                                        },
                                                      } ),
             ],
             providers   : [ PublicLayoutService ],
             bootstrap   : [ AppComponent ],
           } )
export class AppModule {
}
