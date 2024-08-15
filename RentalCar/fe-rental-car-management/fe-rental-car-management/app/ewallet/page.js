import EWalletPage from '@/components/ewallet/ewallet-page';
import { Suspense } from 'react';
import LoadingTransaction from './loading';

export default function EWallet() {
    return (
        <div>
            <Suspense fallback={<LoadingTransaction />}>
                <EWalletPage />
            </Suspense>
        </div>
    );
}
