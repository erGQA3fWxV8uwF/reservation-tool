import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateModule } from "@ngx-translate/core";
import { AdminRoomBuildPage } from "./admin-room-build.page";
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { HelpDialogComponent } from "./help-dialog/help-dialog.component";
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, NgModel } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [AdminRoomBuildPage, DeleteDialogComponent, HelpDialogComponent],
  imports: [
    TranslateModule,

    // Mat
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatButtonModule,

    // Angular 
    FormsModule,
    CommonModule,

    RouterModule

  ],
})
export class AdminRoomBuildModule {}
