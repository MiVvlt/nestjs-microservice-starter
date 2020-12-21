import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routes';
import { PublicLayoutModule } from './layout/public-layout/public-layout.module';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthLayoutModule } from './layout/auth-layout/auth-layout.module';
import { PublicLayoutService } from './services/public-layout.service';
import { HttpClientModule } from '@angular/common/http';


import { onError } from '@apollo/client/link/error';
import { GraphQLModule } from './graphql.module';

const link = onError( ( { graphQLErrors, networkError } ) => {
  if ( graphQLErrors ) {
    graphQLErrors.map( ( { message, locations, path } ) => {
      console.error( `Location: ${ locations }, Path: ${ path }` );
      console.error( `[GraphQL error]: Message: ${ message }` );
    } );
  }

  if ( networkError ) {
    console.log( `[Network error]: ${ networkError }` );
  }
} );

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
             ],
             providers   : [ PublicLayoutService ],
             bootstrap   : [ AppComponent ],
           } )
export class AppModule {
}
