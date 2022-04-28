import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {LojistaService} from "./service/lojista-service";
import {LojistaModel} from "./model/lojista.model";
import {Sorter} from "../helper/sorter";

@Component({
  selector: 'app-lojistas',
  templateUrl: './lojistas.component.html',
  styleUrls: ['./lojistas.component.css']
})
export class LojistasComponent implements OnInit {

  subscription: Subscription[] = [];

  lojistas: LojistaModel[] = [];
  filteredList: LojistaModel[] = [];

  panelOpenState = false;

  formEdit = this.fb.group({
    editLojista: new FormControl(null,[Validators.required])
  });

  form = this.fb.group({
    filter: new FormControl(null,null),
    lojista: new FormControl(null,[Validators.required]),
  });

  constructor(private service: LojistaService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.subscription.push(this.service.findAllLojista().subscribe(lojistas => {
      this.lojistas = lojistas.sort(Sorter.dynamycSort("lojista"));
    }));
  }

  cadastrarVendedor(): void {
    if(this.form.get('lojista')?.value !== null){
      this.subscription.push(this.service.createLojista(this.form.get('lojista')?.value.toLowerCase()).subscribe(() => {
        this.form.get('lojista')?.reset();
        this.findAll();
      }));
    }
  }

  editarVendedor(lojistaEdit: string | undefined): void {
    if(this.formEdit.get('editLojista')?.value !== null){
      this.subscription.push(this.service.editLojista(lojistaEdit?.toLowerCase(), this.formEdit.get('editLojista')?.value.toLowerCase()).subscribe(() => {
        this.formEdit.get('editLojista')?.reset();
        this.findAll();
      }));
    }
  }

  deleteVendedor(lojistaEdit: string | undefined): void {
    this.subscription.push(this.service.deleteLojista(lojistaEdit).subscribe(() => {
      this.findAll();
    }));
  }

  filterList(): LojistaModel[] {
    this.filteredList = this.lojistas.filter(nick => nick.lojista === this.form.get('filter')?.value);

    return this.filteredList;
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

}
