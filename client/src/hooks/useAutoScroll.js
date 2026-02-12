import { useEffect, useRef } from 'react';

const useAutoScroll = (dependency) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [dependency]);

    return scrollRef;
};

export default useAutoScroll;
