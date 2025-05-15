import React from 'react';
import Head from "next/head";
import styles from './Home/Home.module.css'
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import Arrow from "@/components/Arrow/Arrow";
import Typewriter from '@/components/Typewriter/Typewriter';

const Home:React.FC = () => {
    return (
        <div className={styles.bacc}>
            <Head>
                <title>我的知识空间 | 分享与成长的旅程</title>
                <meta name="description" content="记录我的技术思考、设计理念和生活感悟" />
            </Head>

            <div className={styles.container}>
                <div className={styles.showTop}>
                    <div className={styles.box1}>
                        <Typewriter className={styles.typewriter1} text={'这里是孤芳不自赏的Blog'} delay={100} />
                        <br className={styles.typewriter1} />
                        <Typewriter className={styles.typewriter2} text={'日益努力，而后风生水起'} delay={200} cursorChar={'|'} />
                    </div>
                    <div className="box2">
                        <ProfileCard />
                    </div>
                </div>
                <div>
                    <Arrow text1={"钥在锁先，行胜于言"} text2={"Prepare the solution beforethe problem; action speaks louder."} />
                </div>
                <div className={styles.mainContentArea}>
                    <div className={styles.mainContentLeft}>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;