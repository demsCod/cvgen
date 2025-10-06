

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
  showActionBtn?: boolean;
  actionBtnIcon?: React.ReactNode | null;
  actionBtnText?: string;
  onActionClick?: () => void;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick,
}: ModalProps) => {
  
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
          {!hideHeader && (
            <div className="flex items-center justify-between p-4 border-b">
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              <div className="flex items-center gap-2">
                {showActionBtn && actionBtnText && onActionClick && (
                  <button
                    onClick={onActionClick}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    {actionBtnIcon}
                    {actionBtnText}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    );
};

export default Modal;