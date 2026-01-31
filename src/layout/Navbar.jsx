import React from 'react';
import { NavLink } from 'react-router-dom';
import { Archive, FileText, Vote, ShieldAlert, Home, Scale, Users } from 'lucide-react';
import styles from './Navbar.module.css';
import clsx from 'clsx';

const Navbar = () => {
    const navItems = [
        { path: '/', label: 'Bureau Home', icon: Home },
        { path: '/registry', label: 'Public Registry', icon: Archive },
        { path: '/census', label: 'Cat Census', icon: Users },
        { path: '/submit', label: 'Submit Evidence', icon: FileText },
        { path: '/elections', label: 'Electoral Process', icon: Vote },
        { path: '/civic-duty', label: 'Civic Duty', icon: Scale }, // User Profile
        { path: '/admin', label: 'Internal Affairs', icon: ShieldAlert },
    ];

    return (
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                {navItems.map((item) => (
                    <li key={item.path} className={styles.navItem}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
                        >
                            <item.icon size={18} className={styles.icon} />
                            <span className={styles.label}>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
