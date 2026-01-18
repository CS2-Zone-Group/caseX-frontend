import { NextResponse } from 'next/server';

// POST requestni qabul qilish
export async function POST(request: Request) {
  try {
    // 1. Kelgan ma'lumotni o'qish (shart emas, lekin kod sinmasligi uchun)
    const body = await request.json(); 

    // 2. Random ID generatsiya qilish
    const randomId = 'share-' + Math.floor(Math.random() * 1000000);

    // 3. Linkni yasash (http://localhost:3000/marketplace/shared/...)
    // request.headers.get('host') - bu avtomatik localhost yoki domenni oladi
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const fullLink = `${protocol}://${host}/marketplace/shared/${randomId}`;

    // 4. Javob qaytarish
    return NextResponse.json({ 
      success: true,
      share: {
        shareUrl: fullLink,
        shareId: randomId
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Link yaratishda xatolik bo\'ldi' },
      { status: 500 }
    );
  }
}