import React from "react";


const ResumeSummaryCard: React.FC<{ imgUrl: string | null; title: string; lastUpdate: string, onSelect: () => void }> = ({ imgUrl, title, lastUpdate, onSelect   }) => {
  return (
    <div className="h-[300px] flex flex-col items-center justify-between bg-white border rounded-lg shadow hover:shadow-lg cursor-pointer overflow-hidden"
      onClick={onSelect}
    >
      {/* Card Container */}
      <div className="p-4">
        {/* Image Section */}
        {imgUrl ? (
          <img src={imgUrl} alt="Resume Thumbnail" className="w-[100%] h-[200px] rounded" />
        ) : (
          <div className="w-[100%] h-[200px] rounded  flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        {/* Content Section */}
        <div className="w-full bg-white px-4 py-3">
          <h3 className="text-sm font-medium truncate overflow-hidden mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mt-auto">Dernière MAJ: {lastUpdate}</p>
        </div>
      </div>
      {/* End of ResumeCard */}
    </div>
    );
};

export default ResumeSummaryCard;