import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './home/home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {HeaderComponent} from './header/header.component';
import {SharedModalDialogComponent} from "./shared-modal/shared-modal-dialog/shared-modal-dialog.component";
import {ModalDirective} from "./shared-modal/shared-modal-dialog/modal.directive";
import {StoreModule} from '@ngrx/store';
import {MaterialModule} from "./material/material.module";
import {NicknameComponent} from './nickname/nickname.component';
import {reducers} from "./store/root.reducer";
import {ProductsComponent} from './products/products.component';
import {SellersComponent} from './sellers/sellers.component';
import {NicknameService} from "./nickname/service/nickname-service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ProductService} from "./products/service/product-service";
import {SellerService} from "./sellers/service/seller-service";
import {HeaderService} from "./header/service/header-service";
import {HomeService} from "./home/service/home-service";
import {IConfig, NgxMaskModule} from "ngx-mask";
import { LojistasComponent } from './lojistas/lojistas.component';
import {LojistaService} from "./lojistas/service/lojista-service";
import { RelatorioComponent } from './relatorio/relatorio.component';
import {MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions} from "@angular/material/checkbox";

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SharedModalDialogComponent,
    ModalDirective,
    NicknameComponent,
    ProductsComponent,
    SellersComponent,
    LojistasComponent,
    RelatorioComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MaterialModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    NgxMaskModule.forRoot(maskConfig),
  ],
  providers: [
    NicknameService,
    ProductService,
    SellerService,
    HeaderService,
    HomeService,
    LojistaService,
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check' } as MatCheckboxDefaultOptions}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
