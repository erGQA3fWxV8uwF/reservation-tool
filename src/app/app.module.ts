import { NgxChartsModule } from "@swimlane/ngx-charts";
import { AppComponent } from "./app.component";
import { NavBarComponent } from "./shared/nav-bar/nav-bar.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from "src/environments/environment.development";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { AuthService } from "./core/services/auth.service";
import { ReservationService } from "./core/services/reservation.service";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogRef } from "@angular/material/dialog";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    NavBarComponent,
    MatIconModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new TranslateHttpLoader(http, "./assets/i18n/", ".json"),
        deps: [HttpClient],
      },
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    DragDropModule,
  ],
  providers: [
    AuthService,
    ReservationService,
    {
      provide: MatDialogRef,
      useValue: {},
    },
    { provide: MAT_DATE_LOCALE, useValue: "de-ch" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setDefaultLang("en");
    translate.use("en");
  }
}
