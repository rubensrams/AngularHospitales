import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './login/register.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuardGuard } from './guardas/login-guard.guard';
import { VerificaTokenGuard } from './guardas/verifica-token.guard';



const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    // Para el lazy load las paginas del pages routes se configuran aqui
    { path: '',
               canActivate: [LoginGuardGuard],
               canActivateChild: [ VerificaTokenGuard],
                component: PagesComponent,
              // children: [{}] ASi se manda de forma anterior, pero usar load children para forma dinamica
              // Path al modulo que se quiere de forma dinamica
              loadChildren: './pages/pages.modulo#PagesModule'
    },
    { path: '**', component: NopagefoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, {useHash: true});