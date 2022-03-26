import {createFeatureSelector, createSelector} from '@ngrx/store';

import * as fromModalDialog from './modal-dialog.reducer';

export const getFeatureModalState = createFeatureSelector<fromModalDialog.ModalDialogState>(
  fromModalDialog.featureKey
);

export const getModalValue = createSelector(
  getFeatureModalState,
  state => state.value
);
