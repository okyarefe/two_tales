import { BookOpen, CreditCard, Home, HelpCircle, Mail } from 'lucide-react';

// labelKey maps to a key in the "Nav" messages namespace.
export const publicLinks = [
  {
    href: '/how-it-works',
    labelKey: 'howItWorks',
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    href: '/contact',
    labelKey: 'contact',
    icon: <Mail className="w-5 h-5" />,
  },
  {
    href: '/credits',
    labelKey: 'pricing',
    icon: <CreditCard className="w-4 h-4" />,
  },
] as const;

export const privateLinks = [
  {
    href: '/dashboard',
    labelKey: 'dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    href: '/stories',
    labelKey: 'stories',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    href: '/credits',
    labelKey: 'getCredits',
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    href: '/flashcards',
    labelKey: 'flashcards',
    icon: <CreditCard className="w-4 h-4" />,
  },
] as const;
