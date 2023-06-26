import {Component, OnDestroy, OnInit} from '@angular/core';
import {SellerModel} from "./model/seller.model";
import {SellerService} from "./service/seller-service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Sorter} from "../helper/sorter";
import {MatDialog} from "@angular/material/dialog";
import {DialogAnimationComponent} from "../shared-modal/modal-deletion/dialog-animation/dialog-animation.component";

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.css']
})
export class SellersComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];

  sellers: SellerModel[] = [];
  filteredList: SellerModel[] = [];

  panelOpenState = false;
  alreadyExists = false;

  formEdit = this.fb.group({
    editName: new FormControl(null,[Validators.required])
  });

  form = this.fb.group({
    filter: new FormControl(null,null),
    name: new FormControl(null,[Validators.required]),
  });

  success = false;
  error = false;

  successUpdate = false;
  errorUpdate = false;

  constructor(private service: SellerService, private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.subscription.push(this.service.findAllSellers().subscribe(sellers => {
      this.sellers = sellers.sort(Sorter.dynamycSort("name"));
    }));
  }

  cadastrarVendedor(): void {
    this.verifyIfExists();
    if(!this.alreadyExists) {
      this.alreadyExists =  false;
      if(this.form.get('name')?.value !== null){
        this.subscription.push(this.service.createSeller(this.form.get('name')?.value.toLowerCase()).subscribe(() => {
            this.success = true;
            this.form.get('name')?.reset();
          this.findAll();
        },
          error => {
            console.log(error);
            this.error = true;
          }));
      }
    }
  }

  editarVendedor(nameEdit: string | undefined): void {
    if(this.formEdit.get('editName')?.value !== null){
      this.subscription.push(this.service.editSeller(nameEdit?.toLowerCase(), this.formEdit.get('editName')?.value.toLowerCase()).subscribe(() => {
        this.successUpdate = true;
        this.formEdit.get('editName')?.reset();
        this.findAll();
      },
        error => {
          console.log(error);
          this.errorUpdate = true;
        }));
    }
  }

  openModalToDelete(vendedor: string | undefined): void {
    let dialogRef = this.dialog.open(DialogAnimationComponent, {});
    let instance = dialogRef.componentInstance;
    instance.entityToBeDeleted = vendedor;
    instance.type = 'Vendedor';
  }

  filterList(): SellerModel[] {
    this.filteredList = this.sellers.filter(nick => nick.name?.match(this.form.get('filter')?.value));

    return this.filteredList;
  }

  verifyIfExists() {
    if (this.form.get("name")?.value !== null) {
      let there = this.sellers.some(s => s.name === this.form.get("name")?.value);
      if(there) {
        this.alreadyExists = true;
        this.form.invalid;
      } else {
        this.alreadyExists = false;
        this.form.valid;
      }
    }
  }

  setAlreadyState(): void {
    this.alreadyExists = false;
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  closeSuccess(): void {
    this.success = false;
  }

  closeError(): void {
    this.error = false;
  }

  closeSuccessUpdate(): void {
    this.successUpdate = false;
  }

  closeErrorUpdate(): void {
    this.errorUpdate = false;
  }
}
