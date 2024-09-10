'use client';

import { MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import Image from "next/image";

const handleMouseMove = (e: MouseEvent, setDimensions: React.Dispatch<SetStateAction<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    ogX: number;
    ogY: number;
}>>, dimensions: MutableRefObject<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    ogX: number;
    ogY: number;
}>) => {
    const { ogX, ogY } = dimensions.current;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const strength = 8;

    let moveX = (mouseX / window.innerWidth - 0.5) * strength;
    let moveY = (mouseY / window.innerHeight - 0.5) * strength;

    setDimensions((prev) => ({
        ...prev,
        offsetX: ogX - moveX,
        offsetY: ogY - moveY,
    }));
};
const updateDimensions = (setDimensions: React.Dispatch<SetStateAction<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    ogX: number;
    ogY: number;
}>>) => {
    const x = window.innerWidth * 1.5;
    const y = window.innerHeight * 1.5;
    const offsetX = -Math.abs(Math.floor(Math.random() * ((x - window.innerWidth) * 1.1)));
    const offsetY = -Math.abs(Math.floor(Math.random() * ((y - window.innerHeight) * 1.1)));
    setDimensions({ x, y, offsetX, offsetY, ogX: offsetX, ogY: offsetY });
};

export default function Background() {
    const tempX = Math.abs(Math.floor(Math.random() * (1920 * 1.5 - 1920)));
    const tempY = Math.abs(Math.floor(Math.random() * (1080 * 1.5 - 1080)));
    const [dimensions, setDimensions] = useState({ x: 4000, y: 4000, offsetX: tempX, offsetY: tempY, ogX: tempX, ogY: tempY });
    const [loaded, setLoaded] = useState(false);
    const offsetX = useRef(dimensions.offsetX);
    const offsetY = useRef(dimensions.offsetY);

    const dimensionsRef = useRef(dimensions);

    useEffect(() => {
        dimensionsRef.current = dimensions;
    }, [dimensions]);

    useEffect(() => {
        // Set initial dimensions and random offsets
        const x = window.innerWidth * 1.5;
        const y = window.innerHeight * 1.5;
        offsetX.current = -Math.abs(Math.floor(Math.random() * ((x - window.innerWidth) * 1.1)));
        offsetY.current = -Math.abs(Math.floor(Math.random() * ((y - window.innerHeight) * 1.1)));

        if(!loaded) {
            window.addEventListener('mousemove', (e) => handleMouseMove(e, setDimensions, dimensionsRef));
            window.addEventListener('resize', () => updateDimensions(setDimensions));
        }
        setDimensions({ x, y, offsetX: offsetX.current, offsetY: offsetY.current, ogX: offsetX.current, ogY: offsetY.current });
        setLoaded(true);
    }, []);

    return (
        <div className="background">
             <Image 
             src="/libray1000x.jpg" 
             alt="libary" 
             className="background-image" 
             style={{
                 objectFit: "cover", 
                 objectPosition: `${dimensions.offsetX}px ${dimensions.offsetY}px` 
             }} 
             width={dimensions.x} 
             height={dimensions.y}
             priority={true}
             placeholder='blur'
             blurDataURL='data:image/jpeg;base64,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'
             />
        </div>
    );
}