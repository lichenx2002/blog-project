import React, { useRef, useEffect, useCallback, useState } from "react";

interface ClickSparkProps {
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number;
    easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
    extraScale?: number;
    children?: React.ReactNode;
}

interface Spark {
    x: number;
    y: number;
    angle: number;
    startTime: number;
}

// 预定义的缓动函数
const EASING_FUNCTIONS = {
    linear: (t: number) => t,
    "ease-in": (t: number) => t * t,
    "ease-out": (t: number) => t * (2 - t),
    "ease-in-out": (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

const ClickSpark: React.FC<ClickSparkProps> = ({
                                                   sparkColor = "#fff",
                                                   sparkSize = 10,
                                                   sparkRadius = 15,
                                                   sparkCount = 8,
                                                   duration = 400,
                                                   easing = "ease-out",
                                                   extraScale = 1.0,
                                                   children
                                               }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const sparksRef = useRef<Spark[]>([]);
    const animationRef = useRef<number | null>(null);
    const lastFrameTimeRef = useRef<number>(0);
    const sparkPoolRef = useRef<Spark[]>([]); // 对象池

    // 获取缓动函数
    const easeFunc = EASING_FUNCTIONS[easing];

    // 尺寸调整优化
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateDimensions = () => {
            const { width, height } = container.getBoundingClientRect();
            if (width !== dimensions.width || height !== dimensions.height) {
                setDimensions({ width, height });
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateDimensions);
        });

        resizeObserver.observe(container);
        updateDimensions(); // 初始尺寸

        return () => resizeObserver.disconnect();
    }, [dimensions]);

    // 从对象池获取或创建新的火花
    const getSpark = (x: number, y: number, angle: number, startTime: number): Spark => {
        if (sparkPoolRef.current.length > 0) {
            const spark = sparkPoolRef.current.pop()!;
            spark.x = x;
            spark.y = y;
            spark.angle = angle;
            spark.startTime = startTime;
            return spark;
        }
        return { x, y, angle, startTime };
    };

    // 渲染循环
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // 设置canvas尺寸
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const renderSparks = (timestamp: number) => {
            // 使用固定时间步长 (60fps)
            if (timestamp - lastFrameTimeRef.current < 16 && sparksRef.current.length > 0) {
                animationRef.current = requestAnimationFrame(renderSparks);
                return;
            }
            lastFrameTimeRef.current = timestamp;

            const activeSparks: Spark[] = [];
            let needsClear = false;

            // 批量绘制
            ctx.beginPath();
            ctx.strokeStyle = sparkColor;
            ctx.lineWidth = 2;

            for (let i = 0; i < sparksRef.current.length; i++) {
                const spark = sparksRef.current[i];
                const elapsed = timestamp - spark.startTime;

                if (elapsed >= duration) {
                    sparkPoolRef.current.push(spark); // 回收到对象池
                    needsClear = true;
                    continue;
                }

                activeSparks.push(spark);
                const progress = elapsed / duration;
                const eased = easeFunc(progress);
                const distance = eased * sparkRadius * extraScale;
                const lineLength = sparkSize * (1 - eased);

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = x1 + lineLength * Math.cos(spark.angle);
                const y2 = y1 + lineLength * Math.sin(spark.angle);

                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            }

            if (needsClear || activeSparks.length > 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            if (activeSparks.length > 0) {
                ctx.stroke();
            }

            sparksRef.current = activeSparks;
            animationRef.current = requestAnimationFrame(renderSparks);
        };

        animationRef.current = requestAnimationFrame(renderSparks);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [dimensions, sparkColor, sparkSize, sparkRadius, duration, extraScale]);

    // 点击处理 - 使用防抖和性能优化
    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const now = performance.now();
        const angleIncrement = (2 * Math.PI) / sparkCount;

        // 预分配数组空间
        if (sparksRef.current.length + sparkCount > 1000) {
            sparkPoolRef.current.push(...sparksRef.current.splice(0, sparksRef.current.length - 500));
        }

        for (let i = 0; i < sparkCount; i++) {
            sparksRef.current.push(getSpark(x, y, angleIncrement * i, now));
        }
    }, [sparkCount]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full"
            onClick={handleClick}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />
            {children}
        </div>
    );
};

export default React.memo(ClickSpark);