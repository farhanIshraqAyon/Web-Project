import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DossierCard from '../components/ui/DossierCard';
import { api } from '../services/api';
import styles from './Census.module.css';
import { Save, Loader2, Upload, X } from 'lucide-react';

const NewIntake = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        photoFile: null // Changed from photoUrl to photoFile
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photoFile: file });
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const clearPreview = () => {
        setFormData({ ...formData, photoFile: null });
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await api.registerCat({
            ...formData,
            status: 'ACTIVE'
        });

        if (result.success) {
            alert(`Cat registered successfully! ID: ${result.id}`);
            navigate('/census');
        } else {
            alert('Registration failed.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className={styles.page}>
            <div className={styles.formContainer}>
                <DossierCard title="New Registration Form" type="success">
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Official Name</label>
                            <input
                                type="text"
                                required
                                className={styles.input}
                                placeholder="e.g. Sir Purrs-a-Lot"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                required
                                className={styles.input}
                                value={formData.dob}
                                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Profile Image</label>

                            {!preview ? (
                                <div className={styles.uploadArea}>
                                    <input
                                        type="file"
                                        id="cat-photo"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={styles.fileInput}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="cat-photo" className={styles.uploadLabel}>
                                        <Upload size={24} />
                                        <span>Click to Upload Profile Photo</span>
                                        <span className={styles.uploadHint}>(JPG, PNG support)</span>
                                    </label>
                                </div>
                            ) : (
                                <div className={styles.previewContainer}>
                                    <img src={preview} alt="Preview" className={styles.previewImage} />
                                    <button
                                        type="button"
                                        className={styles.removePreviewBtn}
                                        onClick={clearPreview}
                                    >
                                        <X size={16} /> REMOVE PHOTO
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting || !formData.name || !formData.dob || !formData.photoFile}
                        >
                            {isSubmitting ? <Loader2 className={styles.spinner} /> : <Save size={18} />}
                            REGISTER NEW CITIZEN
                        </button>
                    </form>
                </DossierCard>
            </div>
        </div>
    );
};

export default NewIntake;
