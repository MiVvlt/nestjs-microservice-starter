import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
  Apollo,
  APOLLO_OPTIONS,
} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import {
  InMemoryCache,
  ApolloLink,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

const uri = environment.BFF_URL + 'graphql';

const publicOperations = [ 'login', 'register' ];

export function createApollo( httpLink: HttpLink, authService: AuthService ) {
  const basic = setContext( ( operation, context ) => ( {
    headers: {
      Accept: 'charset=utf-8',
    },
  } ) );

  const auth = setContext( async ( _, { headers } ) => {

    if ( publicOperations.indexOf( _.operationName as string ) !== -1 ) {
      return;
    }

    // Grab token if there is one in storage or hasn't expired
    let token = authService.getCachedAccessToken();

    if ( !token ) {
      await authService.acquireToken();
      token = authService.getCachedAccessToken();
    }
    // Return the headers as usual
    return {
      headers: {
        Authorization: `Bearer ${ token }`,
      },
    };
  } );

  const link  = ApolloLink.from( [ basic, auth, httpLink.create( { uri, withCredentials: true } ) ] );
  const cache = new InMemoryCache();

  return {
    link, cache,
  };
}

@NgModule( {
             exports     : [ HttpClientModule,
             ], providers: [ {
    provide: APOLLO_OPTIONS, useFactory: createApollo, deps: [ HttpLink, AuthService ],
  },
  ],
           } )
export class GraphQLModule {
}
