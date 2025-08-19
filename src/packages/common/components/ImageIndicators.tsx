import { News } from '../../news/types/news.types';

type ImageIndicatorsProps = {
    news: News,
    setCurrentImageIndex: (value: number) => void,
    currentImageIndex: number
}

export const ImageIndicators = ({ news, setCurrentImageIndex, currentImageIndex } : ImageIndicatorsProps) => {
    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {news.imageUrl!.map((_, index: number) => (
                <button
                    key={index}
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                    }}
                    className={`h-3 w-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                />
            ))}
        </div>
    )
}