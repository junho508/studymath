"use client";

import { useState, useEffect, useCallback } from 'react';
import { Slider, Text, Group, Button, Paper, Stepper, Progress, Badge } from '@mantine/core';
import { RotateCw, RefreshCcw, ArrowRight, Play, CheckCircle2, Shuffle } from 'lucide-react';

// Type describing a 2D point
interface Point {
    x: number;
    y: number;
    label: string;
}

// Helper to generate a random integer in range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Steps definition
const STEPS = [
    { label: '기준점 찾기', description: '각 점이 중심(O)을 지나 반대편으로 같은 거리만큼 이동합니다.' },
    { label: '도형 완성', description: '대응점을 차례로 연결하여 도형을 완성합니다.' },
    { label: '회전 확인', description: '도형을 180도 돌려 완전히 겹치는지 확인합니다.' }
];

export default function PointSymmetryCanvas() {
    const [activeStep, setActiveStep] = useState(0);
    const [angle, setAngle] = useState(0);

    // -- Shape State --
    const [sourcePoints, setSourcePoints] = useState<Point[]>([]);
    const [shapeId, setShapeId] = useState(0);

    // -- Animation State --
    const [animating, setAnimating] = useState(false);
    const [currentPointIndex, setCurrentPointIndex] = useState(-1);
    const [pointPhase, setPointPhase] = useState<'idle' | 'drawing-to-center' | 'extending' | 'done'>('idle');
    const [connectionProgress, setConnectionProgress] = useState(0);

    // Generate a new random shape (Random 3-6 POINTS)
    const generateShape = useCallback(() => {
        const count = randomInt(3, 6); // Random 3 to 6
        const newPoints: Point[] = [];
        const labels = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];

        // Generate points in Left quadrants (x < 0)
        // Range: x in [-110, -30], y in [-110, 110]
        // Generate points in Left quadrants (x < 0)
        // Range: x in [-110, -30], y in [-110, 110]
        for (let i = 0; i < count; i++) {
            let pt: Point;
            let attempts = 0;
            // Retry to avoid overlapping points
            do {
                pt = {
                    x: randomInt(-110, -30),
                    y: randomInt(-110, 110),
                    label: ''
                };
                attempts++;
            } while (attempts < 10 && newPoints.some(np => Math.hypot(np.x - pt.x, np.y - pt.y) < 25));

            newPoints.push(pt);
        }

        // Sort by Y descending to ensure clean polygon winding (Top -> Bottom)
        newPoints.sort((a, b) => b.y - a.y);

        // Assign labels top-down
        newPoints.forEach((p, i) => p.label = labels[i]);

        setSourcePoints(newPoints);
        setShapeId(prev => prev + 1);

        // Reset states
        setActiveStep(0);
        setAngle(0);
        setAnimating(false);
        setCurrentPointIndex(-1);
        setPointPhase('idle');
        setConnectionProgress(0);
    }, []);

    // Initialize on mount
    useEffect(() => {
        generateShape();
    }, [generateShape]);

    // Derived symmetric points
    const targetPoints = sourcePoints.map(p => ({
        x: -p.x,
        y: -p.y,
        label: p.label + "'"
    }));

    // Full polygon points string (Source + Target)
    const fullShapePoints = [
        ...sourcePoints,
        ...targetPoints
    ];
    const pointsString = fullShapePoints.map(p => `${p.x},${p.y}`).join(' ');
    const halfShapeString = sourcePoints.map(p => `${p.x},${p.y}`).join(' ');

    // -- Animation Effects --

    // Step 0: Point Finding Sequence
    useEffect(() => {
        if (activeStep === 0 && animating) {
            if (currentPointIndex === -1) {
                setCurrentPointIndex(0);
                setPointPhase('drawing-to-center');
                return;
            }

            if (currentPointIndex >= sourcePoints.length) {
                setAnimating(false);
                return;
            }

            let timer: NodeJS.Timeout;

            // Speed up slightly for mobile/5 points
            const delay = 800;

            if (pointPhase === 'drawing-to-center') {
                timer = setTimeout(() => setPointPhase('extending'), delay);
            } else if (pointPhase === 'extending') {
                timer = setTimeout(() => setPointPhase('done'), delay);
            } else if (pointPhase === 'done') {
                timer = setTimeout(() => {
                    setCurrentPointIndex(prev => prev + 1);
                    setPointPhase('drawing-to-center');
                }, 400);
            }

            return () => clearTimeout(timer);
        }
    }, [activeStep, animating, currentPointIndex, pointPhase, sourcePoints.length]);

    // Step 1: Connecting Sequence
    useEffect(() => {
        if (activeStep === 1 && animating) {
            const interval = setInterval(() => {
                setConnectionProgress(prev => {
                    if (prev >= 1) {
                        setAnimating(false);
                        clearInterval(interval);
                        return 1;
                    }
                    return prev + 0.04;
                });
            }, 16);
            return () => clearInterval(interval);
        }
    }, [activeStep, animating]);

    // Step 2: Auto Rotate
    useEffect(() => {
        if (activeStep === 2 && animating) {
            const interval = setInterval(() => {
                setAngle(prev => {
                    if (prev >= 180) {
                        setAnimating(false);
                        return 180;
                    }
                    return prev + 3; // Faster rotation
                });
            }, 16);
            return () => clearInterval(interval);
        }
    }, [activeStep, animating]);


    // Handlers
    const handleStartAnimation = () => setAnimating(true);

    const nextStep = () => {
        if (activeStep < 2) {
            const next = activeStep + 1;
            setActiveStep(next);
            setAnimating(true);

            if (next === 1) setConnectionProgress(0);
            if (next === 2) setAngle(0);
        }
    };

    const isMatch = Math.abs(angle - 180) < 5;

    return (
        <div className="w-full flex flex-col gap-4 pb-10">
            {/* Mobile-first Layout: Vertical Stack */}

            {/* 1. Header & Stepper */}
            <div className="sticky top-0 bg-white/95 backdrop-blur z-40 py-3 border-b border-gray-100 shadow-sm rounded-t-xl transition-all">
                <Stepper active={activeStep} onStepClick={setActiveStep} size="xs" iconSize={24} allowNextStepsSelect={false}>
                    {STEPS.map((s, i) => (
                        <Stepper.Step key={i} /> // Hide labels on mobile to save space
                    ))}
                </Stepper>
                <Text size="sm" ta="center" mt="xs" fw={700} c="blue">
                    단계 {activeStep + 1}: {STEPS[activeStep].label}
                </Text>
            </div>

            {/* 2. Canvas Area - Responsive Aspect Ratio */}
            <div className="w-full aspect-square max-w-md mx-auto relative bg-white border rounded-2xl shadow-sm overflow-hidden touch-none">
                {/* Grid */}
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#dee2e6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="absolute inset-0 grid grid-cols-2 pointer-events-none"><div className="border-r border-gray-300"></div></div>
                <div className="absolute inset-0 grid grid-rows-2 pointer-events-none"><div className="border-b border-gray-300"></div></div>

                {/* Center Point */}
                <div className="absolute left-1/2 top-1/2 -ml-1 -mt-1 w-2 h-2 bg-red-600 rounded-full z-30 ring-2 ring-red-100 shadow-sm"></div>
                <Text size="xs" fw={900} c="red" className="absolute left-1/2 top-1/2 ml-1 mt-1 bg-white/80 px-1 rounded">O</Text>

                <svg viewBox="-150 -150 300 300" className="absolute inset-0 w-full h-full pointer-events-none">
                    <g>
                        {/* Source Shape & Labels */}
                        {/* Source Shape & Labels */}
                        <polyline points={halfShapeString} fill="none" stroke="#228be6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        {sourcePoints.map((p, i) => (
                            <g key={`src-${i}`}>
                                <circle cx={p.x} cy={p.y} r="4" fill="#228be6" stroke="white" strokeWidth="2" />
                                <text x={p.x - 18} y={p.y} dominantBaseline="middle" textAnchor="end" fontSize="14" fill="#1864ab" fontWeight="bold" style={{ textShadow: '0px 0px 4px white' }}>{p.label}</text>
                            </g>
                        ))}

                        {/* Step 0 Animation Lines */}
                        {activeStep === 0 && sourcePoints.map((p, i) => {
                            if (i > currentPointIndex && currentPointIndex !== -1) return null;
                            const isPast = i < currentPointIndex || (currentPointIndex === -1 && false);
                            const isCurrent = i === currentPointIndex;
                            const phase = isCurrent ? pointPhase : 'done';
                            const isDone = isPast || (isCurrent && phase === 'done');
                            const showLineToCenter = isCurrent && (phase !== 'idle');
                            const showExtension = isCurrent && (phase === 'extending' || phase === 'done');

                            return (
                                <g key={`anim-${i}`}>
                                    {(showLineToCenter || isDone) && (
                                        <line x1={p.x} y1={p.y} x2={0} y2={0} stroke="#fab005" strokeWidth="2" strokeDasharray="6 6" opacity={isDone ? 0.4 : 1} />
                                    )}
                                    {(showExtension || isDone) && (
                                        <line x1={0} y1={0} x2={-p.x} y2={-p.y} stroke="#fab005" strokeWidth="2" strokeDasharray="6 6" opacity={isDone ? 0.4 : 1} />
                                    )}
                                    {(isDone) && (
                                        <g>
                                            <circle cx={-p.x} cy={-p.y} r="4" fill="#fa5252" stroke="white" strokeWidth="2" />
                                            <text x={-p.x + 8} y={-p.y} dominantBaseline="middle" textAnchor="start" fontSize="14" fill="#c92a2a" fontWeight="bold" style={{ textShadow: '0px 0px 4px white' }}>{targetPoints[i].label}</text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}

                        {/* Step 1 & 2 Shapes */}
                        {activeStep >= 1 && (
                            <>
                                {targetPoints.map((tp, i) => (
                                    <g key={`tgt-${i}`}>
                                        <circle cx={tp.x} cy={tp.y} r="4" fill="#fa5252" stroke="white" strokeWidth="2" />
                                        <text x={tp.x + 8} y={tp.y} dominantBaseline="middle" textAnchor="start" fontSize="14" fill="#c92a2a" fontWeight="bold" style={{ textShadow: '0px 0px 4px white' }}>{tp.label}</text>
                                    </g>
                                ))}
                                <g transform={activeStep === 2 ? `rotate(${angle})` : ""}>
                                    <polygon
                                        points={pointsString}
                                        fill={activeStep === 2 && isMatch ? "rgba(64, 192, 87, 0.2)" : "rgba(34, 139, 230, 0.1)"}
                                        stroke={activeStep === 2 && isMatch ? "#2b8a3e" : "#fa5252"}
                                        strokeWidth="2"
                                        strokeLinejoin="round"
                                        strokeDasharray={activeStep === 1 ? "1500" : ""}
                                        strokeDashoffset={activeStep === 1 ? 1500 * (1 - connectionProgress) : 0}
                                        className="transition-all duration-300"
                                    />
                                </g>
                            </>
                        )}
                    </g>
                </svg>

                {/* Success Message */}
                {activeStep === 2 && isMatch && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 animate-bounce">
                        <Badge size="xl" color="green" circle={false} className="shadow-xl border-2 border-white px-4 py-3 h-auto">
                            <Group gap={6}>
                                <CheckCircle2 size={24} strokeWidth={3} />
                                <Text size="lg" fw={900}>확인 완료!</Text>
                            </Group>
                        </Badge>
                    </div>
                )}
            </div>

            {/* 3. Controls Area - Mobile Optimized */}
            <Paper radius="md" p="md" withBorder className="bg-gray-50/50">
                <Text size="md" c="dimmed" mb="lg" lh={1.6} className="break-keep text-center">
                    {STEPS[activeStep].description}
                </Text>

                <div className="flex flex-col gap-4">
                    {/* Step 0 Controls */}
                    {activeStep === 0 && (
                        currentPointIndex === -1 ? (
                            <Button fullWidth size="lg" color="blue" onClick={handleStartAnimation} leftSection={<Play fill="currentColor" />}>
                                찾기 시작 ({sourcePoints.length}개 점)
                            </Button>
                        ) : (
                            <div className="w-full bg-white rounded-lg p-3 border border-gray-200">
                                <Group justify="space-between" mb={5}>
                                    <Text size="sm" fw={700} c="blue">진행 중...</Text>
                                    <Text size="sm" c="dimmed">{Math.min(currentPointIndex, sourcePoints.length)} / {sourcePoints.length}</Text>
                                </Group>
                                <Progress value={((currentPointIndex + (pointPhase === 'done' ? 1 : 0.5)) / sourcePoints.length) * 100} animated={animating} size="lg" radius="xl" />
                            </div>
                        )
                    )}

                    {/* Step 2 Controls */}
                    {activeStep === 2 && (
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <Slider
                                value={angle} onChange={setAngle} max={360} label={null}
                                color={isMatch ? 'green' : 'blue'} thumbSize={24} size="lg" mb="md"
                            />
                            <Group grow>
                                <Button size="md" variant="light" onClick={() => setAnimating(true)} disabled={animating || isMatch}>
                                    자동 회전
                                </Button>
                                <Button size="md" variant="default" onClick={() => setAngle(0)}>0°</Button>
                                <Button size="md" variant="default" onClick={() => setAngle(180)}>180°</Button>
                            </Group>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="grid grid-cols-5 gap-2 mt-2">
                        <Button
                            variant="subtle" color="gray" size="lg" className="col-span-1"
                            onClick={generateShape}
                        >
                            <Shuffle size={20} />
                        </Button>

                        {activeStep < 2 ? (
                            <Button
                                className="col-span-4" size="lg"
                                onClick={nextStep} rightSection={<ArrowRight size={20} />}
                                disabled={activeStep === 0 && currentPointIndex < sourcePoints.length}
                            >
                                다음 단계
                            </Button>
                        ) : (
                            <Button
                                className="col-span-4" size="lg" variant="outline" color="blue"
                                onClick={generateShape} leftSection={<RefreshCcw size={20} />}
                            >
                                새 문제 풀기
                            </Button>
                        )}
                    </div>
                </div>
            </Paper>
        </div>
    );
}
