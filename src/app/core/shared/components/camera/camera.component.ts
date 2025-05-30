import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { HttpClient } from "@angular/common/http";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-camera",
  standalone: true,
  templateUrl: "./camera.component.html",
  styleUrls: ["./camera.component.scss"],
  imports: [MatButtonModule, NgClass],
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

  @ViewChild("video", { static: false }) video?: ElementRef<HTMLVideoElement>;
  @ViewChild("canvas", { static: false })
  canvas?: ElementRef<HTMLCanvasElement>;

  captures: string[] = [];
  error: any = null;
  isCaptured = false;
  currentBase64Image: string | null = null;

  isDesktop = window.innerWidth >= 768; // 768px es el breakpoint md de Tailwind

  // Dimensiones fijas para mantener formato consistente
  FIXED_WIDTH = 400;
  FIXED_HEIGHT = 300;

  // Propiedades dinámicas para dimensiones
  currentWidth = 400;
  currentHeight = 300;

  constructor(private http: HttpClient) {
    // Escuchar cambios de tamaño de ventana y orientación
    const handleResize = () => {
      this.isDesktop = window.innerWidth >= 768;
      // Mantener dimensiones fijas independientemente del dispositivo
      this.updateFixedDimensions();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
  }

  private updateFixedDimensions() {
    // Ajustar solo para pantallas muy pequeñas
    if (window.innerWidth < 480) {
      this.currentWidth = Math.min(320, window.innerWidth - 40);
      this.currentHeight = (this.currentWidth * 3) / 4; // Mantener ratio 4:3
    } else {
      this.currentWidth = this.FIXED_WIDTH;
      this.currentHeight = this.FIXED_HEIGHT;
    }
  }

  async ngAfterViewInit() {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      tempStream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.warn("Camera access check failed:", err);
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
    console.error("Camera error:", err);
    this.error = err.message || "No se pudo acceder a la cámara";
    this.cameraActive = false;
  }

  toggleCameraVisibility() {
    this.cameraVisible = !this.cameraVisible;
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.video?.nativeElement) {
      this.video.nativeElement.srcObject = null;
    }
  }

  async setupDevices() {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.error = "Camera API not supported in this browser";
      return;
    }

    try {
      this.stopCamera();
      this.updateFixedDimensions();

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      const videoConstraints = {
        width: { ideal: 640, max: 1280 },
        height: { ideal: 480, max: 960 },
        facingMode: isMobile ? "user" : "environment",
      };

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
      });

      if (this.video?.nativeElement) {
        this.video.nativeElement.srcObject = this.stream;
        await this.video.nativeElement.play();

        // Configurar canvas con dimensiones fijas
        if (this.canvas?.nativeElement) {
          this.canvas.nativeElement.width = this.currentWidth;
          this.canvas.nativeElement.height = this.currentHeight;
        }

        this.error = null;
      }
    } catch (err) {
      this.handleCameraError(err);
    }
  }

  capture() {
    if (!this.video?.nativeElement || !this.canvas?.nativeElement) return;

    this.drawImageToCanvas(this.video.nativeElement);
    const base64Image = this.canvas.nativeElement.toDataURL("image/jpeg", 0.8);
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
    const context = this.canvas?.nativeElement?.getContext("2d");
    if (!context || !this.canvas?.nativeElement) return;

    // Limpiar canvas
    context.clearRect(0, 0, this.currentWidth, this.currentHeight);

    if (image instanceof HTMLVideoElement) {
      // Para video, mantener las dimensiones fijas y centrar el contenido
      const videoWidth = image.videoWidth;
      const videoHeight = image.videoHeight;

      // Calcular scaling para fit dentro del canvas manteniendo aspect ratio
      const scaleX = this.currentWidth / videoWidth;
      const scaleY = this.currentHeight / videoHeight;
      const scale = Math.min(scaleX, scaleY);

      const scaledWidth = videoWidth * scale;
      const scaledHeight = videoHeight * scale;

      // Centrar la imagen
      const offsetX = (this.currentWidth - scaledWidth) / 2;
      const offsetY = (this.currentHeight - scaledHeight) / 2;

      // Rellenar fondo negro si hay espacio
      context.fillStyle = "#000000";
      context.fillRect(0, 0, this.currentWidth, this.currentHeight);

      context.drawImage(
        image,
        0,
        0,
        videoWidth,
        videoHeight,
        offsetX,
        offsetY,
        scaledWidth,
        scaledHeight,
      );
    } else {
      // Para imágenes, usar dimensiones fijas
      context.drawImage(image, 0, 0, this.currentWidth, this.currentHeight);
    }
  }

  getPureBase64(): string | null {
    if (!this.currentBase64Image) return null;
    return this.currentBase64Image.split(",")[1];
  }

  getImageBlob(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.currentBase64Image) {
        resolve(null);
        return;
      }

      fetch(this.currentBase64Image)
        .then((res) => res.blob())
        .then((blob) => resolve(blob))
        .catch(() => resolve(null));
    });
  }
}
