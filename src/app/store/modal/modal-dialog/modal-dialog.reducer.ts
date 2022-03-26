import { createReducer, on } from '@ngrx/store';
import {ModalAddItem} from "../modal-add-item";
import * as ModalDialogAction from './modal-dialog.actions';


export const featureKey = 'modalDialog';

export interface ModalDialogState {
  enable: boolean;
  load: boolean;
  child: ModalAddItem;
  value: any;
  title: any;
  error: any;
}

export const initialState: ModalDialogState = {
  enable: false,
  load: false,
  title: null,
  value: null,
  child: {} as ModalAddItem,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(ModalDialogAction.changeModal, (state: ModalDialogState, action): ModalDialogState => {
    return {
      ...state,
      enable: true,
      load: false,
      title: action.title,
      child: action.child,
      value: null
    };
  }),
  on(ModalDialogAction.changeChildrenView, (state: ModalDialogState, action): ModalDialogState => {
    return {
      ...state,
      enable: true,
      load: false,
      title: action.title,
      child: action.child,
      value: action.value
    };
  }),
  on(ModalDialogAction.closeModal, (state: ModalDialogState): ModalDialogState => {
    return {
      ...state,
      enable: false,
      load: false,
      title: null,
      child: {} as ModalAddItem,
      error: null,
      value: null
    };
  }),
  on(ModalDialogAction.startLoaded, (state: ModalDialogState, action): ModalDialogState => {
    return {
      ...state,
      load: true,
      value: null
    };
  }),
  on(ModalDialogAction.closeLoaded, (state: ModalDialogState, action): ModalDialogState => {
    return {
      ...state,
      load: false,
      value: null
    };
  }),
);
