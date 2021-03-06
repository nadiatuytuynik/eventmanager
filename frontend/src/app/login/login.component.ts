import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from "../_services";
import {NavbarService} from "../_services/navbar.service";

declare const gapi: any;

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, AfterViewInit {

  model: any = {};
  loading = false;
  returnUrl: string;
  public auth2: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private navbarService: NavbarService,
              private userService: UserService,
              private zone: NgZone) {
  }

  ngOnInit() {
    if (sessionStorage.getItem('currentToken')) {
      this.authenticationService.logout();
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    console.log(this.returnUrl);
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '882385907365-t3b1b4nieo5c2rna6ejf862eadkho2s2.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        this.signInGoogle(googleUser);
      }, (error) => {
        this.alertService.error(error.error);
      });
  }

  login() {
    this.loading = true;
    let userAuthParam = {
      login: this.model.username,
      password: this.model.password
    };
    this.authenticationService.login(userAuthParam)
      .subscribe(() => {
          this.userService.getByLogin(JSON.parse(sessionStorage.getItem('currentToken')).login).subscribe(
            user => {
              return this.processResult(user);
            });
        }
        , () => {
          this.alertService.error('Invalid credentials');
          this.loading = false;
          return this.router.navigate(['/login']);
        });
  }

  signInGoogle(googleUser) {
    this.authenticationService.signInGoogle(googleUser)
      .subscribe(() => {
          this.userService.getByLogin(JSON.parse(sessionStorage.getItem('currentToken')).login).subscribe(
            user => {
              return this.processResult(user);
            });
        }
        , () => {
          this.alertService.error('Something wrong during signing in with your Google account');
          this.loading = false;
          return this.router.navigate(['/login']);
        });
  }

  processResult(user) {
    console.log("In Google Login Subscribe");
    console.log(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('newLogin', JSON.stringify(sessionStorage));
    this.loading = false;
    this.navbarService.setNavBarState(true);
    console.log('Changed navbar state');
    localStorage.removeItem('newLogin');
    this.zone.run(() => this.router.navigate([this.returnUrl]));
  }
}
