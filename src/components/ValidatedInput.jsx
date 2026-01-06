import React, { useState } from 'react';
import { validators } from '../utils/validation';

const ValidatedInput = ({
    type = 'number',
    value,
    onChange,
    validator,
    placeholder,
    label,
    className = '',
    ...props
}) => {
    const [error, setError] = useState(null);
    const [touched, setTouched] = useState(false);

    const handleChange = (e) => {
        const newValue = e.target.value;

        if (validator && validators[validator]) {
            const result = validators[validator](newValue);
            if (!result.valid) {
                setError(result.error);
            } else {
                setError(null);
            }
        }

        onChange(e);
    };

    const handleBlur = () => {
        setTouched(true);
    };

    const showError = touched && error;

    return (
        <div className={`input-group ${className}`}>
            {label && <label className="label">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                style={{
                    borderColor: showError ? 'var(--accent-danger)' : undefined,
                    ...props.style
                }}
                {...props}
            />
            {showError && (
                <div style={{
                    color: 'var(--accent-danger)',
                    fontSize: '0.7rem',
                    marginTop: '0.25rem',
                    fontFamily: 'var(--font-mono)'
                }}>
                    ⚠ {error}
                </div>
            )}
        </div>
    );
};

export default ValidatedInput;
