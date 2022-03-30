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
  filteredList: NicknameModel[] = [];

  filtro?: string;
  panelOpenState = false;

  formEdit = this.fb.group({
    editNickname: new FormControl(null,null),
    editVendedor: new FormControl(null,null)
  });

  form = this.fb.group({
    filter: new FormControl(null,null),
    nickname: new FormControl(null,[Validators.required]),
    vendedor: new FormControl(null,[Validators.required]),
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
    if(this.form.get('nickname')?.value !== null && this.form.get('vendedor')?.value !== null){
      this.subscription.push(this.service.createNickname(this.form.get('nickname')?.value.toLowerCase(),
        this.form.get('vendedor')?.value.toLowerCase()).subscribe(() => {
        this.form.reset();
        this.findAll();
      }));
    }
  }

  editarNickname(nicknameEdit: string | undefined): void {
    if(this.formEdit.get('editNickname')?.value !== null || this.formEdit.get('editVendedor')?.value !== null){
      this.subscription.push(this.service.editNickname(nicknameEdit!.toLowerCase(), this.formEdit.get('editNickname')?.value.toLowerCase(),
        this.formEdit.get('editVendedor')?.value.toLowerCase()).subscribe(() => {
        this.formEdit.reset();
        this.findAll();
      }));
    }
  }

  deleteNickname(nickname: string | undefined): void {
    this.subscription.push(this.service.deleteNickname(nickname).subscribe(() => {
      this.findAll();
    }));
  }

  filterList(): NicknameModel[] {
    this.filteredList = this.nicknames.filter(nick => nick.nickname === this.form.get('filter')?.value);

    return this.filteredList;
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  validateEditForm(): string {
    if(this.formEdit.get('editNickname')?.value == null && this.formEdit.get('editVendedor')?.value == null){
      return 'div-button opacity';
    } else {
      return 'div-button';
    }
  }
}
