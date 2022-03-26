import {createAction, props} from '@ngrx/store';
import {ModalAddItem} from "../modal-add-item";

export const loadModalDialogs = createAction(
  '[ModalDialog] Load ModalDialogs'
);
export const changeModal = createAction(
  '[ModalDialog] Set new State',
  props<{ title: any, child: ModalAddItem}>()
);

export const closeModal = createAction(
  '[ModalDialog] Close Modal',
);

export const changeChildrenView = createAction(
  '[ModalDialog] Change children view',
  props<{ title: any, child: ModalAddItem, value?: any }>()
);

export const modalFailure = createAction(
  '[ModalDialog] Failure update',
  props<{ error: any }>()
);

export const startLoaded = createAction(
  '[ModalDialog] Start loaded',
);

export const closeLoaded = createAction(
  '[ModalDialog] Close loaded',
);
