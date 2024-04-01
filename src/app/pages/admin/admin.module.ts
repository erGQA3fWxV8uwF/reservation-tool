import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { AdminPage } from "./admin.page";
import { CommonModule } from "@angular/common";
import { RouterModule, RouterOutlet, Routes } from "@angular/router";
 

@NgModule({
  declarations: [AdminPage],
  imports: [
    TranslateModule,
    CommonModule,
    
    // Mat
    MatIconModule,
    RouterModule,
    RouterOutlet,
  ],
  providers: [],
})
export class AdminModule {}
 