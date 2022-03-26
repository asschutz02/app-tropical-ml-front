import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import { Store } from '@ngrx/store';
import {SharedModalDialogComponent} from "../shared-modal/shared-modal-dialog/shared-modal-dialog.component";
import { AppState } from '../store/app.state';
import { ModalAddItem } from '../store/modal/modal-add-item';
import * as ModalDialogAction from "../store/modal/modal-dialog/modal-dialog.actions";
import {NicknameComponent} from "../nickname/nickname.component";
import {ProductsComponent} from "../products/products.component";
import {SellersComponent} from "../sellers/sellers.component";
import {HeaderService} from "./service/header-service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];

  constructor(private store: Store<AppState>, private dialog: MatDialog, private service: HeaderService) { }

  ngOnInit(): void {
  }

  openModalNicknames(): void {
    this.store.dispatch(ModalDialogAction.changeModal({
      title: 'Nicknames',
      child: new ModalAddItem(NicknameComponent)
    }));
    this.openDialog();
  }

  openModalProducts(): void {
    this.store.dispatch(ModalDialogAction.changeModal({
      title: 'Produtos',
      child: new ModalAddItem(ProductsComponent)
    }));
    this.openDialog();
  }

  openModalSellers(): void {
    this.store.dispatch(ModalDialogAction.changeModal({
      title: 'Vendedores',
      child: new ModalAddItem(SellersComponent)
    }));
    this.openDialog();
  }

  protected openDialog(): void {
    this.dialog.open(SharedModalDialogComponent, {});
  }

  gerarRelatorio(): void {
    this.subscription.push(this.service.gerarRelatorio().subscribe());
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}
