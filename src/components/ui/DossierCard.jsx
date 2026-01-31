import React from 'react';
import clsx from 'clsx';
import styles from './DossierCard.module.css';

const DossierCard = ({ children, title, className, type = 'standard' }) => {
    return (
        <div className={clsx(styles.card, styles[type], className)}>
            {title && (
                <div className={styles.header}>
                    <span className={styles.tab}>{title}</span>
                    <div className={styles.decoration} />
                </div>
            )}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default DossierCard;
