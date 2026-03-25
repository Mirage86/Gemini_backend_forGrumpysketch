import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

export interface DrawingCanvasRef {
  clear: () => void;
  getBase64: () => string;
  isEmpty: () => boolean;
  loadImage: (dataUrl: string) => void;
  undo: () => void;
  redo: () => void;
}

interface DrawingCanvasProps {
  disabled?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
}

export const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  ({ disabled = false, strokeColor = '#000000', strokeWidth = 5, onHistoryChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const historyRef = useRef<string[]>([]);
    const redoListRef = useRef<string[]>([]);

    const notifyHistoryChange = () => {
      if (onHistoryChange) {
        onHistoryChange(historyRef.current.length > 1, redoListRef.current.length > 0);
      }
    };

    const saveState = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        historyRef.current.push(canvas.toDataURL('image/png'));
        redoListRef.current = [];
        notifyHistoryChange();
      }
    };

    const restoreState = (dataUrl: string) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
      }
    };

    useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            setHasDrawn(false);
            historyRef.current = [canvas.toDataURL('image/png')];
            redoListRef.current = [];
            notifyHistoryChange();
          }
        }
      },
      getBase64: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          return canvas.toDataURL('image/png');
        }
        return '';
      },
      isEmpty: () => !hasDrawn,
      loadImage: (dataUrl: string) => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = new Image();
            img.onload = () => {
              // Clear canvas first
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Calculate scale to fit image within canvas while maintaining aspect ratio
              const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
              const x = (canvas.width / 2) - (img.width / 2) * scale;
              const y = (canvas.height / 2) - (img.height / 2) * scale;
              
              ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
              setHasDrawn(true);
              saveState();
            };
            img.src = dataUrl;
          }
        }
      },
      undo: () => {
        if (historyRef.current.length > 1) {
          const currentState = historyRef.current.pop()!;
          redoListRef.current.push(currentState);
          const previousState = historyRef.current[historyRef.current.length - 1];
          restoreState(previousState);
          setHasDrawn(historyRef.current.length > 1);
          notifyHistoryChange();
        }
      },
      redo: () => {
        if (redoListRef.current.length > 0) {
          const nextState = redoListRef.current.pop()!;
          historyRef.current.push(nextState);
          restoreState(nextState);
          setHasDrawn(true);
          notifyHistoryChange();
        }
      }
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        // Set actual size in memory (scaled to account for retina displays)
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
          canvas.width = rect.width;
          canvas.height = rect.height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
          }
          historyRef.current = [canvas.toDataURL('image/png')];
          redoListRef.current = [];
          notifyHistoryChange();
        }
      }
    }, []);

    const startDrawing = (x: number, y: number) => {
      if (disabled) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(x - rect.left, y - rect.top);
        setIsDrawing(true);
      }
    };

    const draw = (x: number, y: number) => {
      if (!isDrawing || disabled) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(x - rect.left, y - rect.top);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
        setHasDrawn(true);
      }
    };

    const stopDrawing = () => {
      if (isDrawing) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
          ctx.closePath();
        }
        setIsDrawing(false);
        saveState();
      }
    };

    // Mouse Events
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => startDrawing(e.clientX, e.clientY);
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => draw(e.clientX, e.clientY);
    const handleMouseUp = () => stopDrawing();
    const handleMouseLeave = () => stopDrawing();

    // Touch Events
    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (e.touches.length > 0) {
        startDrawing(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (e.touches.length > 0) {
        draw(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => stopDrawing();

    return (
      <canvas
        ref={canvasRef}
        className="canvas-container w-full h-full bg-white rounded-2xl shadow-inner border-4 border-slate-200 cursor-crosshair touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';
