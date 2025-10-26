'use client';
import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // @ts-expect-error
    import('bootstrap/dist/js/bootstrap');
  }, []);
  return null;
}
