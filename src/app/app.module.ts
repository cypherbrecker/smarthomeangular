import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire/compat'
import { environment } from 'src/environments/environment.development';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { initializeApp } from "firebase/app";
import { FormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DevicesComponent } from './component/devices/devices.component';
import { InformationsComponent } from './component/informations/informations.component';
import { AddDeviceComponent } from './component/devices/add-device/add-device.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import { DeleteDeviceComponent } from './component/devices/delete-device/delete-device.component';
/*import { ViewDeviceComponent } from './component/devices/view-device/view-device.component';*/
import { ConfigDeviceComponent } from './component/devices/config-device/config-device.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';







@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    SidebarComponent,
    DevicesComponent,
    InformationsComponent,
    AddDeviceComponent,
    DeleteDeviceComponent,
   /* ViewDeviceComponent,*/
    ConfigDeviceComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDHdsF8JdwclUp9QdBmxmMYDZQHlgDiax4",
      authDomain: "smarthomeangular-91886.firebaseapp.com",
      projectId: "smarthomeangular-91886",
      storageBucket: "smarthomeangular-91886.appspot.com",
      messagingSenderId: "966646889329",
      appId: "1:966646889329:web:54cd765548e132fe2c94d0",
      measurementId: "G-T80PFXFTND"
    }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatTabsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    MatDialogModule,
    MatGridListModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
