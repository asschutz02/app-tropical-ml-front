import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {ModalDialogState} from "../../store/modal/modal-dialog/modal-dialog.reducer";
import {ModalDirective} from "./modal.directive";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.state";
import {getFeatureModalState} from "../../store/modal/modal-dialog/modal-dialog-selector.selectors";
import {isPlatformBrowser} from "@angular/common";
import * as ModalAction from "../../store/modal/modal-dialog/modal-dialog.actions";
import {MatDialog} from "@angular/material/dialog";
import {ModalAddItem} from "../../store/modal/modal-add-item";

@Component({
  selector: 'app-shared-modal-dialog',
  templateUrl: './shared-modal-dialog.component.html',
  styleUrls: ['./shared-modal-dialog.component.scss']
})
export class SharedModalDialogComponent  implements OnInit, OnDestroy {
  align: string = 'center';
  modalState$: Observable<ModalDialogState>;
  componentRef?: ComponentRef<any>;
  @ViewChild(ModalDirective, {static: false}) myRef?: ModalDirective;
  modalStateSubscription?: Subscription;

  constructor(
    private store: Store<AppState>,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(PLATFORM_ID) private platformId: any,
    public dialog: MatDialog
  ) {
    this.modalState$ = this.store.select(getFeatureModalState);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.componentRef?.destroy();
    }
    this.modalStateSubscription?.unsubscribe();
    this.dialog?.ngOnDestroy();
  }

  ngOnInit(): void {
    this.changeStateModal();
    this.detectClose();
  }

  changeStateModal(): void {
    this.modalStateSubscription = this.modalState$.subscribe(value => {
      if (value?.enable) {
        this.loadComponent(value.child);
      } else {
        this.dialog.closeAll()
      }
    });
  }

  detectClose(): void {
    this.dialog.afterAllClosed.subscribe(value => this.close());
  }

  close = (): void => this.store.dispatch(ModalAction.closeModal());

  private loadComponent(childComponent: ModalAddItem): void {
    setTimeout(() => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(childComponent.component);
      const viewContainerRef = this.myRef?.viewContainerRef;
      viewContainerRef?.clear();
      this.componentRef = viewContainerRef?.createComponent(componentFactory);
    }, 100);
  }
}
