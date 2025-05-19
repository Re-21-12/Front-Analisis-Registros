import { TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [MatTableModule, TitleCasePipe, MatIconModule, MatButtonModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent implements OnInit {

  private destroyRef$ = inject(DestroyRef);

  @Input() dataSource$: Observable<any[]> | undefined;
  dataSource = signal<any[]>([]);

  @Input() displayedColumns$: Observable<string[]> | undefined;
  displayedColumns = signal<string[]>([]);

  emitData = output<any>();

  ngOnInit(): void {
    this.initializeSubscribe();
  }

  initializeSubscribe() {
    this.dataSource$?.pipe(
      takeUntilDestroyed(this.destroyRef$)
    ).subscribe({
      next: (data: any[]) => {
        this.dataSource.set(data);
      },
      error: (err) => console.error('Error loading table data', err)
    });

    this.displayedColumns$?.pipe(
      takeUntilDestroyed(this.destroyRef$)
    ).subscribe({
      next: (columns: string[]) => {
        this.displayedColumns.set(columns);
      },
      error: (err) => console.error('Error loading column data', err)
    });
  }
  sendData(type: 'view'| 'upd'| 'del', data: any) {
    console.log('Data sent to parent component:', type, data);
    this.emitData.emit({ type, data });

  }

}
