import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Sorter} from "../helper/sorter";
import {ProductService} from "../products/service/product-service";
import {ProductModel} from "../products/model/product.model";
import {registerLocaleData} from "@angular/common";
import localePt from "@angular/common/locales/pt";
import {ThemePalette} from "@angular/material/core";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {HeaderService} from "../header/service/header-service";

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit, OnDestroy {

  constructor(private service: ProductService, private fb: FormBuilder, private headerService: HeaderService) {}

  filteredList: ProductModel[] = [];
  fullList: boolean | undefined;
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
    this.setToFalse();
  }

  findAll(): void {
    this.subscription.push(this.service.findAllProducts().subscribe(prods => {
      this.products = prods.sort(Sorter.dynamycSort("name"));
    }));
  }

  setToFalse(): void {
    this.listRequest.forEach(p => p.checked = true);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  buildRequest(product: ProductModel): void {
    const filter = this.listRequest.filter(p => p.name == product.name);

    if (filter.length == 0) {
      console.log('caí no == 0');
      console.log('fullList: ', this.fullList);
      this.listRequest.push(product);
      product.checked = true;
      if (this.listRequest.length == 4) {
        console.log('caí no == 4');
        this.fullList = true;
        console.log('fullList: ', this.fullList);
      } else if (this.listRequest.length == 5) {
      console.log('caí no == 5');
      const index = this.listRequest.indexOf(product);
      this.listRequest.splice(index, 1);
      this.fullList = false;
      console.log('fullList: ', this.fullList);
        product.checked = false;
      }
    } else {
      // (filter.length > 0)
      console.log('caí no > 0');
      console.log('fullList: ', this.fullList);
      const index = this.listRequest.indexOf(product);
      this.listRequest.splice(index, 1);
      product.checked = false;
    }
    console.log('lista atual: ', this.listRequest);
  }

  editRequest(): void {
    this.fullList = false;
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

  calculoQtdProduto(): string {

    var quantidadeASerSelecionado = (4 - this.listRequest.length);

    return quantidadeASerSelecionado.toString();
  }

  validaPalavraProduto(): string {
    var quantidadeASerSelecionado = (4 - this.listRequest.length);
    if (this.listRequest.length < 4 && quantidadeASerSelecionado !== 1) {
      return 'produtos';
    } else {
      return 'produto';
    }
  }

  closeSuccess(): void {
    this.success = false;
  }

  closeError(): void {
    this.error = false;
  }
}
