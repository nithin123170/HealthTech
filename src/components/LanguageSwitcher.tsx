import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitcher() {
  const { language, setLanguage, availableLanguages } = useLanguage();

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage?.name || 'Language'}</span>
        <ChevronDown className="w-3 h-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'bg-primary/10 text-primary' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">
                {lang.code === 'en' && '🇬🇧'}
                {lang.code === 'kn' && '🇮🇳'}
                {lang.code === 'hi' && '🇮🇳'}
                {lang.code === 'ta' && '🇮🇳'}
                {lang.code === 'te' && '🇮🇳'}
              </span>
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
