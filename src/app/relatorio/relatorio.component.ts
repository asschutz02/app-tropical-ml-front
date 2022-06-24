import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Sorter} from "../helper/sorter";
import {ProductService} from "../products/service/product-service";
import {ProductModel} from "../products/model/product.model";
import {registerLocaleData} from "@angular/common";
import localePt from "@angular/common/locales/pt";
import {ThemePalette} from "@angular/material/core";
import {FormBuilder, FormControl} from "@angular/forms";
import {HeaderService} from "../header/service/header-service";

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit, OnDestroy {

  constructor(private service: ProductService, private fb: FormBuilder, private headerService: HeaderService) {}

  filteredList: ProductModel[] = [];
  color: ThemePalette = 'primary';
  subscription: Subscription[] = [];
  products: ProductModel[] = [];
  listRequest: ProductModel[] = [];

  loading = false;
  success = false;
  error = false;

  form = this.fb.group({
    filter: new FormControl(null,null),
  });

  ngOnInit(): void {
    registerLocaleData(localePt);
    this.findAll();
  }

  findAll(): void {
    this.subscription.push(this.service.findAllProducts().subscribe(prods => {
      this.products = prods.sort(Sorter.dynamycSort("name"));
    }));
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  buildRequest(product: ProductModel): void {
    console.log('this.products.length: ', this.products.length);
    const filter: ProductModel[] = this.listRequest.filter(p => product.name === p.name);

    if (filter.length === 0 ) {
      this.listRequest.push(product);
    } else {
      const index = this.listRequest.indexOf(product);
      this.listRequest.splice(index, 1);
    }

    console.log('request: ', this.listRequest);
  }

  gerarRelatorio(): void {
    this.loading = true;
    this.subscription.push(this.headerService.gerarRelatorio(this.listRequest).subscribe(() => {
        this.success = true;
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        this.error = true;
      }));
  }

  filterList(): ProductModel[] {
    this.filteredList = this.products.filter(nick => nick.name?.match(this.form.get('filter')?.value));

    return this.filteredList;
  }

  setAll(): void {
    const sizeAll = this.products.length;
    const request = this.listRequest.length;

    if (sizeAll !== request) {
      this.listRequest = [];
      this.products.forEach(p => this.listRequest.push(p));
      console.log('lista', this.listRequest);
      this.listRequest.forEach(p => p.checked = true);
    } else {
      this.listRequest.forEach(p => p.checked = false);
      this.listRequest = [];
      console.log('lista', this.listRequest);
    }
  }

  closeSuccess(): void {
    this.success = false;
  }

  closeError(): void {
    this.error = false;
  }
}
