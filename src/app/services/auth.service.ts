import {Injectable} from '@angular/core';
import * as jwtDecode from "jwt-decode";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'TOKEN';

  constructor(private http: HttpClient) {
  }

  getCachedAccessToken() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    try {

      // check token expiration
      const now = Math.round(new Date().getTime() / 1000);
      const expiration = ((jwtDecode.default(token as string) as { exp: number }).exp)
      if (now > expiration) {
        localStorage.removeItem(this.TOKEN_KEY)
        return null;
      }

      return token;
    } catch (err) {
      return null;
    }
  }

  public logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    return (this.http.get(environment.BFF_URL + 'auth/logout', {withCredentials: true}).toPromise());
  }

  public setAccessToken(token: string) {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  async acquireToken() {
    const {accessToken} =
      await (this.http.post(environment.BFF_URL + 'auth/refresh_token', {}, {withCredentials: true}).toPromise()) as { accessToken: string };

    if (accessToken) {
      localStorage.setItem(this.TOKEN_KEY, accessToken)
    } else {
      localStorage.removeItem(this.TOKEN_KEY)
    }
  }
}
