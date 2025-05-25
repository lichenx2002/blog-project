import React, { useRef, useEffect } from "react";

interface Spark {
    x: number;
    y: number;
    angle: number;
    startTime: number;
}

const ClickSpark: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparksRef = useRef<Spark[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const getTextColor = () => {
            if (!canvas) return "#fff"; // 默认颜色
            return getComputedStyle(canvas).getPropertyValue('--text').trim() || "#fff";
        };


        // Set canvas size to match parent container
        const updateCanvasSize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        const draw = (timestamp: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const textColor = getTextColor(); // 获取当前--text的值

            sparksRef.current = sparksRef.current.filter((spark) => {
                const elapsed = timestamp - spark.startTime;
                if (elapsed >= 400) return false;

                const progress = elapsed / 400;
                const distance = progress * 15;
                const lineLength = 10 * (1 - progress);

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                ctx.strokeStyle = textColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                return true;
            });

            requestAnimationFrame(draw);
        };

        const animationId = requestAnimationFrame(draw);

        // 使用事件委托，监听整个文档的点击事件
        const handleGlobalClick = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            // 检查点击是否在canvas的父元素内
            const parent = canvas.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 检查点击是否在父元素范围内
            if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

            const now = performance.now();
            const newSparks = Array.from({ length: 8 }, (_, i) => ({
                x,
                y,
                angle: (2 * Math.PI * i) / 8,
                startTime: now,
            }));

            sparksRef.current.push(...newSparks);
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', updateCanvasSize);
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
};

export default ClickSpark;