'use server';

import HomepageFind from '@/components/common/home-page-find';
import WhatPeopleSay from '@/components/common/what-people-say';
import WhereToFindUs from '@/components/common/where-to-find-us';
import WhyUs from '@/components/homepage/why-us';

export default async function CustomerPage() {
    return (
        <>
            <HomepageFind />
            <WhyUs />
            <WhatPeopleSay />
            <WhereToFindUs />
        </>
    );
}
