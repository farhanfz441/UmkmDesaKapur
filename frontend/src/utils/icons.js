import { Utensils, Printer, Shirt, Wrench, ShoppingBasket, Scissors, Store } from 'lucide-react';

export const iconMap = {
  utensils: Utensils,
  printer: Printer,
  shirt: Shirt,
  wrench: Wrench,
  'shopping-basket': ShoppingBasket,
  scissors: Scissors,
  store: Store,
};

export function getIconComponent(name) {
  return iconMap[name] || Store;
}
