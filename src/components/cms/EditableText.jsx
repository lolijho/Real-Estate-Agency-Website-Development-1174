import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCMS } from '../../context/CMSContext';

const { FiEdit2, FiCheck, FiX } = FiIcons;

const EditableText = ({ 
  sectionId, 
  field, 
  defaultValue, 
  className = '', 
  tag = 'div',
  placeholder = 'Clicca per modificare',
  multiline = false,
  maxLength = null
}) => {
  const { canEdit, getContent, updateContent } = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  const content = getContent(sectionId, field, defaultValue);

  useEffect(() => {
    if (isEditing) {
      setEditValue(content);
      // Focus sull'input dopo il render
      setTimeout(() => {
        if (multiline && textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        } else if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isEditing, content, multiline]);

  const handleStartEdit = () => {
    if (!canEdit) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim() !== content) {
      updateContent(sectionId, field, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (multiline) {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    } else {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    }
  };

  const renderContent = () => {
    const content = getContent(sectionId, field, defaultValue);
    const displayContent = content || placeholder;
    
    if (multiline) {
      return displayContent.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < displayContent.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    }
    
    return displayContent;
  };

  const Tag = tag;

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`${className} border-2 border-primary-500 rounded-md p-2 resize-none w-full min-h-[100px]`}
              placeholder={placeholder}
              maxLength={maxLength}
              rows={4}
            />
            {maxLength && (
              <div className="absolute bottom-1 right-1 text-xs text-gray-400">
                {editValue.length}/{maxLength}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`${className} border-2 border-primary-500 rounded-md p-2 w-full`}
              placeholder={placeholder}
              maxLength={maxLength}
            />
            {maxLength && (
              <div className="absolute bottom-1 right-1 text-xs text-gray-400">
                {editValue.length}/{maxLength}
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
          >
            <SafeIcon icon={FiCheck} className="h-3 w-3" />
            <span>Salva</span>
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiX} className="h-3 w-3" />
            <span>Annulla</span>
          </button>
          {multiline && (
            <span className="text-xs text-gray-500">
              Ctrl+Enter per salvare, Esc per annullare
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative ${canEdit ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => canEdit && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleStartEdit}
      whileHover={canEdit ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Tag 
        className={`${className} ${canEdit && isHovered ? 'bg-blue-50 rounded-md p-1' : ''} ${!content && canEdit ? 'text-gray-400 italic' : ''}`}
      >
        {renderContent()}
      </Tag>
      
      {canEdit && isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full p-1 shadow-lg"
        >
          <SafeIcon icon={FiEdit2} className="h-3 w-3" />
        </motion.div>
      )}
      
      {canEdit && !content && (
        <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-md opacity-50 pointer-events-none" />
      )}
    </motion.div>
  );
};

export default EditableText; 