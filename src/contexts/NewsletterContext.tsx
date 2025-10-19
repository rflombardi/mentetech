import { createContext, useContext, useState, ReactNode } from 'react';

interface NewsletterContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error('useNewsletter must be used within a NewsletterProvider');
  }
  return context;
};

interface NewsletterProviderProps {
  children: ReactNode;
}

export const NewsletterProvider = ({ children }: NewsletterProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <NewsletterContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </NewsletterContext.Provider>
  );
};