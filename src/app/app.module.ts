import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/*RUTAS*/
import { APP_ROUTES } from './app.routes';

/*MODULOS*/


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component'; 
import { PagesModule } from './pages/pages.modulo';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    APP_ROUTES
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
