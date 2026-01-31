import React, { useState, useEffect } from 'react';
import DossierCard from '../components/ui/DossierCard';
import { api } from '../services/api';
import styles from './Registry.module.css';
import { Search, Filter, Loader2, Eye, X } from 'lucide-react';
import clsx from 'clsx';

const Registry = () => {
    const [filter, setFilter] = useState('all'); // all, commendation, infraction
    const [searchTerm, setSearchTerm] = useState('');
    const [registryData, setRegistryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvidence, setSelectedEvidence] = useState(null);

    // Debounce search
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data, error } = await api.getRegistryEntries(filter, searchTerm);
                if (error) throw new Error(error);
                setRegistryData(data);
                setError(null);
            } catch (err) {
                setError('Failed to load registry archives. Database connection unstable.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filter, searchTerm]);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Public Registry</h1>
                <p className={styles.subtitle}>List of all registered deeds (Archive of Public Registry)</p>
            </header>

            <div className={styles.controls}>
                <div className={styles.searchBar}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by name or incident..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filters}>
                    <button
                        className={clsx(styles.filterBtn, filter === 'all' && styles.activeFilter)}
                        onClick={() => setFilter('all')}
                    >
                        ALL RECORDS
                    </button>
                    <button
                        className={clsx(styles.filterBtn, filter === 'commendation' && styles.activeFilter)}
                        onClick={() => setFilter('commendation')}
                    >
                        COMMENDATIONS
                    </button>
                    <button
                        className={clsx(styles.filterBtn, filter === 'infraction' && styles.activeFilter)}
                        onClick={() => setFilter('infraction')}
                    >
                        INFRACTIONS
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingState}>
                    <Loader2 className={styles.spinner} size={48} />
                    <p>Accessing Secure Archives...</p>
                </div>
            ) : error ? (
                <div className={styles.errorState}>
                    <p>{error}</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {registryData.map(record => (
                        <DossierCard
                            key={record.id}
                            title={record.subject}
                            type={record.type === 'infraction' ? 'warning' : 'success'}
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.date}>{record.date}</span>
                                <span className={clsx(styles.badge, styles[`badge-${record.type}`])}>
                                    {record.type}
                                </span>
                            </div>

                            <p className={styles.description}>
                                "{record.description}"
                            </p>

                            <div className={styles.cardFooter}>
                                <div className={styles.verdict}>
                                    VERDICT: {record.verdict}
                                </div>
                                <div className={clsx(styles.score, record.score >= 0 ? styles['score-positive'] : styles['score-negative'])}>
                                    {record.score > 0 ? '+' : ''}{record.score}
                                </div>
                            </div>

                            {record.photoUrl && (
                                <button
                                    className={styles.viewEvidenceBtn}
                                    onClick={() => setSelectedEvidence(record)}
                                >
                                    <Eye size={14} /> VIEW EVIDENCE
                                </button>
                            )}
                        </DossierCard>
                    ))}
                </div>
            )}

            {!loading && !error && registryData.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    No records found matching your inquiry, Citizen.
                </div>
            )}

            {/* Evidence Modal */}
            {selectedEvidence && (
                <div className={styles.modalOverlay} onClick={() => setSelectedEvidence(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>EVIDENCE EXHIBIT #{selectedEvidence.id}</h3>
                        <img
                            src={selectedEvidence.photoUrl}
                            alt={`Evidence for ${selectedEvidence.subject}`}
                            className={styles.evidenceImage}
                        />
                        <button
                            className={styles.closeBtn}
                            onClick={() => setSelectedEvidence(null)}
                        >
                            CLOSE EXHIBIT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Registry;
