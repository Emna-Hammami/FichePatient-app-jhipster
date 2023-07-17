import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IHopital } from '../hopital.model';
import { HopitalService } from '../service/hopital.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './hopital-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class HopitalDeleteDialogComponent {
  hopital?: IHopital;

  constructor(protected hopitalService: HopitalService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.hopitalService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
