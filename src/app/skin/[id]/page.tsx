import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SkinPageClient from './SkinPageClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const SITE_URL = 'https://casex.uz';

interface Skin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  price: number;
  imageUrl: string;
  marketHashName?: string;
  steamIconUrl?: string;
  steamPrice?: string;
  steamVolume?: string;
  description?: string;
  collection?: string;
  float?: number;
  isAvailable?: boolean;
}

async function getSkin(id: string): Promise<Skin | null> {
  try {
    const res = await fetch(`${API_URL}/skins/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const skin = await getSkin(id);

  if (!skin) {
    return {
      title: 'Skin topilmadi',
      description: 'Bu skin mavjud emas yoki olib tashlangan.',
    };
  }

  const title = `${skin.name} (${skin.exterior}) - CaseX Marketplace`;
  const description = `Buy ${skin.name} (${skin.exterior}) for $${Number(skin.price).toFixed(2)} on CaseX - O'zbekistondagi #1 CS2 skinlari marketplace`;
  const skinUrl = `${SITE_URL}/skin/${skin.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: skinUrl,
      siteName: 'CaseX',
      type: 'website',
      images: skin.imageUrl
        ? [
            {
              url: skin.imageUrl,
              width: 512,
              height: 384,
              alt: skin.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: skin.imageUrl ? [skin.imageUrl] : undefined,
    },
    alternates: {
      canonical: skinUrl,
    },
    other: {
      'product:price:amount': String(skin.price),
      'product:price:currency': 'USD',
    },
  };
}

export default async function SkinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skin = await getSkin(id);

  if (!skin) {
    notFound();
  }

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: skin.name,
            image: skin.imageUrl,
            description: skin.description || `${skin.name} (${skin.exterior}) - CS2 skin on CaseX marketplace`,
            brand: {
              '@type': 'Brand',
              name: 'Counter-Strike 2',
            },
            offers: {
              '@type': 'Offer',
              url: `${SITE_URL}/skin/${skin.id}`,
              priceCurrency: 'USD',
              price: Number(skin.price).toFixed(2),
              availability: skin.isAvailable !== false
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'CaseX',
              },
            },
            additionalProperty: [
              {
                '@type': 'PropertyValue',
                name: 'Exterior',
                value: skin.exterior,
              },
              {
                '@type': 'PropertyValue',
                name: 'Rarity',
                value: skin.rarity,
              },
              ...(skin.float !== undefined && skin.float !== null
                ? [
                    {
                      '@type': 'PropertyValue',
                      name: 'Float Value',
                      value: String(skin.float),
                    },
                  ]
                : []),
              ...(skin.collection
                ? [
                    {
                      '@type': 'PropertyValue',
                      name: 'Collection',
                      value: skin.collection,
                    },
                  ]
                : []),
            ],
          }),
        }}
      />
      <SkinPageClient skin={skin} />
    </>
  );
}
