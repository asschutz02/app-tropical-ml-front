import * as fromModalDialog from './modal/modal-dialog/modal-dialog.reducer';
import {AppState} from "./app.state";
import {ActionReducerMap} from "@ngrx/store";

export const reducers: ActionReducerMap<AppState> = {
  [fromModalDialog.featureKey]: fromModalDialog.reducer,
};
