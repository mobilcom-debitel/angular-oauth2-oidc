# @md-connect/angular-oauth2-oidc-native

Support for OAuth 2 and OpenId Connect (OIDC) for Native Apps (RFC 8252) in Angular.

![OIDC Certified Logo](https://raw.githubusercontent.com/manfredsteyer/angular-oauth2-oidc/master/oidc.png)

## Credits

- [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) for the base version of this library
- [generator-angular2-library](https://github.com/jvandemo/generator-angular2-library) for scaffolding an Angular library
- [angular2-jwt](https://github.com/auth0/angular2-jwt) for handling jwts in angular
- [Identity Server](https://github.com/identityserver) (used for testing with an .NET/.NET Core Backend)
- [Keycloak (Redhat)](http://www.keycloak.org/) for testing with Java

## Resources

- Sources and Sample:
https://github.com/mobilcom-debitel/angular-oauth2-oidc-native

- Source Code Documentation
https://github.com/mobilcom-debitel/angular-oauth2-oidc-native/docs (Todo: add native flow changes)

## Tested Environment

Upstream library was successfully tested with **Angular 6** and its Router, PathLocationStrategy as well as HashLocationStrategy and CommonJS-Bundling via webpack. At server side we've used IdentityServer (.NET/ .NET Core) and Redhat's Keycloak (Java).

**Angular 5.x or 4.3**: No versions available.

## Release Cycle

- One major release for each Angular version
    - Will contain new features
    - Will contain bug fixes and PRs
- Critical Bugfixes on a regular basis

## Contributions
- Feel free to file pull requests
- The closed issues contain some ideas for PRs and enhancements (see labels)

# Features 
- Logging in via OAuth2 and OpenId Connect (OIDC) Authorize Code Flow (where a user is redirected to Identity Provider)
- Uses OAuth2 for Native Apps by default (see https://tools.ietf.org/html/rfc8252)
- Uses Proof Key for Code Exchange by OAuth Public Clients by default (see https://tools.ietf.org/html/rfc7636)
- Supports Implicit Flow (must be configured explicitly) 
- "Logging in" via Password Flow (where a user enters their password into the client)
- Token Refresh for Password Flow by using a Refresh Token
- Automatically refreshing a token when/some time before it expires
- Querying Userinfo Endpoint
- Querying Discovery Document to ease configuration
- Validating claims of the id_token regarding the specs
- Hook for further custom validations
- Single-Sign-Out by redirecting to the auth-server's logout-endpoint

## Installing

```
npm i @md-connect/angular-oauth2-oidc-native --save
```

## Importing the NgModule

```TypeScript
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from '@md-connect/angular-oauth2-oidc-native';
// etc.

@NgModule({
  imports: [ 
    // etc.
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    // etc.
  ],
  bootstrap: [
    AppComponent 
  ]
})
export class AppModule {
}
``` 

## Configuring for Authorize Code Flow

This section shows how to implement login leveraging authorization code flow for native apps. 
This is the OAuth2/OIDC flow recommended by rfc8252 for Single Page Application. It sends the user to the Identity Provider's login page. 
After logging in, the SPA gets tokens. This also allows for single sign on as well as single sign off.

To configure the library, you should use the new configuration API.

```TypeScript
import { AuthConfig } from '@md-connect/angular-oauth2-oidc-native';

export const authConfig: AuthConfig = {

  // Url of the Identity Provider
  issuer: 'https://identity.mobilcom-debitel.de/v2/oidc/',

  // URL of the SPA to use as callback for the flow, also redirect the user to after login
  redirectUri: window.location.origin + '/index.html',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: 'spa-demo',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email voucher',
}
```

Configure the OAuthService with this config object when the application starts up:

```TypeScript
import { OAuthService } from '@md-connect/angular-oauth2-oidc-native';
import { JwksValidationHandler } from '@md-connect/angular-oauth2-oidc-native';
import { authConfig } from './auth.config';
import { Component } from '@angular/core';

@Component({
    selector: 'flight-app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    constructor(private oauthService: OAuthService) {
      this.configureWithNewConfigApi();
    }

    private configureWithNewConfigApi() {
      this.oauthService.configure(authConfig);
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }
}
```

### Skipping the Login Form

If you don't want to display a login form that tells the user that they are redirected to the identity server, 
you can use the convenience function ``this.oauthService.loadDiscoveryDocumentAndLogin();`` instead of ``this.oauthService.loadDiscoveryDocumentAndTryLogin();`` when setting up the library. 

This directly redirects the user to the identity server if there are no valid tokens. 


### Calling a Web API with an Access Token

Pass this Header to the used method of the ``Http``-Service within an Instance of the class ``Headers``:

```TypeScript
var headers = new Headers({
    "Authorization": "Bearer " + this.oauthService.getAccessToken()
});
```

If you are using the new ``HttpClient``, use the class ``HttpHeaders`` instead:

```TypeScript
var headers = new HttpHeaders({
    "Authorization": "Bearer " + this.oauthService.getAccessToken()
});
```

You can also automate this task by switching ``sendAccessToken`` on and by setting ``allowedUrls`` to an array with prefixes for the respective URLs. Use lower case for the prefixes.

```TypeScript
OAuthModule.forRoot({
    resourceServer: {
        allowedUrls: ['http://www.angular.at/api'],
        sendAccessToken: true
    }
})
```

## Routing

If you use the ``PathLocationStrategy`` (which is on by default) and have a general catch-all-route (``path: '**'``) you should be fine. Otherwise look up the section ``Routing with the HashStrategy`` in the [documentation](https://manfredsteyer.github.io/angular-oauth2-oidc/docs/).

## More Documentation (not including the native app flow at the moment)

See the [documentation](https://manfredsteyer.github.io/angular-oauth2-oidc/docs/) for more information about this library.

## Tutorials (from the upstream module, not using the native app flow)

* [Tutorial with Demo Servers available online](https://www.softwarearchitekt.at/post/2016/07/03/authentication-in-angular-2-with-oauth2-oidc-and-guards-for-the-newest-new-router-english-version.aspx)
* [Angular Authentication with OpenID Connect and Okta in 20 Minutes](https://developer.okta.com/blog/2017/04/17/angular-authentication-with-oidc)
* [Add Authentication to Your Angular PWA](https://developer.okta.com/blog/2017/06/13/add-authentication-angular-pwa)
* [Build an Ionic App with User Authentication](https://developer.okta.com/blog/2017/08/22/build-an-ionic-app-with-user-authentication)
* [On-Site Workshops](https://www.softwarearchitekt.at)








