import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {NicknameModel} from "../nickname/model/nickname.model";
import {ProductModel} from "./model/product.model";
import {registerLocaleData} from "@angular/common";
import localePt from '@angular/common/locales/pt';
import {ProductService} from "./service/product-service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];

  products: ProductModel[] = [];
  filteredList: ProductModel[] = [];

  filtro?: string;
  panelOpenState = false;

  form = this.fb.group({
    filter: new FormControl(null,[Validators.required]),
    name: new FormControl(null,[Validators.required]),
    price: new FormControl(null,[Validators.required]),
    editName: new FormControl(null,[Validators.required]),
    editPrice: new FormControl(null,[Validators.required]),
  });

  constructor(private service: ProductService, private fb: FormBuilder) { }

  ngOnDestroy(): void {
        this.subscription.forEach(subs => subs.unsubscribe());
    }

  ngOnInit(): void {
    registerLocaleData(localePt);
    this.findAll();
  }

  findAll(): void {
    this.subscription.push(this.service.findAllProducts().subscribe(prods => {
      this.products = prods;
    }));
  }

  cadastrarProduto(): void {
    if(this.form.get('name')?.value !== null && this.form.get('price')?.value !== null){
      this.subscription.push(this.service.createProduct
      (this.form.get('name')?.value, this.form.get('price')?.value).subscribe(() => {
        this.form.get('name')?.reset();
        this.form.get('price')?.reset();
        this.findAll();
      }));
    }
  }

  editarProduto(nameEdit: string | undefined): void {
    if(this.form.get('editName')?.value !== null && this.form.get('editPrice')?.value !== null){
      this.subscription.push(this.service.editProduct(nameEdit,
        this.form.get('editName')?.value, this.form.get('editPrice')?.value).subscribe(() => {
        this.form.get('editName')?.reset();
        this.form.get('editPrice')?.reset();
        this.findAll();
      }));
    }
  }

  deleteProduto(name: string | undefined): void {
    this.subscription.push(this.service.deleteProduct(name).subscribe(() => {
      this.findAll();
    }));
  }

  filterList(): NicknameModel[] {
    this.filteredList = this.products.filter(nick => nick.name === this.form.get('filter')?.value);

    return this.filteredList;
  }
}
