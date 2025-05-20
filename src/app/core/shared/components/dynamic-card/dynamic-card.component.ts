import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
@Component({
  selector: 'app-dynamic-card',
  imports: [MatCardModule, MatButtonModule, MatChipsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dynamic-card.component.html',
  styleUrl: './dynamic-card.component.scss'
})
export class DynamicCardComponent implements OnInit {
ngOnInit(): void {
  console.log(this.image());
}


title = input<string>();
description = input<string>();
image = input<string>();
data = input<string[]>();
}
