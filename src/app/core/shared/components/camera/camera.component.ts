import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-camera',
  standalone: true,
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  imports: [MatButtonModule]
})
export class CameraComponent implements AfterViewInit {
  WIDTH = 640;
  HEIGHT = 480;
  cameraActive = false;
  cameraVisible = true;
  stream: MediaStream | null = null;

  @ViewChild('video', { static: false })
  video?: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas', { static: false })
  canvas?: ElementRef<HTMLCanvasElement>;

  captures: string[] = [];
  error: any = null;
  isCaptured = false;
  currentBase64Image: string | null = null;

  constructor(private http: HttpClient) {}

  async ngAfterViewInit() {
    // Don't automatically activate camera
  }

  async activateCamera() {
    this.cameraActive = true;
    this.cameraVisible = true;
    await this.setupDevices();
  }

  deactivateCamera() {
    this.stopCamera();
    this.cameraActive = false;
    this.cameraVisible = false;
    this.isCaptured = false;
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
      this.error = 'Camera not supported';
      return;
    }

    try {
      this.stopCamera(); // Stop any existing stream

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: this.WIDTH },
          height: { ideal: this.HEIGHT }
        }
      });

      if (this.video?.nativeElement) {
        this.video.nativeElement.srcObject = this.stream;
        await this.video.nativeElement.play();
        this.error = null;
      }
    } catch (e) {
      this.error = e;
      this.cameraActive = false;
    }
  }

  capture() {
    if (!this.video?.nativeElement || !this.canvas?.nativeElement) return;

    this.drawImageToCanvas(this.video.nativeElement);
    const base64Image = this.canvas.nativeElement.toDataURL('image/jpeg', 0.8);
    this.currentBase64Image = base64Image;

    if (this.captures.length >= 3) {
      // Replace the last element if we have 3 already
      this.captures[this.captures.length - 1] = base64Image;
    } else {
      // Add normally if we haven't reached the limit
      this.captures.push(base64Image);
    }

    this.isCaptured = true;
  }

  removeCurrent() {
    this.isCaptured = false;
    this.currentBase64Image = null;
    this.cameraVisible = true;
  }

  setPhoto(idx: number) {
    const img = new Image();
    img.src = this.captures[idx];
    this.currentBase64Image = this.captures[idx];
    this.drawImageToCanvas(img);
    this.isCaptured = true;
  }

  drawImageToCanvas(image: HTMLImageElement | HTMLVideoElement) {
    const context = this.canvas?.nativeElement?.getContext('2d');
    if (!context) return;
    context.drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  uploadPhoto() {
    if (!this.currentBase64Image) return;

    // Here you would implement your upload logic
    console.log('Uploading photo:', this.currentBase64Image.substring(0, 30) + '...');
    alert('Photo uploaded successfully!');
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
