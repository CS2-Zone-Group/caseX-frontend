'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ShareRedirect() {
  const router = useRouter();
  const { shareId } = useParams();
  

  useEffect(() => {
    if (shareId) {
      router.replace(`/marketplace?openSkin=${shareId}`);
    }
  }, [shareId, router]);

  return null; 
}