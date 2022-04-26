import {Component, OnDestroy, OnInit} from '@angular/core';
import {NicknameModel} from "./model/nickname.model";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {NicknameService} from "./service/nickname-service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.css']
})
export class NicknameComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];

  nicknames: NicknameModel[] = [];
  filteredNickList: NicknameModel[] = [];
  filteredLojistaList: NicknameModel[] = [];
  filteredVendedorList: NicknameModel[] = [];

  panelOpenState = false;

  formEdit = this.fb.group({
    editNickname: new FormControl(null,null),
    editVendedor: new FormControl(null,null),
    editLojista: new FormControl(null, null)
  });

  form = this.fb.group({
    filterNick: new FormControl(null,null),
    filterLojista: new FormControl(null,null),
    filterVendedor: new FormControl(null,null),
    nickname: new FormControl(null,[Validators.required]),
    vendedor: new FormControl(null,[Validators.required]),
    lojista: new FormControl(null,[Validators.required]),
  });

  constructor(private service: NicknameService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.subscription.push(this.service.findAllNicknames().subscribe(response => {
      this.nicknames = response;
    }));
  }

  cadastrarNickname(): void {
    if(this.form.get('nickname')?.value !== null && this.form.get('vendedor')?.value !== null
      && this.form.get('lojista')?.value){
      this.subscription.push(this.service.createNickname(this.form.get('nickname')?.value.toLowerCase(),
        this.form.get('vendedor')?.value.toLowerCase(), this.form.get('lojista')?.value.toLowerCase())
        .subscribe(() => {
        this.form.reset();
        this.findAll();
      }));
    }
  }

  editarNickname(nicknameEdit: string | undefined): void {
    if(this.formEdit.get('editNickname')?.value !== null || this.formEdit.get('editVendedor')?.value !== null ||
      this.formEdit.get('editLojista')?.value !== null){
      this.subscription.push(this.service.editNickname(nicknameEdit?.toLowerCase(), this.formEdit.get('editNickname')?.value?.toLowerCase(),
        this.formEdit.get('editVendedor')?.value?.toLowerCase(), this.formEdit.get('editLojista')?.value?.toLowerCase())
        .subscribe(() => {
        this.formEdit.reset();
        this.findAll();
      }));
    }
  }

  gerarRelatorio(): void {
    this.subscription.push(this.service.gerarRelatorio().subscribe());
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

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  validateEditForm(): string {
    if(this.formEdit.get('editNickname')?.value == null && this.formEdit.get('editVendedor')?.value == null
      && this.formEdit.get('editLojista')?.value == null){
      return 'div-button opacity';
    } else {
      return 'div-button';
    }
  }
}
