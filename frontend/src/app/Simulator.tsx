'use client'
import { useRouter, usePathname } from 'next/navigation'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SalesPitch from './components/SalesPitch';
import QnAList from './components/QnAList';
import Summary from './components/Summary';
interface SimulatorProps {
    data: any;
}

export default function SimulatorView({ data }: SimulatorProps) {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="container mx-auto">
            <SalesPitch salesPitch={data.sales[0].sales} routePracticePitchHandler={() => router.push(pathname +'/practice')} />
            <QnAList QnA={data.sales[0].QnA} />
            <Summary summary={data.summary.summary} />
        </div>
    );
}
