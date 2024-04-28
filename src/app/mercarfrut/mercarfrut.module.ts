import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MercarfrutRoutingModule } from './mercarfrut-routing.module';
import { MercarfrutComponent } from './mercarfrut.component';
import { IndexComponent } from './pages/index/index.component';
import { HeaderComponent } from '../common/components/header/header.component';
import { FooterComponent } from '../common/components/footer/footer.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopComponent } from './pages/shop/shop.component';

@NgModule({
  declarations: [
    MercarfrutComponent,
    IndexComponent,
    HeaderComponent,
    FooterComponent,
    AddProductComponent,
    ShopComponent
  ],
  imports: [
    CommonModule,
    MercarfrutRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  providers: []
})
export class MercarfrutModule { }
