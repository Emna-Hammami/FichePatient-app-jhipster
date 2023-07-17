import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IStatistique } from '../statistique.model';
import { StatistiqueService } from '../service/statistique.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './statistique-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class StatistiqueDeleteDialogComponent {
  statistique?: IStatistique;

  constructor(protected statistiqueService: StatistiqueService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.statistiqueService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
