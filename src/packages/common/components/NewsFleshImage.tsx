
type NewsFleshesImageProps = {
    prevImage: () => void,
    nextImage: () => void
}

export const NewsFleshesImage = ({ prevImage, nextImage }: NewsFleshesImageProps) => {
    return <>
        <button
            onClick={(e) => {
                e.stopPropagation();
                prevImage();
            }}
            className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
        >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <button
            onClick={(e) => {
                e.stopPropagation();
                nextImage();
            }}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
        >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </>
}