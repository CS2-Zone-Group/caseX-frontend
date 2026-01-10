'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import api from '@/lib/api';

export default function SharedItemRedirectPage() {
  const router = useRouter();
  const params = useParams(); // [shareId] ni olish uchun

  useEffect(() => {
    const resolveAndRedirect = async () => {
      // shareId params ichida ekanligini tekshiramiz
      const shareId = params?.shareId || params?.id;
      
      if (!shareId) return;

      // page.tsx faylida
try {
  // URLni /api bilan emas, /sharing bilan boshlang (Axios baseURL /api ni o'zi qo'shadi)
  const { data } = await api.get(`/sharing/shared/${shareId}`, {
    // BU JUDA MUHIM: Alertni to'xtatish uchun tokenni undefined qilamiz
    headers: { Authorization: undefined } 
  });

  // console.log("Backend response:", data);

  // Ma'lumotni 'data' ichidan qidiramiz
  const skinInfo = data?.items || data; 
  const realSkinId = skinInfo?.id || skinInfo?._id;
  console.log(skinInfo);
  

  if (realSkinId) {
    router.replace(`/marketplace?skinId=${realSkinId}`);
  }
} catch (error) {
  // Xato bo'lsa alert chiqmaydi, shunchaki marketplacega o'tadi
  router.replace('/marketplace');
}
    };

    resolveAndRedirect();
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <CircularProgress size={40} className="mb-4" color="primary" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Loading shared skin...
        </p>
      </div>
    </div>
  );
}