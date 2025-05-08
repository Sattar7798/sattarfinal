import React from 'react';
import Link from 'next/link';

interface Publication {
  id?: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  abstract: string;
  tags: string[];
  imageUrl?: string;
  url: string;
  citations?: number;
}

interface PublicationCardProps {
  publication: Publication;
  className?: string;
  showAbstract?: boolean;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  className = '',
  showAbstract = false
}) => {
  const {
    title,
    authors,
    journal,
    year,
    abstract,
    tags,
    imageUrl,
    url,
    citations
  } = publication;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col ${className}`}
    >
      {imageUrl && (
        <div className="h-48 w-full relative">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          {authors}
        </p>
        
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          <span className="font-medium">{journal}</span>, {year}
          {citations !== undefined && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              {citations} citations
            </span>
          )}
        </div>
        
        {showAbstract && (
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {abstract}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mt-auto mb-3">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Link 
          href={url}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
};

export default PublicationCard; 