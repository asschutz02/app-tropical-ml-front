import {Component, OnDestroy, OnInit} from '@angular/core';
import {SellerModel} from "./model/seller.model";
import {SellerService} from "./service/seller-service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Sorter} from "../helper/sorter";

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

  constructor(private service: SellerService, private fb: FormBuilder) { }

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
          this.form.get('name')?.reset();
          this.findAll();
        }));
      }
    }
  }

  editarVendedor(nameEdit: string | undefined): void {
    if(this.formEdit.get('editName')?.value !== null){
      this.subscription.push(this.service.editSeller(nameEdit?.toLowerCase(), this.formEdit.get('editName')?.value.toLowerCase()).subscribe(() => {
        this.formEdit.get('editName')?.reset();
        this.findAll();
      }));
    }
  }

  deleteVendedor(nameEdit: string | undefined): void {
    this.subscription.push(this.service.deleteSeller(nameEdit).subscribe(() => {
      this.findAll();
    }));
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
}
