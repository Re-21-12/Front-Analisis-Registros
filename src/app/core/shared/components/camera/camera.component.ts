import { AfterViewInit, Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  imports: [MatButtonModule, NgClass]
})
export class CameraComponent implements AfterViewInit, OnDestroy {
  @Input() field: any;
  @Input() form: any;
  @Output() imageCaptured = new EventEmitter<string | null>();

  WIDTH = 640;
  HEIGHT = 480;
  cameraActive = false;
  cameraVisible = true;
  stream: MediaStream | null = null;

  @ViewChild('video', { static: false }) video?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas?: ElementRef<HTMLCanvasElement>;

  captures: string[] = [];
  error: any = null;
  isCaptured = false;
  currentBase64Image: string | null = null;

  constructor(private http: HttpClient) {}

  async ngAfterViewInit() {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      tempStream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn('Camera access check failed:', err);
    }
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async activateCamera() {
    if (this.cameraActive) return;

    try {
      this.cameraActive = true;
      this.cameraVisible = true;
      await this.setupDevices();
    } catch (err) {
      this.handleCameraError(err);
    }
  }

  deactivateCamera() {
    this.stopCamera();
    this.cameraActive = false;
    this.cameraVisible = false;
    this.isCaptured = false;
    this.currentBase64Image = null;
    this.imageCaptured.emit(null);
  }

  private handleCameraError(err: any) {
    console.error('Camera error:', err);
    this.error = err.message || 'No se pudo acceder a la cámara';
    this.cameraActive = false;
  }

  toggleCameraVisibility() {
    this.cameraVisible = !this.cameraVisible;
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.video?.nativeElement) {
      this.video.nativeElement.srcObject = null;
    }
  }

  async setupDevices() {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.error = 'Camera API not supported in this browser';
      return;
    }

    try {
      this.stopCamera();
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: this.WIDTH },
          height: { ideal: this.HEIGHT },
          facingMode: 'environment'
        }
      });

      if (this.video?.nativeElement) {
        this.video.nativeElement.srcObject = this.stream;
        await this.video.nativeElement.play();
        this.error = null;
      }
    } catch (err) {
      this.handleCameraError(err);
    }
  }

  capture() {
    if (!this.video?.nativeElement || !this.canvas?.nativeElement) return;

    this.drawImageToCanvas(this.video.nativeElement);
    const base64Image = this.canvas.nativeElement.toDataURL('image/jpeg', 0.8);
    this.currentBase64Image = base64Image;
    this.imageCaptured.emit(base64Image);

    if (this.captures.length >= 3) {
      this.captures.pop();
    }
    this.captures.unshift(base64Image);

    this.isCaptured = true;
  }

  /**
   * Obtiene la imagen actual en formato base64
   * @returns {string | null} La imagen en base64 o null si no hay imagen capturada
   */
  getCurrentImage(): string | null {
    return this.currentBase64Image;
  }

  removeCurrent() {
    this.isCaptured = false;
    this.currentBase64Image = null;
    this.cameraVisible = true;
    this.imageCaptured.emit(null);
  }

  setPhoto(idx: number) {
    if (idx < 0 || idx >= this.captures.length) return;

    this.currentBase64Image = this.captures[idx];
    const img = new Image();
    img.src = this.captures[idx];
    img.onload = () => {
      this.drawImageToCanvas(img);
      this.isCaptured = true;
      this.imageCaptured.emit(this.currentBase64Image);
    };
  }

  drawImageToCanvas(image: HTMLImageElement | HTMLVideoElement) {
    const context = this.canvas?.nativeElement?.getContext('2d');
    if (!context || !this.canvas?.nativeElement) return;
    context.drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  getPureBase64(): string | null {
    if (!this.currentBase64Image) return null;
    return this.currentBase64Image.split(',')[1];
  }

  getImageBlob(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.currentBase64Image) {
        resolve(null);
        return;
      }

      fetch(this.currentBase64Image)
        .then(res => res.blob())
        .then(blob => resolve(blob))
        .catch(() => resolve(null));
    });
  }
}
