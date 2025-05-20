import { Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-copy-clipboard',
 imports: [MatButtonModule, MatIconModule, MatTooltipModule, ClipboardModule, MatIconModule],
  templateUrl: './copy-clipboard.component.html',
  styleUrl: './copy-clipboard.component.scss'
})
export class CopyClipboardComponent {
 // Input signal requerido
  text = input.required<string>();

  // Input signals opcionales con valores por defecto
  tooltipLabel = input('Copiar al portapapeles');
  successTooltip = input('¡Copiado!');
  successDuration = input(2000); // Duración en ms del feedback
  icon = input('content_copy');
  successIcon = input('check');
  buttonClass = input('');

  // Output event
  copied = output<void>();

  // Estado interno
  protected isCopied = signal(false);

  // Computed properties
  protected currentTooltip = computed(() =>
    this.isCopied() ? this.successTooltip() : this.tooltipLabel()
  );

  protected currentIcon = computed(() =>
    this.isCopied() ? this.successIcon() : this.icon()
  );

  onCopy() {
    this.isCopied.set(true);
    this.copied.emit();

    setTimeout(() => {
      this.isCopied.set(false);
    }, this.successDuration());
  }
}
