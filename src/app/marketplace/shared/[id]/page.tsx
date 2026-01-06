'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import api from '@/lib/api';


export default function SharedItemPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    const resolveAndRedirect = async () => {
      if (!params?.id) return;

      try {
       
        const { data } = await api.get(`/sharing/shared/${params.id}`);

       
        const realSkinId = data._id || data.item?._id || data.skinId;

        if (realSkinId) {
          router.replace(`/marketplace?skinId=${realSkinId}`);
        } else {
          router.replace('/marketplace');
        }

      } catch (error) {
        console.error("Link eskirgan yoki xato:", error);
        router.replace('/marketplace');
      }
    };

    resolveAndRedirect();
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <CircularProgress size={40} className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading shared item...</p>
      </div>
    </div>
  );
}