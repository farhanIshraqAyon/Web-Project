import React, { useState } from 'react';
import DossierCard from '../components/ui/DossierCard';
import CivicSlider from '../components/ui/CivicSlider';
import styles from './SubmitEvidence.module.css';
import { Upload, Camera, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { api } from '../services/api';

const SubmitEvidence = () => {
    const [reportType, setReportType] = useState('commendation'); // 'commendation' or 'infraction'
    const [catName, setCatName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Metrics
    const [metrics, setMetrics] = useState({
        benefit: 5,
        effort: 5,
        cuteness: 5, // Shared
        malice: 5,
        destruction: 5
    });

    const handleMetricChange = (key, value) => {
        setMetrics(prev => ({ ...prev, [key]: value }));
    };

    // Calculate Score
    const calculateScore = () => {
        if (reportType === 'infraction') {
            // Penalty = (M * 1.5 + D * 1.0 - C * 0.8) / 3
            const score = (metrics.malice * 1.5 + metrics.destruction * 1.0 - metrics.cuteness * 0.8) / 3;
            return score.toFixed(1);
        } else {
            // Bonus = (B * 1.5 + E * 1.0 + C * 0.5) / 3
            const score = (metrics.benefit * 1.5 + metrics.effort * 1.0 + metrics.cuteness * 0.5) / 3;
            return score.toFixed(1);
        }
    };

    const handleSubmit = async () => {
        if (!catName || !description) return;

        setIsSubmitting(true);
        const evidenceData = {
            subject: catName,
            type: reportType,
            description,
            metrics,
            score: calculateScore()
        };

        const result = await api.submitEvidence(evidenceData);

        if (result.success) {
            // Reset form or show success message (alert for now)
            alert(`Report filed successfully! Reference ID: ${result.id}`);
            setCatName('');
            setDescription('');
        } else {
            alert('Failed to file report. Please try again.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>File New Report</h1>
                <p className={styles.subtitle}>Submit evidence for the public record.</p>
            </header>

            <div className={styles.grid}>
                <DossierCard title="Report Details" className={styles.formCard}>
                    <div className={styles.formGroup}>
                        <label>Subject (Cat Name)</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Sir Meows-a-Lot"
                            value={catName}
                            onChange={(e) => setCatName(e.target.value)}
                        />
                    </div>

                    <div className={styles.typeSelector}>
                        <button
                            className={clsx(styles.typeBtn, reportType === 'commendation' && styles.activeGood)}
                            onClick={() => setReportType('commendation')}
                        >
                            Commendation (Good Deed)
                        </button>
                        <button
                            className={clsx(styles.typeBtn, reportType === 'infraction' && styles.activeBad)}
                            onClick={() => setReportType('infraction')}
                        >
                            Infraction (Crime)
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Incident Description</label>
                        <textarea
                            className={styles.textarea}
                            rows={4}
                            placeholder="Describe the behavior in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className={styles.uploadArea}>
                        <Camera size={24} />
                        <span>Upload Photographic Evidence</span>
                        <span className={styles.uploadHint}>(Drag & Drop or Click)</span>
                    </div>
                </DossierCard>

                <DossierCard
                    title="Civic Review & Scoring"
                    className={styles.scoreCard}
                    type={reportType === 'infraction' ? 'warning' : 'success'}
                >
                    <div className={styles.sliders}>
                        {reportType === 'commendation' ? (
                            <>
                                <CivicSlider
                                    label="Community Benefit (B)"
                                    value={metrics.benefit}
                                    onChange={(v) => handleMetricChange('benefit', v)}
                                />
                                <CivicSlider
                                    label="Effort Expended (E)"
                                    value={metrics.effort}
                                    onChange={(v) => handleMetricChange('effort', v)}
                                />
                            </>
                        ) : (
                            <>
                                <CivicSlider
                                    label="Malice Intent (M)"
                                    value={metrics.malice}
                                    onChange={(v) => handleMetricChange('malice', v)}
                                />
                                <CivicSlider
                                    label="Property Destruction (D)"
                                    value={metrics.destruction}
                                    onChange={(v) => handleMetricChange('destruction', v)}
                                />
                            </>
                        )}
                        {/* Cuteness is shared */}
                        <CivicSlider
                            label="Mitigating Cuteness (C)"
                            value={metrics.cuteness}
                            onChange={(v) => handleMetricChange('cuteness', v)}
                        />
                    </div>

                    <div className={styles.scoreDisplay}>
                        <div className={styles.scoreLabel}>Estimated Impact</div>
                        <div className={clsx(styles.scoreValue, reportType === 'infraction' ? styles.negative : styles.positive)}>
                            {reportType === 'infraction' ? '-' : '+'}{calculateScore()}
                        </div>
                        <div className={styles.formula}>
                            {reportType === 'infraction'
                                ? 'Formula: (M×1.5 + D×1.0 - C×0.8) / 3'
                                : 'Formula: (B×1.5 + E×1.0 + C×0.5) / 3'}
                        </div>
                    </div>

                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={isSubmitting || !catName || !description}
                    >
                        {isSubmitting ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Loader2 className={styles.spinner} size={16} /> FILING...
                            </span>
                        ) : 'FILE REPORT TO ARCHIVE'}
                    </button>
                </DossierCard>
            </div>
        </div>
    );
};

export default SubmitEvidence;
