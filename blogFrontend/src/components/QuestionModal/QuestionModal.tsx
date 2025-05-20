import React from 'react';
import { Question } from '@/types/Question';
import { Tag } from '@/types/Tags';
import styles from './QuestionModal.module.css';
import { FaTimes, FaEye, FaHeart, FaTag } from 'react-icons/fa';

interface QuestionModalProps {
  question: Question | null;
  onClose: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ question, onClose }) => {
  if (!question) return null;

  const difficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return '';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes className={styles.tagIcon} />
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.title}>{question.title}</h2>
          <div className={styles.metaInfo}>
            <span className={styles.metaItem}>
              <FaEye className={styles.tagIcon} /> {question.views} 次浏览
            </span>
            <span className={styles.metaItem}>
              <FaHeart className={styles.tagIcon} /> {question.likes} 次点赞
            </span>
            <span className={styles.difficulty} data-difficulty={question.difficulty}>
              {difficultyClass(question.difficulty)}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.questionContent}>
            {question.content}
          </div>
        </div>

        {question.tags && question.tags.length > 0 && (
          <div className={styles.tags}>
            <FaTag className={styles.tagIcon} />
            {question.tags.map((tag: Tag) => (
              <span key={tag.id} className={styles.tag} style={{ backgroundColor: `${tag.color}40` }}>
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionModal; 