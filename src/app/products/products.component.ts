import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {NicknameModel} from "../nickname/model/nickname.model";
import {ProductModel} from "./model/product.model";
import {registerLocaleData} from "@angular/common";
import localePt from '@angular/common/locales/pt';
import {ProductService} from "./service/product-service";
import {Subscription} from "rxjs";
import {Sorter} from "../helper/sorter";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  loading = false;
  success = false;
  error = false;

  subscription: Subscription[] = [];

  products: ProductModel[] = [];
  filteredList: ProductModel[] = [];

  panelOpenState = false;

  formEdit = this.fb.group({
    editName: new FormControl(null,null),
    editPrice: new FormControl(null,null)
  })

  form = this.fb.group({
    filter: new FormControl(null,null),
    name: new FormControl(null,[Validators.required]),
    price: new FormControl(null,[Validators.required]),
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
      this.products = prods.sort(Sorter.dynamycSort("name"));
    }));
  }

  cadastrarProduto(): void {
    if(this.form.get('name')?.value !== null && this.form.get('price')?.value !== null){
      const priceString = this.form.get('price')?.value;
      if(priceString.includes(',')) {
        let price = priceString.replace(',', '.');
        this.subscription.push(
          this.service.createProduct(this.form.get('name')?.value.toLowerCase(), price).subscribe(() => {
            this.findAll();
          }));
        this.form.reset();
      } else {
        this.subscription.push(this.service.createProduct
        (this.form.get('name')?.value.toLowerCase(), this.form.get('price')?.value).subscribe(() => {
          this.findAll();
          this.form.reset();
        }));
      }
    }
  }

  editarProduto(nameEdit: string | undefined): void {
    if(this.formEdit.get('editName')?.value !== null || this.formEdit.get('editPrice')?.value !== null){
      if(this.formEdit.get('editPrice')?.value !== null){
        const priceString = this.formEdit.get('editPrice')?.value;
        if(priceString.includes(',')) {
          let price = priceString.replace(',', '.');
          this.subscription.push(
            this.service.editProduct(nameEdit?.toLowerCase(),this.formEdit.get('editName')?.value?.toLowerCase(), price).subscribe(() => {
              this.findAll();
            }));
          this.formEdit.reset();
        } else {
          this.subscription.push(this.service.editProduct(nameEdit?.toLowerCase(),
            this.formEdit.get('editName')?.value?.toLowerCase(), this.formEdit.get('editPrice')?.value).subscribe(() => {
            this.formEdit.reset();
            this.findAll();
          }));
        }
      } else {
        this.subscription.push(this.service.editProduct(nameEdit?.toLowerCase(),
          this.formEdit.get('editName')?.value?.toLowerCase(), this.formEdit.get('editPrice')?.value).subscribe(() => {
          this.formEdit.reset();
          this.findAll();
        }));
      }
    }
  }

  gerarRelatorio(): void {
    this.loading = true;
    this.subscription.push(this.service.gerarRelatorio().subscribe(() => {
        this.success = true;
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        this.error = true;
      }));
  }

  deleteProduto(name: string | undefined): void {
    this.subscription.push(this.service.deleteProduct(name).subscribe(() => {
      this.findAll();
    }));
  }

  filterList(): ProductModel[] {
    this.filteredList = this.products.filter(nick => nick.name === this.form.get('filter')?.value);

    return this.filteredList;
  }

  validateEditForm(): string {
    if(this.formEdit.get('editName')?.value == null && this.formEdit.get('editPrice')?.value == null){
      return 'div-button opacity';
    } else {
      return 'div-button';
    }
  }

  closeSuccess(): void {
    this.success = false;
  }

  closeError(): void {
    this.error = false;
  }
}
