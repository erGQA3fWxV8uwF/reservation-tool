import { CommonModule, NgStyle } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { RoomsPage } from "./rooms.page";
import { MatFormFieldModule } from "@angular/material/form-field";

@NgModule({
  declarations: [RoomsPage],
  imports: [
    // Mat
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,

    // Angular
    RouterModule,
    NgStyle,
    CommonModule,

    TranslateModule
  ],
  providers: [],
  exports: [RoomsPage],
})
export class RoomsModule {}
