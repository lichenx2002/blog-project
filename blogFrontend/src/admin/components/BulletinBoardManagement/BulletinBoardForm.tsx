import React, { useState, useEffect } from 'react';
import type { BulletinBoardProps } from '@/types/BulletinBoard';
import styles from './BulletinBoardForm.module.css';

interface BulletinBoardFormProps {
    initialValues?: BulletinBoardProps;
    onSubmit: (values: BulletinBoardProps) => void;
}

const BulletinBoardForm: React.FC<BulletinBoardFormProps> = ({
                                                                 initialValues,
                                                                 onSubmit,
                                                             }) => {
    const [formData, setFormData] = useState<BulletinBoardProps>({
        id: 0,
        name: '',
        email: '',
        content: '',
        gender: '小哥哥',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
        }
    }, [initialValues]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formItem}>
                <label className={styles.label}>姓名</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>邮箱</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>性别</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={styles.select}
                >
                    <option value="小哥哥">小哥哥</option>
                    <option value="小姐姐">小姐姐</option>
                </select>
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>状态</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={styles.select}
                >
                    <option value="pending">待审核</option>
                    <option value="approved">已通过</option>
                    <option value="rejected">已拒绝</option>
                </select>
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>内容</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    required
                />
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>回复</label>
                <textarea
                    name="reply"
                    value={formData.reply || ''}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="输入回复内容..."
                />
            </div>

            <div className={styles.formButtons}>
                <button type="submit" className={styles.submitButton}>
                    {initialValues ? '更新' : '创建'}
                </button>
            </div>
        </form>
    );
};

export default BulletinBoardForm;