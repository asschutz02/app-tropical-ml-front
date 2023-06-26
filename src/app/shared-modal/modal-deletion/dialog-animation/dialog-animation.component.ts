import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {LojistaService} from "../../../lojistas/service/lojista-service";
import {NicknameService} from "../../../nickname/service/nickname-service";
import {ProductService} from "../../../products/service/product-service";
import {SellerService} from "../../../sellers/service/seller-service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dialog-animation',
  templateUrl: './dialog-animation.component.html',
  styleUrls: ['./dialog-animation.component.css']
})
export class DialogAnimationComponent implements OnInit, OnDestroy {

  subscription: Subscription[] = [];

  success = false;
  error = false;

  @Input() entityToBeDeleted?: string;
  @Input() type?: string;

  constructor(public dialogRef: MatDialogRef<DialogAnimationComponent>,
              private lojistaService: LojistaService,
              private nicknameService: NicknameService,
              private produtoService: ProductService,
              private sellerService: SellerService,) {}

  ngOnInit(): void {
  }

  deletarEntidade() {
    switch (this.type) {
      case 'Lojista':
        this.subscription.push(this.lojistaService.deleteLojista(this.entityToBeDeleted)
          .subscribe(() => {
            this.success = true;
        },error => {
              console.log(error);
              this.error = true;
            }
          ));
        break;
      case 'Produto':
        this.subscription.push(this.produtoService.deleteProduct(this.entityToBeDeleted).subscribe(() => {
            this.success = true;
          },error => {
            console.log(error);
            this.error = true;
          }
        ));
        break;
      case 'Nickname':
        this.subscription.push(this.nicknameService.deleteNickname(this.entityToBeDeleted).subscribe(() => {
            this.success = true;
          },error => {
            console.log(error);
            this.error = true;
          }
        ));
        break;
      case 'Vendedor':
        this.subscription.push(this.sellerService.deleteSeller(this.entityToBeDeleted).subscribe(() => {
            this.success = true;
          },error => {
            console.log(error);
            this.error = true;
          }
        ));
        break;
    }
  }

  closeSuccess(): void {
    this.success = false;
  }

  closeError(): void {
    this.error = false;
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

}
