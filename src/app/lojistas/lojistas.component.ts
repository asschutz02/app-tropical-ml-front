import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {LojistaService} from "./service/lojista-service";
import {LojistaModel} from "./model/lojista.model";
import {Sorter} from "../helper/sorter";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.state";
import {MatDialog} from "@angular/material/dialog";
import {DialogAnimationComponent} from "../shared-modal/modal-deletion/dialog-animation/dialog-animation.component";

@Component({
  selector: 'app-lojistas',
  templateUrl: './lojistas.component.html',
  styleUrls: ['./lojistas.component.css']
})
export class LojistasComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];

  lojistas: LojistaModel[] = [];
  filteredList: LojistaModel[] = [];

  alreadyExists = false;

  panelOpenState = false;

  formEdit = this.fb.group({
    editLojista: new FormControl(null,[Validators.required])
  });

  form = this.fb.group({
    filter: new FormControl(null,null),
    lojista: new FormControl(null,[Validators.required]),
  });

  success = false;
  error = false;

  successUpdate = false;
  errorUpdate = false;

  constructor(private store: Store<AppState>, private dialog: MatDialog,
              private service: LojistaService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.subscription.push(this.service.findAllLojista().subscribe(lojistas => {
      this.lojistas = lojistas.sort(Sorter.dynamycSort("lojista"));
    }));
  }

  cadastrarLojista(): void {
    this.verifyIfExists();
    if(!this.alreadyExists) {
      if (this.form.get('lojista')?.value !== null) {
        this.subscription.push(this.service.createLojista(this.form.get('lojista')?.value.toLowerCase()).subscribe(() => {
            this.success = true;
            this.form.get('lojista')?.reset();
            this.findAll();
          },
          error => {
            console.log(error);
            this.error = true;
          }));
      }
    }
  }

  editarLojista(lojistaEdit: string | undefined): void {
    if(this.formEdit.get('editLojista')?.value !== null){
      this.subscription.push(this.service.editLojista(lojistaEdit?.toLowerCase(), this.formEdit.get('editLojista')?.value.toLowerCase()).subscribe(() => {
          this.successUpdate = true;
          this.formEdit.get('editLojista')?.reset();
          this.findAll();
      },
        error => {
          console.log(error);
          this.errorUpdate = true;
        }));
    }
  }

  filterList(): LojistaModel[] {
    this.filteredList = this.lojistas.filter(nick => nick.lojista?.match(this.form.get('filter')?.value));

    return this.filteredList;
  }

  openModalToDelete(lojista: string): void {
    let dialogRef = this.dialog.open(DialogAnimationComponent, {});
    let instance = dialogRef.componentInstance;
    instance.entityToBeDeleted = lojista;
    instance.type = 'Lojista';
  }

  verifyIfExists() {
    if (this.form.get("name")?.value !== null) {
      let there = this.lojistas.some(l => l.lojista === this.form.get("lojista")?.value);
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
