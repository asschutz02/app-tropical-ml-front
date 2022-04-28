import {Component, OnDestroy, OnInit} from '@angular/core';
import {NicknameModel} from "./model/nickname.model";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {NicknameService} from "./service/nickname-service";
import {Subscription} from "rxjs";
import {LojistaService} from "../lojistas/service/lojista-service";
import {LojistaModel} from "../lojistas/model/lojista.model";
import {SellerService} from "../sellers/service/seller-service";
import {SellerModel} from "../sellers/model/seller.model";
import {Sorter} from "../helper/sorter";

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.css']
})
export class NicknameComponent implements OnInit, OnDestroy {

  loading = false;
  success = false;
  error = false;

  subscription: Subscription[] = [];

  lojistaSelected: string | undefined = undefined;
  sellerSelected: string | undefined= undefined;

  lojistaEditSelected: string | undefined = undefined;
  sellerEditSelected: string | undefined = undefined;

  lojistas: LojistaModel[] = [];
  nicknames: NicknameModel[] = [];
  sellers: SellerModel[] = [];

  filteredNickList: NicknameModel[] = [];
  filteredLojistaList: NicknameModel[] = [];
  filteredVendedorList: NicknameModel[] = [];

  panelOpenState = false;

  formEdit = this.fb.group({
    editNickname: new FormControl(null,null),
    // editVendedor: new FormControl(null,null),
    // editLojista: new FormControl(null, null)
  });

  form = this.fb.group({
    filterNick: new FormControl(null,null),
    filterLojista: new FormControl(null,null),
    filterVendedor: new FormControl(null,null),
    nickname: new FormControl(null,[Validators.required]),
  });

  constructor(private service: NicknameService, private fb: FormBuilder,
              private lojistaService: LojistaService, private vendedorService: SellerService) { }

  ngOnInit(): void {
    this.findAll();
    this.findAllLojistas();
    this.findAllSellers();
  }

  findAllSellers(): void {
    this.subscription.push(this.vendedorService.findAllSellers().subscribe(sell => {
      this.sellers = sell.sort(Sorter.dynamycSort("name"));
    }));
  }

  findAllLojistas(): void{
    this.subscription.push(this.lojistaService.findAllLojista().subscribe(loj => {
      this.lojistas = loj.sort(Sorter.dynamycSort("lojista"));
    }));
  }

  findAll(): void {
    this.subscription.push(this.service.findAllNicknames().subscribe(response => {
      this.nicknames = response.sort(Sorter.dynamycSort("nickname"));
    }));
  }

  cadastrarNickname(): void {
    if(this.form.get('nickname')?.value !== null && this.sellerSelected !== undefined
      && this.lojistaSelected !== undefined){
      this.subscription.push(this.service.createNickname(this.form.get('nickname')?.value.toLowerCase(),
        this.sellerSelected?.toLowerCase(), this.lojistaSelected?.toLowerCase())
        .subscribe(() => {
        this.form.reset();
        this.findAll();
      }));
    }
  }

  editarNickname(nicknameEdit: string | undefined): void {
    if(this.formEdit.get('editNickname')?.value !== null || this.sellerEditSelected !== undefined
      || this.lojistaEditSelected !== undefined){
      this.subscription.push(this.service.editNickname(nicknameEdit?.toLowerCase(), this.formEdit.get('editNickname')?.value?.toLowerCase(),
        this.sellerEditSelected?.toLowerCase(), this.lojistaEditSelected?.toLowerCase())
        .subscribe(() => {
        this.formEdit.reset();
        this.findAll();
      }));
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

  deleteNickname(nickname: string | undefined): void {
    this.subscription.push(this.service.deleteNickname(nickname).subscribe(() => {
      this.findAll();
    }));
  }

  filterNickList(): NicknameModel[] {
    this.filteredNickList = this.nicknames.filter(nick => nick.nickname === this.form.get('filterNick')?.value);

    this.filteredVendedorList = [];
    this.filteredLojistaList = [];
    this.form.get('filterVendedor')?.reset();
    this.form.get('filterLojista')?.reset();

    return this.filteredNickList;
  }

  filterVendedorList(): NicknameModel[] {
    this.filteredVendedorList = this.nicknames.filter(nick => nick.customerBy === this.form.get('filterVendedor')?.value);

    this.filteredLojistaList = [];
    this.filteredNickList = [];
    this.form.get('filterNick')?.reset();
    this.form.get('filterLojista')?.reset();

    return this.filteredVendedorList;
  }

  filterLojistaList(): NicknameModel[] {
    this.filteredLojistaList = this.nicknames.filter(nick => nick.lojista === this.form.get('filterLojista')?.value);

    this.filteredVendedorList = [];
    this.filteredNickList = [];
    this.form.get('filterNick')?.reset();
    this.form.get('filterVendedor')?.reset();

    return this.filteredLojistaList;
  }

  setLojista(lojista: string | undefined): void {
    this.lojistaSelected = lojista;
  }

  setEditLojista(lojista: string | undefined): void {
    this.lojistaEditSelected = lojista;
  }

  setSeller(seller: string | undefined): void {
    this.sellerSelected = seller;
  }

  setEditSeller(seller: string | undefined): void {
    this.sellerEditSelected = seller;
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  validateEditForm(): string {
    if(this.formEdit.get('editNickname')?.value == null && this.sellerEditSelected == undefined
      && this.lojistaEditSelected == undefined){
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
