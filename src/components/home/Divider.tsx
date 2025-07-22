import { useEffect, useRef, useState } from "react";

function Divider() {
    const dividerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
        if (!dividerRef.current) return;
        const rect = dividerRef.current.getBoundingClientRect();
        // Show divider when it's at least 40px from the top of the viewport
        setVisible(rect.top < window.innerHeight - 40);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex justify-center items-center w-full my-8">
            <div
                ref={dividerRef}
                className={`h-0.5 w-3/4 bg-muted rounded-full shadow-sm transition-opacity duration-700 relative ${visible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 50%, black 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%, black 50%, transparent 100%)',
                }}
            />
        </div>
    )
}

export { Divider };