import React, { useEffect, useState } from 'react';
import Heatmap from '@/components/Heatmap/Heatmap';

const More: React.FC = () => {
    const [data, setData] = useState<boolean[]>(Array(365).fill(false));

    useEffect(() => {
        // 模拟数据
        const mockData = Array(365).fill(false).map((_, index) => index % 10 === 0);
        setData(mockData);
    }, []);

    return (
        <div></div>
    );
};

export default More;