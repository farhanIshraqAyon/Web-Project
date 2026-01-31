import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styles from './MainLayout.module.css';

const MainLayout = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logoRow}>
                    <div className={styles.seal}></div>
                    <div className={styles.logoText}>
                        <span className={styles.dept}>Intl. University of Technology</span>
                        <span className={styles.bureau}>Bureau of Felines</span>
                    </div>
                </div>
                <div className={styles.userStatus}>
                    Status: <span className={styles.statusOk}>Good Standing</span>
                </div>
            </header>

            <div className={styles.contentWrapper}>
                <aside className={styles.sidebar}>
                    <Navbar />
                </aside>
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <span>Official Record • Do Not Distribute</span>
                    <span>EST. 2024</span>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
