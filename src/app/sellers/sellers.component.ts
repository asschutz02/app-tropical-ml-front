import {Component, OnDestroy, OnInit} from '@angular/core';
import {NicknameModel} from "../nickname/model/nickname.model";
import {SellerModel} from "./model/seller.model";
import {SellerService} from "./service/seller-service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.css']
})
export class SellersComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];

  sellers: SellerModel[] = [];
  filteredList: SellerModel[] = [];

  filtro?: string;
  panelOpenState = false;

  form = this.fb.group({
    filter: new FormControl(null,[Validators.required]),
    name: new FormControl(null,[Validators.required]),
    editName: new FormControl(null,[Validators.required]),
  });

  constructor(private service: SellerService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.subscription.push(this.service.findAllSellers().subscribe(sellers => {
      this.sellers = sellers;
    }));
  }

  cadastrarVendedor(): void {
    if(this.form.get('name')?.value !== null){
      this.subscription.push(this.service.createSeller(this.form.get('name')?.value).subscribe(() => {
        this.form.get('name')?.reset();
        this.findAll();
      }));
    }
  }

  editarVendedor(nameEdit: string | undefined): void {
    if(this.form.get('editName')?.value !== null){
      this.subscription.push(this.service.editSeller(nameEdit, this.form.get('editName')?.value).subscribe(() => {
        this.form.get('editName')?.reset();
        this.findAll();
      }));
    }
  }

  deleteVendedor(nameEdit: string | undefined): void {
    this.subscription.push(this.service.deleteProduct(nameEdit).subscribe(() => {
      this.findAll();
    }));
  }

  filterList(): NicknameModel[] {
    this.filteredList = this.sellers.filter(nick => nick.name === this.form.get('filter')?.value);

    return this.filteredList;
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
