import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuardGuard } from './auth.guard.guard';
import { DevicesComponent } from './component/devices/devices.component';
import { InformationsComponent } from './component/informations/informations.component';



const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  /*Itt az authguard a dashboard/devices, dashboard/informations url eket kezeli, tehat ez megfelel a legalabb 2 kulonbozonek.*/
  { path: 'dashboard',  component: DashboardComponent, canActivate: [AuthGuardGuard], children : [
    {path: '', redirectTo:'informations', pathMatch:'full'},
    {path: 'devices', component: DevicesComponent},
    {path: 'informations', component: InformationsComponent}
  ] },
  {path:'register', component: RegisterComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
