"use client";

import { useState, useEffect, useCallback } from 'react';
import { Slider, Text, Group, Paper, Button } from '@mantine/core';
import { Shuffle } from 'lucide-react';

const SHAPES = [
    {
        name: '나비',
        // Right half path (starts at x=0)
        path: "M0,10 C40,10 80,40 60,64 C80,90 40,118 0,118 Z",
        color: "#fab005",
        stroke: "#e67700"
    },
    {
        name: '하트',
        path: "M0,30 C0,10 30,0 50,20 C70,40 50,60 0,110 Z",
        color: "#fa5252",
        stroke: "#c92a2a"
    },
    {
        name: '나무',
        path: "M0,10 L40,40 L20,40 L50,80 L10,80 L10,110 L0,110 Z",
        color: "#40c057",
        stroke: "#2b8a3e"
    },
    {
        name: '화살표',
        path: "M0,10 L50,50 L20,50 L20,110 L0,110 Z",
        color: "#228be6",
        stroke: "#1864ab"
    },
    {
        name: '별',
        path: "M0,10 L15,50 L55,50 L25,75 L35,115 L0,90 Z",
        color: "#be4bdb",
        stroke: "#862e9c"
    }
];

export default function LineSymmetryCanvas() {
    const [fold, setFold] = useState(0); // 0 to 100% folded
    const [isAnimating, setIsAnimating] = useState(false);
    const [shapeIndex, setShapeIndex] = useState(0);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setShapeIndex(Math.floor(Math.random() * SHAPES.length));
        setHydrated(true);
    }, []);

    const animateFold = () => {
        setIsAnimating(true);
        setFold(0);
        let current = 0;
        const interval = setInterval(() => {
            current += 2;
            if (current >= 100) {
                current = 100;
                clearInterval(interval);
                setIsAnimating(false);
            }
            setFold(current);
        }, 16);
    };

    const reset = () => {
        setFold(0);
        setIsAnimating(false);
    };

    const changeShape = () => {
        // Pick a random shape different from current
        let next;
        do {
            next = Math.floor(Math.random() * SHAPES.length);
        } while (next === shapeIndex && SHAPES.length > 1);

        setShapeIndex(next);
        setFold(0);
    };

    const currentShape = SHAPES[shapeIndex];

    if (!hydrated) return <div className="h-full flex items-center justify-center">Loading...</div>;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[200px] h-40 flex items-center justify-center perspective-[800px] mb-4">
                {/* Left Half (Static Base) - Mirrored Right Path */}
                <div className="absolute right-1/2 w-24 h-32 border-r-2 border-dashed border-red-400 flex items-center justify-end overflow-hidden">
                    <svg width="100" height="128" viewBox="0 0 100 128" className="translate-x-[1px]">
                        {/* Scale X -1 to flip, Translate -100 to move back to origin? 
                            Actually, if we flip around x=0, negative x becomes positive. 
                            If the original path is 0..100, flipping makes it -100..0.
                            We want it to appear coming from the right edge (x=100) going left.
                            So we need to map 0 -> 100, 50 -> 50, 100 -> 0.
                            This is done by scale(-1, 1) and translate(-100, 0). 
                        */}
                        <g transform="translate(100, 0) scale(-1, 1)">
                            <path d={currentShape.path} fill="#e9ecef" stroke="#adb5bd" strokeWidth="2" />
                        </g>
                    </svg>
                </div>

                {/* Right Half (Folding) */}
                <div
                    className="absolute left-1/2 w-24 h-32 border-l-0 origin-left"
                    style={{
                        transform: `rotateY(-${fold * 1.8}deg)`,
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'visible' // Ensure visibility during fold
                    }}
                >
                    <svg width="100" height="128" viewBox="0 0 100 128">
                        <path d={currentShape.path} fill={currentShape.color} stroke={currentShape.stroke} strokeWidth="2" />
                    </svg>
                </div>

                <div className="absolute bottom-0 text-xs text-gray-400 mt-2">대칭축</div>
            </div>

            <Group>
                <Button variant="subtle" color="gray" size="sm" onClick={changeShape}>
                    <Shuffle size={16} />
                </Button>
                <Button size="sm" onClick={animateFold} disabled={isAnimating || fold === 100} variant="filled" color="green">
                    반으로 접기
                </Button>
                <Button size="sm" onClick={reset} disabled={isAnimating || fold === 0} variant="light" color="gray">
                    펼치기
                </Button>
            </Group>
        </div>
    );
}
