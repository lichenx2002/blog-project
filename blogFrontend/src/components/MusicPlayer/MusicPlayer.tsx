import React, { useState, useRef, useEffect } from 'react';
import styles from './MusicPlayer.module.css'; // 导入CSS Module
import MusicPlayerProps from '../../../types/MusicPlayer';

const MusicPlayer: React.FC<MusicPlayerProps> = ({
                                                     audioSrc,
                                                     buttonText = '播放音乐',
                                                     className = '',
                                                 }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // 确保组件卸载时停止播放
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => {
                console.error('播放失败:', error);
            });
        }
        setIsPlaying(!isPlaying);
    };

    // 动态组合类名
    const buttonClass = `${styles.button} ${isPlaying ? styles.buttonPlaying : ''} ${className}`;

    return (
        <div>
            <button
                onClick={togglePlay}
                className={buttonClass}
                aria-label={isPlaying ? '停止播放' : '播放音乐'}
            >
                {isPlaying ? '停止播放' : buttonText}
            </button>
            <audio
                ref={audioRef}
                src={audioSrc}
                onEnded={() => setIsPlaying(false)}
                loop={false}
            />
        </div>
    );
};

export default MusicPlayer;