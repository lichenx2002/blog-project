import { FiArrowRight } from 'react-icons/fi';
import styles from './ProfileCard.module.css';
import Image from "next/image";
import React from "react";
import { motion } from 'framer-motion';
import {FaGithub} from "react-icons/fa";

const ProfileCard:React.FC = () => {

    // 定义动画变体
    const cardVariants = {
        initial: {
            y: 20,
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        hover: {
            y: -10,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            className={styles.profileCard}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
        >
            {/* 上层 */}
            <motion.div
                className={styles.profileCard__upper}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <img
                    src="/images/avatar_20250520_215057.png"
                    alt="用户头像"
                    className={styles.avatar}
                />
                <div className={styles.profileInfo}>
                    <motion.h1
                        className={styles.userName}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        孤芳不自赏
                    </motion.h1>
                    <motion.p
                        className={styles.userBio}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        Java+TypeScript全栈开发者，正在学习HarmonyOS Next，励志成为Web3.0的先锋
                    </motion.p>
                </div>
            </motion.div>

            {/* 中层 */}
            <motion.div
                className={styles.profileCard__middle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    🔥前端开发探索者
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    📜这里记录代码、思考与成长，分享技巧与前沿技术
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                >
                    🚀简单·实用·有趣，一起探索前端之美
                </motion.p>
            </motion.div>

            {/* 下层 */}
            <motion.div
                className={styles.profileCard__lower}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
            >
                <motion.a
                    href="https://github.com/lichenx2002?tab=projects"
                    className={styles.profileLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaGithub style={{color:'var(--text)'}}/>
                    <div className={styles.aLink}>My GitHub</div>
                </motion.a>
                <motion.a
                    href="/blog/public"
                    className={styles.profileLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    HomePage <FiArrowRight className={styles.linkIcon} />
                </motion.a>
            </motion.div>
        </motion.div>
    );
};

export default ProfileCard;