import React from 'react';

interface TagProps {
    label: string;
    isUniversity?: boolean;
    onRemove: (label: string) => void;
}

const Tag: React.FC<TagProps> = ({ label, isUniversity, onRemove }) => {
    const tagStyle = isUniversity ? "bg-orange rounded text-black w-auto p-1 text-left align-top" : "bg-blue-600 rounded text-white w-auto p-1 text-left align-top";

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents the click from propagating to the parent span
        onRemove(label);
    };

    return (
        <span className={`badge ${tagStyle} m-1`} onClick={(e) => e.stopPropagation()}>
            {label} <span style={{ cursor: 'pointer' }} onClick={handleRemoveClick}>&times;</span>
        </span>
    );
};

export default Tag;
