import React, { useState } from 'react';
import { useFormStore } from '../../store/formStore';
import Button from '../ui/Button';
import { 
  Save, 
  Eye, 
  Share2, 
  Copy, 
  Undo2, 
  Redo2, 
  Moon, 
  Sun,
  FileText
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { nanoid } from 'nanoid';

interface ShareModalProps {
  formId: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ formId, onClose }) => {
  const shareUrl = `${window.location.origin}/view/${formId}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Share Form</h3>
        <p className="mb-4 text-muted-foreground">
          Anyone with this link can view and submit the form:
        </p>
        
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded-l-md bg-muted"
            value={shareUrl}
            readOnly
          />
          <Button
            onClick={copyToClipboard}
            className="rounded-l-none"
            leftIcon={<Copy size={16} />}
          >
            Copy
          </Button>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const FormHeader: React.FC = () => {
  const { 
    form, 
    updateForm, 
    saveForm, 
    togglePreview, 
    showPreview,
    undo,
    redo,
  } = useFormStore();
  
  const { theme, toggleTheme } = useTheme();
  const [showShareModal, setShowShareModal] = useState(false);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({ title: e.target.value });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({ description: e.target.value });
  };
  
  const handleSave = () => {
    saveForm();
  };
  
  const handleShare = () => {
    saveForm();
    setShowShareModal(true);
  };
  
  return (
    <div className="border-b border-border p-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/30 rounded px-2 py-1 w-full"
            value={form.title}
            onChange={handleTitleChange}
            placeholder="Form Title"
          />
          <input
            type="text"
            className="text-sm text-muted-foreground bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/30 rounded px-2 py-1 w-full mt-1"
            value={form.description}
            onChange={handleDescriptionChange}
            placeholder="Form Description"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            leftIcon={<Undo2 size={16} />}
          >
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            leftIcon={<Redo2 size={16} />}
          >
            Redo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            leftIcon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
          <Button
            variant={showPreview ? 'primary' : 'outline'}
            size="sm"
            onClick={togglePreview}
            leftIcon={<Eye size={16} />}
          >
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 size={16} />}
          >
            Share
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={<Save size={16} />}
          >
            Save
          </Button>
        </div>
      </div>
      
      {showShareModal && (
        <ShareModal 
          formId={form.id} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
};

export default FormHeader;