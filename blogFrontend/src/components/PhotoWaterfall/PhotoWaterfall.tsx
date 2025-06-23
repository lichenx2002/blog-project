import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './PhotoWaterfall.module.css';
import { Gallery } from '@/types/Gallery';

interface PhotoItemProps {
  gallery: Gallery;
  delay: number;
  direction: 'left' | 'right';
}

const PhotoItem: React.FC<PhotoItemProps> = ({ gallery, delay, direction }) => {
  return (
    <motion.div
      className={styles.photoWrapper}
      initial={{ opacity: 0, y: -100, rotateX: 45, rotateZ: direction === 'left' ? -15 : 15 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateZ: 0,
      }}
      transition={{
        duration: 2,
        delay: delay,
        ease: "easeOut",
      }}
    >
      <img
        src={gallery.coverImage}
        alt={gallery.title}
        className={styles.photo}
        loading="lazy"
      />
      <div className={styles.photoInfo}>
        <div>{gallery.title}</div>
      </div>
    </motion.div>
  );
};

interface PhotoRowProps {
  galleries: Gallery[];
  rowIndex: number;
}

const PhotoRow: React.FC<PhotoRowProps> = ({ galleries, rowIndex }) => {
  const isLeft = rowIndex % 2 === 0;
  const rowClass = isLeft ? styles.rowLeft : styles.rowRight;
  const numPhotos = Math.min(5, galleries.length);

  // 随机选择照片
  const selectedGalleries = React.useMemo(() => {
    const shuffled = [...galleries].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numPhotos);
  }, [galleries, numPhotos]);

  return (
    <div className={`${styles.row} ${rowClass}`}>
      {selectedGalleries.map((gallery, index) => (
        <PhotoItem
          key={`${gallery.id}-${index}`}
          gallery={gallery}
          delay={index * 0.2}
          direction={isLeft ? 'left' : 'right'}
        />
      ))}
    </div>
  );
};

interface PhotoWaterfallProps {
  galleries: Gallery[];
}

const PhotoWaterfall: React.FC<PhotoWaterfallProps> = ({ galleries }) => {
  const [numRows, setNumRows] = useState(3);

  useEffect(() => {
    const calculateRows = () => {
      const height = window.innerHeight;
      const rowHeight = 140; // 每行高度（包含间距）
      const calculatedRows = Math.floor(height / rowHeight);
      setNumRows(Math.min(calculatedRows, 3)); // 最多显示3行
    };

    calculateRows();
    window.addEventListener('resize', calculateRows);
    return () => window.removeEventListener('resize', calculateRows);
  }, []);

  if (!galleries || galleries.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.photoContainer}>
        {Array.from({ length: numRows }).map((_, index) => (
          <PhotoRow
            key={index}
            galleries={galleries}
            rowIndex={index}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoWaterfall; 