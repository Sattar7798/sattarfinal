import React from 'react';

declare module '@/components/layout/Container' {
  interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  }
  
  const Container: React.FC<ContainerProps>;
  export default Container;
}

declare module '@/components/layout/Section' {
  interface SectionProps {
    children: React.ReactNode;
    className?: string;
  }
  
  const Section: React.FC<SectionProps>;
  export default Section;
}

declare module '@/components/layout/PageHeader' {
  interface PageHeaderProps {
    title: string;
    subtitle?: string;
    imageUrl?: string;
  }
  
  const PageHeader: React.FC<PageHeaderProps>;
  export default PageHeader;
}

declare module '@/components/layout/LayoutFix' {
  interface LayoutProps {
    children: React.ReactNode;
  }
  
  const Layout: React.FC<LayoutProps>;
  export default Layout;
}

declare module '@/components/ui/Icons' {
  interface IconProps {
    size?: number;
    color?: string;
    className?: string;
  }
  
  export const EmailIcon: React.FC<IconProps>;
  export const PhoneIcon: React.FC<IconProps>;
  export const LocationIcon: React.FC<IconProps>;
  export const ClockIcon: React.FC<IconProps>;
  export const HomeIcon: React.FC<IconProps>;
  export const ArrowRightIcon: React.FC<IconProps>;
  export const SearchIcon: React.FC<IconProps>;
  export const ChevronDownIcon: React.FC<IconProps>;
  export const CalendarIcon: React.FC<IconProps>;
  export const ExternalLinkIcon: React.FC<IconProps>;
} 