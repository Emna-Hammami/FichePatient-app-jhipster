import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IFicheP } from '../fiche-p.model';
import { FichePService } from '../service/fiche-p.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './fiche-p-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FichePDeleteDialogComponent {
  ficheP?: IFicheP;

  constructor(protected fichePService: FichePService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fichePService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
