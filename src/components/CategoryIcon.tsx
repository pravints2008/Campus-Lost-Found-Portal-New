import React from 'react';
import { ItemCategory } from '../types';
import { 
  CreditCard, 
  CupSoda, 
  BookOpen, 
  Wallet as WalletIcon, 
  Headphones, 
  Key, 
  Package
} from 'lucide-react';

interface CategoryIconProps {
  category: ItemCategory;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-4 h-4' }) => {
  switch (category) {
    case 'ID Card':
      return <CreditCard className={className} />;
    case 'Water Bottle':
      return <CupSoda className={className} />;
    case 'Books':
      return <BookOpen className={className} />;
    case 'Wallet':
      return <WalletIcon className={className} />;
    case 'Earphones':
      return <Headphones className={className} />;
    case 'Keys':
      return <Key className={className} />;
    case 'Others':
    default:
      return <Package className={className} />;
  }
};
