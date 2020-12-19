import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppComponent} from "../../app.component";

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {map} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

// We use the gql tag to parse our query string into a query document
const LOGIN = gql`
  query login($email: String!, $password: String!) {
    login(credentials: {
      email: $email,
      password: $password
    }) {
      accessToken
    }
  }
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public productName: string = AppComponent.productName

  constructor(private readonly fb: FormBuilder,
              private apollo: Apollo,
              private authService: AuthService,
              private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  public ngOnInit(): void {
  }

  public async submit() {
    let token: string | null = null;
    try {
      token = (await this.submitLoginQuery(this.loginForm.getRawValue())).accessToken
      this.authService.setAccessToken(token as string);
      this.router.navigate(['/auth/home']);
    } catch (err) {
      this.failedToLogin(err);
    }
    if (token) {
      console.info(token)
    }
  }

  private submitLoginQuery(formData: { email: string, password: string }): Promise<{ accessToken: string | null }> {
    return new Promise((resolve, reject) => {
      this.apollo.watchQuery({
        query: LOGIN, variables: {
          email: formData.email,
          password: formData.password
        },

      })
        .valueChanges
        .pipe(map((result) => {
          return {
            accessToken: (result as any).data.login.accessToken
          }
        }))
        .subscribe((result) => {
          resolve(result);
        }, (err) => {
          reject(err);
        });
    })
  }

  failedToLogin(error: any) {
    console.error(error);
  }

}
