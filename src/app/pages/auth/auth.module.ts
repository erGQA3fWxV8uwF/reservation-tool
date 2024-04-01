import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TranslateModule } from "@ngx-translate/core";
import { LoginPage } from "./login/login.page";

@NgModule({
  declarations: [LoginPage],
  imports: [
    TranslateModule,
    // Mat
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatRippleModule,
  ],
  providers: [],
})
export class AuthModule {}
