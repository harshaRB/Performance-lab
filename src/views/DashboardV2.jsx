import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import BentoGrid from '../components/dashboard/BentoGrid';
import { NutritionTracker } from '../components/NutritionTracker';
import { ReadingTracker } from '../components/ReadingTracker';
import { ScreenTimeTracker } from '../components/ScreenTimeTracker';
import { HydrationTracker } from '../components/HydrationTracker';
import { TrainingTracker, SleepTracker } from '../components/PhysicalRecovery';

// Modal Wrapper 
const TrackerModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0F1115] w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl relative"
            >
                <div className="sticky top-0 bg-[#0F1115]/90 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

const Dashboard = () => {
    const [activeModal, setActiveModal] = useState(null);

    return (
        <>
            <BentoGrid onOpenModule={setActiveModal} />

            <AnimatePresence>
                {activeModal && (
                    <TrackerModal
                        isOpen={!!activeModal}
                        onClose={() => setActiveModal(null)}
                        title={activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}
                    >
                        {activeModal === 'nutrition' && (
                            <div className="space-y-8">
                                <HydrationTracker />
                                <NutritionTracker />
                            </div>
                        )}
                        {activeModal === 'training' && <TrainingTracker />}
                        {activeModal === 'sleep' && <SleepTracker />}
                        {activeModal === 'learning' && <ReadingTracker />}
                        {activeModal === 'screen' && <ScreenTimeTracker />}
                    </TrackerModal>
                )}
            </AnimatePresence>
        </>
    );
};

export default Dashboard;
