import React from 'react';
import styles from './CivicSlider.module.css';

const CivicSlider = ({ label, value, onChange, min = 0, max = 10, step = 1 }) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label className={styles.label}>{label}</label>
                <span className={styles.value}>{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={styles.slider}
            />
            <div className={styles.ticks}>
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default CivicSlider;
