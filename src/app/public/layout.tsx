import type { Metadata } from 'next';
import '@/styles/globals.scss';

export const metadata: Metadata = {
    title: 'Car Rental - Browse Available Cars',
    description: 'Browse and rent cars from our fleet',
};

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
