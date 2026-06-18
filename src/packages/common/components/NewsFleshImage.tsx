import { LeftArrow } from './LeftArrow';
import { RightArrow } from './RightArrow';

type NewsFleshesImageProps = {
  prevImage: () => void;
  nextImage: () => void;
};

export const NewsFleshesImage = ({ prevImage, nextImage }: NewsFleshesImageProps) => {
  return (
    <>
      <button
        onClick={e => {
          e.stopPropagation();
          prevImage();
        }}
        className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
      >
        <LeftArrow />
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          nextImage();
        }}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
      >
        <RightArrow />
      </button>
    </>
  );
};
