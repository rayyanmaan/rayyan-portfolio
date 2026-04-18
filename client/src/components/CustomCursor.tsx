import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor({ isDark }: { isDark: boolean }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [cursorSrc, setCursorSrc] = useState('/doodle.png');
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    const apply = () => setIsFinePointer(media.matches);
    apply();
    media.addEventListener('change', apply);

    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const img = new Image();
    img.src = '/doodle_raw.jpg';

    img.onload = () => {
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = img.width;
      sourceCanvas.height = img.height;

      const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
      if (!sourceCtx) return;
      sourceCtx.drawImage(img, 0, 0);

      const imageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
      const data = imageData.data;

      const pixelCount = sourceCanvas.width * sourceCanvas.height;
      const activeMask = new Uint8Array(pixelCount);

      let minX = sourceCanvas.width;
      let minY = sourceCanvas.height;
      let maxX = 0;
      let maxY = 0;

      // Remove bright background and preserve only doodle lines.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const maxChannel = Math.max(r, g, b);

        // White-ish pixels become fully transparent.
        if (maxChannel > 243) {
          data[i + 3] = 0;
          continue;
        }

        // Keep line art black with strong alpha.
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = Math.max(120, 255 - maxChannel);

        const pixelIndex = i / 4;
        activeMask[pixelIndex] = 1;
      }

      // Keep significant connected components (hair + face), while removing
      // tiny isolated artifacts such as thin scan lines.
      const visited = new Uint8Array(pixelCount);
      const keptMask = new Uint8Array(pixelCount);
      const components: Array<{ size: number; pixels: number[] }> = [];

      for (let idx = 0; idx < pixelCount; idx += 1) {
        if (!activeMask[idx] || visited[idx]) continue;

        const queue: number[] = [idx];
        const componentPixels: number[] = [];
        visited[idx] = 1;

        while (queue.length > 0) {
          const current = queue.pop() as number;
          componentPixels.push(current);

          const x = current % sourceCanvas.width;
          const y = Math.floor(current / sourceCanvas.width);

          const neighbors = [
            x > 0 ? current - 1 : -1,
            x < sourceCanvas.width - 1 ? current + 1 : -1,
            y > 0 ? current - sourceCanvas.width : -1,
            y < sourceCanvas.height - 1 ? current + sourceCanvas.width : -1,
          ];

          for (const n of neighbors) {
            if (n === -1 || visited[n] || !activeMask[n]) continue;
            visited[n] = 1;
            queue.push(n);
          }
        }

        components.push({ size: componentPixels.length, pixels: componentPixels });
      }

      let largestComponentSize = 0;
      for (const c of components) {
        if (c.size > largestComponentSize) largestComponentSize = c.size;
      }

      const minKeepSize = Math.max(30, Math.floor(largestComponentSize * 0.08));
      for (const c of components) {
        if (c.size < minKeepSize) continue;
        for (const p of c.pixels) {
          keptMask[p] = 1;
        }
      }

      for (let idx = 0; idx < pixelCount; idx += 1) {
        if (!keptMask[idx]) {
          data[idx * 4 + 3] = 0;
          continue;
        }

        const x = idx % sourceCanvas.width;
        const y = Math.floor(idx / sourceCanvas.width);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      sourceCtx.putImageData(imageData, 0, 0);

      if (maxX <= minX || maxY <= minY) return;

      const padding = 12;
      const cropX = Math.max(0, minX - padding);
      const cropY = Math.max(0, minY - padding);
      const cropW = Math.min(sourceCanvas.width - cropX, maxX - minX + 1 + padding * 2);
      const cropH = Math.min(sourceCanvas.height - cropY, maxY - minY + 1 + padding * 2);

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropW;
      cropCanvas.height = cropH;
      const cropCtx = cropCanvas.getContext('2d');
      if (!cropCtx) return;

      cropCtx.imageSmoothingEnabled = true;
      cropCtx.drawImage(sourceCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      setCursorSrc(cropCanvas.toDataURL('image/png'));
    };
  }, [isFinePointer]);

  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    // Hide default cursor globally
    document.body.style.cursor = 'none';

    const style = document.createElement('style');
    style.innerHTML = `@media (pointer: fine) { * { cursor: none !important; } }`;
    document.head.appendChild(style);

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.head.removeChild(style);
      document.body.style.cursor = 'auto';
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <motion.img
      aria-hidden="true"
      src={cursorSrc}
      className="fixed pointer-events-none z-[99999]"
      animate={{
        x: position.x - 24,
        y: position.y - 24,
        rotate: [-1.5, 1.5, -1.5],
        opacity: hidden ? 0 : 1,
        scale: hidden ? 0.8 : 1,
      }}
      transition={{
        x: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 },
        y: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 },
        rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }}
      style={{
        width: 48,
        height: 48,
        objectFit: 'contain',
        imageRendering: 'auto',
        filter: isDark ? 'invert(1)' : 'none',
      }}
    />
  );
}
