import React, { useState, useEffect, useRef } from 'react';


interface WatermarkProps {
    content?: string;
    rotate?: number;
    opacity?: number;
    fontSize?: number;
    color?: string;
    gap?: [number, number];
    children?: React.ReactNode;
    debug?: boolean;
}
const Watermark: React.FC<WatermarkProps> = ({
                                                 content = 'Confidential',
                                                 rotate = -25,
                                                 opacity = 0.1,
                                                 fontSize = 16,
                                                 color = '#999',
                                                 gap = [100, 100],
                                                 children,
                                                 debug = false
                                             }) => {
    const [bgUrl, setBgUrl] = useState('');
    const watermarkRef = useRef(null);
    const containerRef = useRef(null);

    // 生成水印图像
    const generateWatermark = () => {
        const canvas = document.createElement('canvas');
        const [gapX, gapY] = gap;
        canvas.width = gapX;
        canvas.height = gapY;

        const ctx = canvas.getContext('2d');
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 保存当前状态
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((Math.PI / 180) * rotate);
        ctx.fillText(content, 0, 0);
        ctx.restore();

        return canvas.toDataURL();
    };

    // 防篡改检测
    const setupMutationObserver = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!watermarkRef.current || !containerRef.current) return;

                // 检查水印是否被移除
                if (!containerRef.current.contains(watermarkRef.current)) {
                    console.warn('Watermark removed! Recreating...');
                    const newWatermark = document.createElement('div');
                    // 重新应用样式...
                    containerRef.current.appendChild(newWatermark);
                    watermarkRef.current = newWatermark;
                }
            });
        });

        if (containerRef.current) {
            observer.observe(containerRef.current, {
                childList: true,
                subtree: true
            });
        }

        return () => observer.disconnect();
    };

    useEffect(() => {
        setBgUrl(generateWatermark());
        const cleanup = setupMutationObserver();

        return () => {
            cleanup && cleanup();
        };
    }, [content, rotate, opacity, fontSize, color, gap]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                minHeight: '100px',
                // border: debug ? '1px dashed #ccc' : 'none'
            }}
        >
            <div
                ref={watermarkRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${bgUrl})`,
                    backgroundRepeat: 'repeat',
                    pointerEvents: 'none',
                    zIndex: 9999
                }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </div>
    );
};

export default Watermark;