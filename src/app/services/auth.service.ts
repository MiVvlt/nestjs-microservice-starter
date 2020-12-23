import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import {
  HttpClient,
} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable( {
               providedIn: 'root',
             } )
export class AuthService {
  private readonly TOKEN_KEY: string = 'TOKEN';

  constructor( private http: HttpClient ) {
  }

  getCachedAccessToken() {
    const token: string | null = localStorage.getItem( this.TOKEN_KEY );
    try {
      const now        = Math.round( new Date().getTime() / 1000 ); // current timestamp
      const expiration = ( ( jwtDecode.default( token as string ) as { exp: number } ).exp ); // token expiration
                                                                                              // timestamp

      // check token expiration
      if ( now > expiration ) {
        localStorage.removeItem( this.TOKEN_KEY );
        return null;
      }

      // return token if not expired
      return token;

    } catch ( err ) {

      // any other errors
      return null;

    }
  }

  public async isAuthenticated() {
    try {
      // Check if we have a valid accesstoken, if so, return true
      let cached = await this.getCachedAccessToken();
      if ( cached ) {
        return true;
      }

      // otherwise, we might need to refresh our token, so let's first try that
      try {
        await this.acquireToken();
        // if we successfully refreshed our token, we can let the user pass
        return true;
      } catch ( err ) {
        return false;
      }
    } catch ( err ) {

      // if any other errors are thrown, catch them and return false
      return false;
    }
  }

  public logout() {
    localStorage.removeItem( this.TOKEN_KEY );
    return ( this.http.get( environment.BFF_URL + 'auth/logout', { withCredentials: true } ).toPromise() );
  }

  public setAccessToken( token: string ) {
    if ( token ) {
      localStorage.setItem( this.TOKEN_KEY, token );
    }
  }

  async acquireToken() {
    const { accessToken } = await ( this.http.post( environment.BFF_URL + 'auth/refresh_token', '', {
      withCredentials: true,
    } ).toPromise() ) as { accessToken: string };

    if ( accessToken ) {
      localStorage.setItem( this.TOKEN_KEY, accessToken );
    } else {
      localStorage.removeItem( this.TOKEN_KEY );
    }
  }
}
