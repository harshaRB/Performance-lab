import React, { useState, useEffect } from 'react';

const MealTemplates = ({ database, onQuickLog }) => {
    const [templates, setTemplates] = useState([]);
    const [newTemplate, setNewTemplate] = useState({ name: '', items: [] });
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('pl_meal_templates');
            if (saved) setTemplates(JSON.parse(saved));
        } catch (error) {
            console.error('Failed to load meal templates:', error);
        }
    }, []);

    const saveTemplate = () => {
        if (!newTemplate.name || selectedItems.length === 0) return;

        const template = {
            ...newTemplate,
            items: selectedItems,
            id: Date.now()
        };

        const updated = [...templates, template];
        setTemplates(updated);
        try {
            localStorage.setItem('pl_meal_templates', JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to save meal template:', error);
        }

        setNewTemplate({ name: '', items: [] });
        setSelectedItems([]);
    };

    const deleteTemplate = (id) => {
        const updated = templates.filter(t => t.id !== id);
        setTemplates(updated);
        try {
            localStorage.setItem('pl_meal_templates', JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to delete meal template:', error);
        }
    };

    const useTemplate = (template, mealType) => {
        // Log all items from template
        template.items.forEach(item => {
            onQuickLog(item.ingredientId, item.weight, mealType);
        });
    };

    const addItemToTemplate = (ingredientId, weight) => {
        setSelectedItems([...selectedItems, { ingredientId, weight: parseFloat(weight) }]);
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3 className="mono" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>MEAL TEMPLATES</h3>

            {/* Template Builder */}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Template Name (e.g., 'Breakfast Bowl')"
                    value={newTemplate.name}
                    onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    style={{ marginBottom: '1rem' }}
                />

                <div className="grid-2">
                    <select onChange={e => {
                        const ing = database.find(d => d.id == e.target.value);
                        if (ing) document.getElementById('template-weight').focus();
                    }}>
                        <option value="">Select ingredient...</option>
                        {database.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>

                    <input
                        id="template-weight"
                        type="number"
                        placeholder="Weight (g)"
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                const select = e.target.previousElementSibling;
                                addItemToTemplate(select.value, e.target.value);
                                e.target.value = '';
                                select.value = '';
                            }
                        }}
                    />
                </div>

                {selectedItems.length > 0 && (
                    <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                        <p className="label">ITEMS IN TEMPLATE:</p>
                        {selectedItems.map((item, i) => {
                            const ing = database.find(d => d.id == item.ingredientId);
                            return (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                    <span>{ing?.name}</span>
                                    <span className="mono">{item.weight}g</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <button className="primary-btn" onClick={saveTemplate} style={{ marginTop: '1rem' }}>
                    SAVE TEMPLATE
                </button>
            </div>

            {/* Saved Templates */}
            {templates.length > 0 && (
                <div>
                    <p className="label">SAVED TEMPLATES</p>
                    {templates.map(template => (
                        <div key={template.id} className="card" style={{ marginBottom: '0.5rem', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{template.name}</strong>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {template.items.length} items
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {['breakfast', 'lunch', 'dinner'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => useTemplate(template, type)}
                                            style={{
                                                padding: '0.5rem',
                                                background: 'transparent',
                                                border: '1px solid var(--accent-nutrition)',
                                                color: 'var(--accent-nutrition)',
                                                cursor: 'pointer',
                                                fontSize: '0.7rem',
                                                fontFamily: 'var(--font-mono)'
                                            }}
                                        >
                                            {type.toUpperCase()}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => deleteTemplate(template.id)}
                                        style={{
                                            padding: '0.5rem',
                                            background: 'transparent',
                                            border: '1px solid var(--accent-danger)',
                                            color: 'var(--accent-danger)',
                                            cursor: 'pointer',
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MealTemplates;
