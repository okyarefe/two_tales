import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/svg+xml';

export default function Icon() {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'logo-mark.svg');
    const imageData = fs.readFileSync(imagePath);

    return new Response(new Uint8Array(imageData), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new ImageResponse(
      <div
        style={{
          fontSize: 24,
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
      >
        📖
      </div>,
      {
        ...size,
      },
    );
  }
}
