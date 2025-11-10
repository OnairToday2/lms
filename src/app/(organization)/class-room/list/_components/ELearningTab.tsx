interface ELearningTabProps {
    isActive: boolean;
}

const ELearningTab = ({ isActive }: ELearningTabProps) => {
    if (!isActive) {
        return null;
    }

    return (
        <h1>ELearningTab</h1>
    );
}

export default ELearningTab;
