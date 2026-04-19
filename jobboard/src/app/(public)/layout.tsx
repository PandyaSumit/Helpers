import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
