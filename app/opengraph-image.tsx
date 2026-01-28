import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'WilCo Guide - Your Complete Guide to Williamson County, TX'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #f97316, #fb923c, #f97316)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
          }}
        >
          {/* Logo/Icon representation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: '20px' }}
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#ffffff',
                letterSpacing: '-2px',
              }}
            >
              WilCo Guide
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '32px',
              color: '#f97316',
              fontWeight: '600',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Your Complete Guide to Williamson County
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '24px',
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: '1.4',
            }}
          >
            Local businesses, news, jobs & more in
          </div>

          {/* Cities */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '15px',
              gap: '20px',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                color: '#ffffff',
                fontWeight: '600',
                padding: '8px 24px',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                borderRadius: '8px',
                border: '2px solid #f97316',
              }}
            >
              Leander
            </span>
            <span
              style={{
                fontSize: '28px',
                color: '#ffffff',
                fontWeight: '600',
                padding: '8px 24px',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                borderRadius: '8px',
                border: '2px solid #f97316',
              }}
            >
              Round Rock
            </span>
            <span
              style={{
                fontSize: '28px',
                color: '#ffffff',
                fontWeight: '600',
                padding: '8px 24px',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                borderRadius: '8px',
                border: '2px solid #f97316',
              }}
            >
              Georgetown
            </span>
          </div>

          {/* Texas badge */}
          <div
            style={{
              marginTop: '30px',
              fontSize: '20px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: '8px' }}>📍</span>
            Williamson County, Texas
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#64748b',
          }}
        >
          wilcoguide.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
