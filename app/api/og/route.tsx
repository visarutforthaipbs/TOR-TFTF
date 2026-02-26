import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title') || 'ทันฝุ่น ทันไฟ';
  const subtitle =
    searchParams.get('subtitle') ||
    'ติดตามสถานการณ์ PM2.5 และไฟป่า';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          fontFamily: 'sans-serif',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(242, 101, 34, 0.15)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(242, 101, 34, 0.1)',
            display: 'flex',
          }}
        />

        {/* Top bar accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #F26522, #ff8a50, #F26522)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
            zIndex: 1,
          }}
        >
          {/* Logo & Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: '#F26522',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              🔥
            </div>
            <span
              style={{
                fontSize: '28px',
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '2px',
              }}
            >
              THAI PBS
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 40 ? '48px' : '56px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.3,
              maxWidth: '900px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '700px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {subtitle}
          </div>

          {/* Accent line */}
          <div
            style={{
              width: '80px',
              height: '4px',
              background: '#F26522',
              borderRadius: '2px',
              marginTop: '8px',
              display: 'flex',
            }}
          />
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '18px',
          }}
        >
          funfai.thaipbs.or.th
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
