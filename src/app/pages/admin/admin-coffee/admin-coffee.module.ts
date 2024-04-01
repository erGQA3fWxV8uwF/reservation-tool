import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { AdminCoffeePage } from "./admin-coffee.page";
import { RouterModule, Routes } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { CdkTable } from "@angular/cdk/table";
import { MatTableModule } from "@angular/material/table";
import { DialogPayComponent } from './dialog-pay/dialog-pay.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import {FillWhitePipe } from "./fill-white.pipe"

const routes: Routes = [
  { path: '', component: AdminCoffeePage } 
];

@NgModule({
  declarations: [AdminCoffeePage, DialogPayComponent],
  imports: [
    TranslateModule,
    NgxChartsModule,

    // Mat
    MatIconModule,
    MatButtonModule,
    MatTableModule,
  
    MatDialogModule,
    

    //Angular

    FillWhitePipe,
    RouterModule.forChild(routes)
  ],})
export class AdminCoffeeModule {}
