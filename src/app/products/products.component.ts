import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ProductModel} from "./model/product.model";
import {registerLocaleData} from "@angular/common";
import localePt from '@angular/common/locales/pt';
import {ProductService} from "./service/product-service";
import {Subscription} from "rxjs";
import {Sorter} from "../helper/sorter";
import {DialogAnimationComponent} from "../shared-modal/modal-deletion/dialog-animation/dialog-animation.component";
import {MatDialog} from "@angular/material/dialog";

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

  alreadyExists = false;

  products: ProductModel[] = [];
  filteredList: ProductModel[] = [];

  panelOpenState = false;

  formEdit = this.fb.group({
    editName: new FormControl(null, null),
    editPrice: new FormControl(null, null)
  })

  form = this.fb.group({
    filter: new FormControl(null, null),
    name: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
  });

  successRegister = false;
  errorRegister = false;

  successUpdate = false;
  errorUpdate = false;

  constructor(private service: ProductService, private fb: FormBuilder, private dialog: MatDialog) {
  }

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
    this.verifyIfExists();
    if (!this.alreadyExists) {
      if (this.form.get('name')?.value !== null && this.form.get('price')?.value !== null) {
        const priceString = this.form.get('price')?.value;
        if (priceString.includes(',')) {
          let price = priceString.replace(',', '.');
          this.subscription.push(
            this.service.createProduct(this.form.get('name')?.value.toLowerCase(), price).subscribe(() => {
              this.successRegister = true;
              this.findAll();
            },
              error => {
                console.log(error);
                this.errorRegister = true;
              }));
          this.form.reset();
        } else {
          this.subscription.push(this.service.createProduct
          (this.form.get('name')?.value.toLowerCase(), this.form.get('price')?.value).subscribe(() => {
            this.successRegister = true;
            this.findAll();
            this.form.reset();
          },
            error => {
              console.log(error);
              this.errorRegister = true;
            }));
        }
      }
    }
  }

  editarProduto(nameEdit: string | undefined): void {
    if (this.formEdit.get('editName')?.value !== null || this.formEdit.get('editPrice')?.value !== null) {
      if (this.formEdit.get('editPrice')?.value !== null) {
        const priceString = this.formEdit.get('editPrice')?.value;
        if (priceString.includes(',')) {
          let price = priceString.replace(',', '.');
          this.subscription.push(
            this.service.editProduct(nameEdit?.toLowerCase(), this.formEdit.get('editName')?.value?.toLowerCase(), price).subscribe(() => {
              this.successUpdate = true;
              this.findAll();
            },
              error => {
                console.log(error);
                this.errorUpdate = true;
              }));
          this.formEdit.reset();
        } else {
          this.subscription.push(this.service.editProduct(nameEdit?.toLowerCase(),
            this.formEdit.get('editName')?.value?.toLowerCase(), this.formEdit.get('editPrice')?.value).subscribe(() => {
              this.successUpdate = true;
              this.formEdit.reset();
            this.findAll();
          },
            error => {
              console.log(error);
              this.errorUpdate = true;
            }));
        }
      } else {
        this.subscription.push(this.service.editProduct(nameEdit?.toLowerCase(),
          this.formEdit.get('editName')?.value?.toLowerCase(), this.formEdit.get('editPrice')?.value).subscribe(() => {
            this.successUpdate = true;
            this.formEdit.reset();
          this.findAll();
        },
          error => {
            console.log(error);
            this.errorUpdate = true;
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

  filterList(): ProductModel[] {
    this.filteredList = this.products.filter(nick => nick.name?.match(this.form.get('filter')?.value));

    return this.filteredList;
  }

  validateEditForm(): string {
    if (this.formEdit.get('editName')?.value == null && this.formEdit.get('editPrice')?.value == null) {
      return 'div-button opacity';
    } else {
      return 'div-button';
    }
  }

  verifyIfExists() {
    if (this.form.get("name")?.value !== null) {
      let there = this.products.some(p => p.name === this.form.get("name")?.value);
      if (there) {
        this.alreadyExists = true;
        this.form.invalid;
      } else {
        this.alreadyExists = false;
        this.form.valid;
      }
    }
  }

  openModalToDelete(produto: string | undefined): void {
    let dialogRef = this.dialog.open(DialogAnimationComponent, {});
    let instance = dialogRef.componentInstance;
    instance.entityToBeDeleted = produto;
    instance.type = 'Produto';
  }

  setAlreadyState(): void {
    this.alreadyExists = false;
  }

  closeSuccess(): void {
    this.success = false;
  }

  closeError(): void {
    this.error = false;
  }

  closeSuccessRegister(): void {
    this.successRegister = false;
  }

  closeErrorRegister(): void {
    this.errorRegister = false;
  }

  closeSuccessUpdate(): void {
    this.successUpdate = false;
  }

  closeErrorUpdate(): void {
    this.errorUpdate = false;
  }
}
