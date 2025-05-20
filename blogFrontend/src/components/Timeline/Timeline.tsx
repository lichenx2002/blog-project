'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Timeline.module.css';
import TimelineItem from "../../../types/Timeline";

type TimelineProps = {
  items: TimelineItem[];
};

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineLine} />

      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right
            }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div
            className={`${styles.itemContent} ${styles[item.type]
              }`}
            onClick={() => setActiveId(activeId === item.id ? null : item.id)}
          >
            <div className={styles.itemHeader}>
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <h3 className={styles.title}>{item.title}</h3>
              <time className={styles.date}>{item.date}</time>
            </div>

            <motion.div
              className={styles.content}
              initial={{ height: 0 }}
              animate={{ height: activeId === item.id ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>{item.content}</p>
            </motion.div>

            <div className={styles.dot} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline; 