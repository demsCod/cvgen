import React from 'react';
import { MoreVertical, Trash2, Edit, Eye } from 'lucide-react';
import TemplateOne from '../ResumeTemplates/TemplateOne';
import type { ResumeData } from '../ResumeTemplates/RenderResume';

interface Props {
  title: string;
  lastUpdate: string;
  resumeData: ResumeData;
  isDeleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

const CvPreviewCard: React.FC<Props> = ({ 
  title, 
  lastUpdate, 
  resumeData,
  isDeleting,
  onEdit,
  onDelete,
  onView
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Ferme le menu si on clique en dehors
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative group bg-white border rounded-lg shadow-sm hover:shadow-md transition-all ${
      isDeleting ? 'opacity-50 pointer-events-none animate-pulse' : ''
    }`}>
      {/* Preview du CV */}
      <div 
        className="h-[200px] overflow-hidden cursor-pointer border-b"
        onClick={onView}
      >
        <div className="transform scale-[0.2] origin-top-left -translate-x-1/4 -translate-y-1/4">
          <TemplateOne 
            templateId="preview"
            resumeData={resumeData}
            template="template1"
          />
        </div>
      </div>

      {/* Infos et Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Modifié le {lastUpdate}</p>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {/* Menu contextuel */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-[100] overflow-visible">
                <div className="overflow-hidden">
                  <div className="relative py-1">
                    <button
                      onClick={() => { onEdit(); setShowMenu(false); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                    <button
                      onClick={() => { onView(); setShowMenu(false); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Visualiser
                    </button>
                    <button
                      onClick={() => { onDelete(); setShowMenu(false); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvPreviewCard;