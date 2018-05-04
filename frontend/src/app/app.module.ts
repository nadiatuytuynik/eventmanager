import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import {AlertService, AuthenticationService, RegistrationService, UserService} from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { LandingPageComponent } from './landing-page/index';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { CreateEventComponent } from './create-event/create-event.component';
import {EventService} from "./_services/event.service";
import { EventlistComponent } from './eventlist/eventlist.component';
import { RegistrationConfirmComponent } from './registration-confirm/registration-confirm.component';
import { ProfileComponent } from './profile/profile.component';
import { VnavbarComponent } from './vnavbar/vnavbar.component';
import { SendLinkComponent } from './reset-password/send-link/send-link.component';
import {ResetPasswordService} from "./_services/reset-password.service";
import { ResetComponent } from './reset-password/reset/reset.component';
import {NavbarService} from "./_services/navbar.service";
import { EventComponent } from './event/event.component';
import { UpdateEventComponent } from './update-event/update-event.component';
import { FolderListComponent } from './folder-list/folder-list.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    BrowserAnimationsModule,
    ReCaptchaModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    LandingPageComponent,
    NavbarComponent,
    FooterComponent,
    CreateEventComponent,
    EventlistComponent,
    RegistrationConfirmComponent,
    ProfileComponent,
    VnavbarComponent,
    SendLinkComponent,
    ResetComponent,
    EventComponent,
    UpdateEventComponent,
    FolderListComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    EventService,
    RegistrationService,
    ResetPasswordService,
    NavbarService,
    // provider used to create fake backend
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
