import React, { useState, useEffect } from 'react';
import type { Question } from '@/types/Question';
import styles from './QuestionsForm.module.css';

const difficultyMap: Record<string, { label: string; color: string }> = {
    easy: { label: '简单', color: '#4CAF50' },
    medium: { label: '中等', color: '#FFC107' },
    hard: { label: '困难', color: '#F44336' },
};

interface QuestionsFormProps {
    initialValues?: Partial<Question>;
    onSubmit?: (values: Question) => void;
}

const QuestionsForm: React.FC<QuestionsFormProps> = ({ initialValues, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<Question>>({
        title: '',
        content: '',
        difficulty: 'medium',
        category: '',
        status: 'draft',
        ...initialValues
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData as Question);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formItem}>
                <label className={styles.formLabel}>标题</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="输入面试题标题..."
                    required
                />
            </div>

            <div className={styles.formItem}>
                <label className={styles.formLabel}>内容</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="输入面试题内容..."
                    required
                />
            </div>

            <div className={styles.formItemRow}>
                <div className={styles.formItem}>
                    <label className={styles.formLabel}>难度</label>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                    >
                        {Object.entries(difficultyMap).map(([key, { label }]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formItem}>
                    <label className={styles.formLabel}>分类</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="输入分类..."
                        required
                    />
                </div>
            </div>

            <div className={styles.formItem}>
                <label className={styles.formLabel}>状态</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                >
                    <option value="draft">草稿</option>
                    <option value="published">已发布</option>
                </select>
            </div>

            <div className={styles.formFooter}>
                <button type="submit" className={styles.submitButton}>
                    {initialValues ? '更新' : '创建'}
                </button>
            </div>
        </form>
    );
};

export default QuestionsForm;