import { CommonModule, NgClass } from '@angular/common'
import { NgModule } from '@angular/core'
import { CoreModule } from '@angular/flex-layout'
import { FormsModule } from '@angular/forms'
import { MatOptionModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { TranslateModule } from '@ngx-translate/core'
import { DialogLogOutComponent } from './dialog-log-out/dialog-log-out.component'
import { SettingsPage } from './settings.page'
import { MatButtonModule } from '@angular/material/button'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

@NgModule({
  declarations: [SettingsPage, DialogLogOutComponent],
  imports: [
    TranslateModule,

    // Mat
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatSlideToggleModule,

    //Angular
    CoreModule,
    NgClass,
    FormsModule,
    CommonModule,

  ],
  providers: [
  
  ],
})
export class SettingsModule {}
