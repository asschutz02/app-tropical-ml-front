import * as fromModalDialog from './modal-dialog.actions';

describe('loadModalDialogs', () => {
  it('should return an action', () => {
    expect(fromModalDialog.loadModalDialogs().type).toBe('[ModalDialog] Load ModalDialogs');
  });
});
