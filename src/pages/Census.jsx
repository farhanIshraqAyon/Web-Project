import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DossierCard from '../components/ui/DossierCard';
import { api } from '../services/api';
import styles from './Census.module.css';
import { Plus, Search, Loader2 } from 'lucide-react';

const Census = () => {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCats = async () => {
            setLoading(true);
            const { data } = await api.getCats(searchTerm);
            setCats(data);
            setLoading(false);
        };

        const timeout = setTimeout(fetchCats, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const diff = Date.now() - birthDate.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1>Department of Vital Statistics</h1>
                    <p className={styles.subtitle}>Official Census of the Feline Population</p>
                </div>
                <Link to="/census/new" className={styles.newIntakeBtn}>
                    <Plus size={18} /> NEW INTAKE
                </Link>
            </header>

            <div className={styles.formGroup}>
                <input
                    type="text"
                    placeholder="Search Census Database..."
                    className={styles.input}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Loader2 className={styles.spinner} size={32} />
                </div>
            ) : (
                <div className={styles.grid}>
                    {cats.map(cat => (
                        <DossierCard key={cat.id} title={cat.id} type="neutral">
                            <img src={cat.photoUrl} alt={cat.name} className={styles.catImage} />
                            <div className={styles.catInfo}>
                                <div className={styles.catName}>{cat.name}</div>
                                <div className={styles.catMeta}>
                                    <span>DOB: {cat.dob} (Age: {calculateAge(cat.dob)})</span>
                                    <span className={styles.statusBadge}>{cat.status}</span>
                                </div>
                            </div>
                        </DossierCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Census;
