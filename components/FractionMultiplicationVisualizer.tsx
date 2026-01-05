"use client";

import { useState, useEffect } from 'react';
import { SegmentedControl, Text, Paper, Group, NumberInput, Slider, Stack, Button, Divider, Title, ThemeIcon, Transition } from '@mantine/core';
import { RefreshCcw, LayoutDashboard, Calculator, X } from 'lucide-react';

type Mode = 'nat_unit' | 'nat_proper' | 'nat_mixed' | 'frac_frac';

interface Fraction {
    n: number; // numerator
    d: number; // denominator
    w?: number; // whole number part for mixed fractions
}

const MODES = [
    { label: '(자연수) × (단위분수)', value: 'nat_unit' },
    { label: '(자연수) × (진분수)', value: 'nat_proper' },
    { label: '(자연수) × (대분수)', value: 'nat_mixed' },
    { label: '(분수) × (분수)', value: 'frac_frac' },
];

export default function FractionMultiplicationVisualizer() {
    const [mode, setMode] = useState<Mode>('nat_unit');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // State for operands
    const [natural, setNatural] = useState(3);
    const [frac1, setFrac1] = useState<Fraction>({ n: 1, d: 4 }); // For Frac x Frac, this is the first fraction
    const [frac2, setFrac2] = useState<Fraction>({ n: 2, d: 3 }); // For Frac x Frac, this is the second fraction

    // Reset handlers when mode changes
    const handleModeChange = (val: string | null) => {
        if (!val) return;
        const newMode = val as Mode;
        setMode(newMode);
        if (newMode === 'nat_unit') { // (자연수) x (단위분수)
            setNatural(3);
            setFrac1({ n: 1, d: 4 });
        } else if (newMode === 'nat_proper') { // (자연수) x (진분수)
            setNatural(3);
            setFrac1({ n: 2, d: 5 });
        } else if (newMode === 'nat_mixed') { // (자연수) x (대분수)
            setNatural(2);
            setFrac1({ w: 1, n: 1, d: 3 });
        } else if (newMode === 'frac_frac') { // (분수) x (분수)
            setFrac1({ n: 3, d: 4 });
            setFrac2({ n: 1, d: 2 });
        }
    };

    // --- Visualization Renderers ---

    // 1. Natural x Fraction (Bar Model / Repeated Addition)
    const renderNaturalXFraction = () => {
        const isMixed = mode === 'nat_mixed';
        const wholePart = isMixed ? (frac1.w || 0) : 0;

        // Calculate result values
        const improperNumerator = frac1.d * wholePart + frac1.n; // Single fraction's numerator (improper)
        const totalNumerator = natural * improperNumerator;      // Total result numerator
        const resultWhole = Math.floor(totalNumerator / frac1.d);
        const resultRem = totalNumerator % frac1.d;

        const unitSize = 40; // Slightly smaller to fit side-by-side

        // For mixed visualization:
        // Part 1: Natural * Whole
        const part1Whole = natural * wholePart;

        // Part 2: Natural * Fraction
        const part2Numerator = natural * frac1.n;
        const part2Whole = Math.floor(part2Numerator / frac1.d);
        const part2Rem = part2Numerator % frac1.d;

        const finalWhole = part1Whole + part2Whole;
        const finalRem = part2Rem;

        // Special render for Mixed Fraction (Distributive Property)
        if (isMixed) {
            return (
                <div className="flex flex-col items-center gap-8 w-full pb-4 px-2">
                    {/* Equation Header - Mixed Specific */}
                    <div className="flex flex-wrap justify-center items-center gap-2 text-xl md:text-2xl font-bold text-gray-800 bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-full max-w-4xl">
                        <span className="text-blue-600 font-black">{natural}</span>
                        <span className="text-gray-400">×</span>
                        <div className="flex items-center gap-1 mx-2 p-1 bg-gray-50 rounded">
                            <span className="text-gray-700 font-bold">{wholePart}</span>
                            <div className="flex flex-col items-center leading-none scale-90">
                                <span className="border-b-2 border-gray-600 w-full text-center px-1">{frac1.n}</span>
                                <span className="text-gray-600">{frac1.d}</span>
                            </div>
                        </div>
                        <span className="text-gray-400">=</span>

                        {/* Distributive breakdown */}
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                            <span className="text-gray-500">(</span>
                            <span className="text-blue-600">{natural}</span>
                            <span>×</span>
                            <span className="text-indigo-600">{wholePart}</span>
                            <span className="text-gray-500">)</span>
                            <span className="text-gray-400">+</span>
                            <span className="text-gray-500">(</span>
                            <span className="text-blue-600">{natural}</span>
                            <span>×</span>
                            <div className="flex flex-col items-center leading-none scale-75">
                                <span className="border-b-2 border-gray-600 w-full text-center px-1">{frac1.n}</span>
                                <span className="text-gray-600">{frac1.d}</span>
                            </div>
                            <span className="text-gray-500">)</span>
                        </div>

                        <span className="text-gray-400">=</span>
                        <span className="text-blue-800 font-black">
                            {finalWhole}
                            {finalRem !== 0 && (
                                <span className="ml-1 inline-flex flex-col items-center align-middle leading-none scale-90">
                                    <span className="border-b-2 border-blue-800 px-1">{finalRem}</span>
                                    <span>{frac1.d}</span>
                                </span>
                            )}
                        </span>
                    </div>

                    {/* Visualization Area: Distributive Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">

                        {/* PROCESS 1: Natural x Whole (Integer Part) */}
                        <Paper p="md" withBorder className="bg-indigo-50/50 flex flex-col items-center min-h-[250px]">
                            <Text size="sm" fw={700} c="indigo.7" className="self-start mb-2">
                                ① 자연수 부분 ({natural} × {wholePart})
                            </Text>
                            <div className="flex-1 flex flex-wrap content-center justify-center gap-2">
                                {Array.from({ length: natural }).map((_, i) => (
                                    <div key={i} className="flex gap-1 bg-white p-2 rounded border border-indigo-100 shadow-sm animate-in zoom-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                        {Array.from({ length: wholePart }).map((__, j) => (
                                            <div key={j} className="w-12 h-12 bg-indigo-400 border-2 border-indigo-600 flex items-center justify-center text-white font-bold text-lg rounded-sm shadow-sm relative">
                                                1
                                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full text-[10px] text-gray-500 flex items-center justify-center border border-gray-200">
                                                    {(i * wholePart) + j + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <Text fw={700} c="indigo" mt="sm">= {part1Whole}</Text>
                        </Paper>

                        {/* PROCESS 2: Natural x Fraction (Fraction Part) */}
                        <Paper p="md" withBorder className="bg-blue-50/50 flex flex-col items-center min-h-[250px]">
                            <Text size="sm" fw={700} c="blue.7" className="self-start mb-2">
                                ② 분수 부분 ({natural} × {frac1.n}/{frac1.d})
                            </Text>

                            <div className="flex-1 flex items-center gap-4 w-full">
                                {/* Separated (Left) */}
                                <div className="flex flex-col items-center gap-2 p-2 border-r border-dashed border-gray-300 pr-4">
                                    <Text size="xs" c="dimmed">모으기전</Text>
                                    <div className="flex flex-wrap justify-center gap-2 max-w-[150px]">
                                        {Array.from({ length: natural }).map((_, i) => (
                                            <div key={i} className="relative bg-white border border-gray-300 shadow-sm animate-in zoom-in duration-500" style={{ width: unitSize, height: unitSize, animationDelay: `${i * 100 + 300}ms` }}>
                                                <div className="absolute inset-0 flex flex-col">
                                                    {Array.from({ length: frac1.d }).map((__, fi) => (
                                                        <div key={fi} className={`flex-1 w-full border-b border-gray-300 last:border-0 ${fi < frac1.n ? 'bg-blue-400' : 'bg-transparent'}`}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="text-gray-400 animate-pulse">➔</div>

                                {/* Combined (Right) */}
                                <div className="flex flex-col items-center gap-2 flex-1">
                                    <Text size="xs" c="dimmed">합치면</Text>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {Array.from({ length: Math.ceil(part2Numerator / frac1.d) }).map((_, boxIndex) => {
                                            const startIdx = boxIndex * frac1.d;
                                            return (
                                                <div key={`res-m-box-${boxIndex}`} className="relative bg-white border-2 border-blue-500 shadow-sm" style={{ width: unitSize, height: unitSize }}>
                                                    <div className="w-full h-full flex flex-col">
                                                        {Array.from({ length: frac1.d }).map((__, fi) => {
                                                            const segmentGlobalIndex = startIdx + fi;
                                                            const isFilled = segmentGlobalIndex < part2Numerator;
                                                            return (
                                                                <div key={fi} className={`flex-1 w-full border-b border-gray-400 last:border-0 transition-colors duration-300`}
                                                                    style={{ backgroundColor: isFilled ? '#60a5fa' : 'transparent', transitionDelay: isFilled ? `${segmentGlobalIndex * 50 + 800}ms` : '0ms' }}></div>
                                                            );
                                                        })}
                                                    </div>
                                                    {/* Whole Marker */}
                                                    {(Math.min(frac1.d, Math.max(0, part2Numerator - startIdx)) === frac1.d) && (
                                                        <div className="absolute inset-0 flex items-center justify-center text-blue-700 font-bold text-lg opacity-0 animate-in fade-in duration-500 fill-mode-forwards" style={{ animationDelay: `${1500 + boxIndex * 200}ms` }}>1</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Text fw={700} c="blue" mt="xs">
                                        = {part2Whole > 0 ? part2Whole : ''}
                                        {part2Rem > 0 && <span className="ml-1 inline-flex flex-col items-center align-middle leading-none scale-90 align-baseline"><span className="border-b border-blue-700">{part2Rem}</span><span>{frac1.d}</span></span>}
                                    </Text>
                                </div>
                            </div>
                        </Paper>
                    </div>

                    {/* Final Combine Step */}
                    <div className="flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-700 fade-in fill-mode-forwards" style={{ animationDelay: '1000ms' }}>
                        <Paper p="md" radius="lg" className="bg-green-50 border-2 border-green-200">
                            <Text fw={700} c="green.8" ta="center" mb="xs">최종 결과</Text>
                            <Group align="center" gap="lg">
                                <div className="text-center">
                                    <Text size="xs" c="dimmed">자연수끼리</Text>
                                    <Text fw={900} size="xl" c="indigo">{part1Whole}</Text>
                                </div>
                                <div className="text-2xl text-gray-400">+</div>
                                <div className="text-center">
                                    <Text size="xs" c="dimmed">분수끼리</Text>
                                    <Text fw={900} size="xl" c="blue">
                                        {part2Whole > 0 && part2Whole}
                                        {part2Rem > 0 && <span className="ml-1 inline-flex flex-col items-center align-middle leading-none text-base"><span className="border-b border-blue-700">{part2Rem}</span><span>{frac1.d}</span></span>}
                                    </Text>
                                </div>
                                <div className="text-2xl text-gray-400">=</div>
                                <Text fw={900} size="xl" c="green.7" className="bg-white px-4 py-2 rounded-lg border border-green-200 shadow-sm">
                                    {finalWhole}
                                    {finalRem !== 0 && (
                                        <span className="ml-2 inline-flex flex-col items-center align-middle leading-none text-lg">
                                            <span className="border-b-2 border-green-700 px-1">{finalRem}</span>
                                            <span>{frac1.d}</span>
                                        </span>
                                    )}
                                </Text>
                            </Group>
                        </Paper>
                    </div>
                </div>
            );
        }

        // Standard render for Proper Fractions & Unit Fractions (Existing Logic)
        return (
            <div className="flex flex-col items-center gap-6 w-full pb-4 px-2">
                {/* Equation Header */}
                <div className="flex flex-wrap justify-center items-center gap-3 text-2xl md:text-3xl font-black font-mono text-gray-800 bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-full max-w-3xl">
                    <span className="text-blue-600">{natural}</span>
                    <span className="text-gray-400">×</span>
                    {/* Proper/Unit Fraction Display */}
                    <div className="flex items-center gap-1">
                        <div className="flex flex-col items-center leading-none">
                            <span className="border-b-2 border-gray-800 w-full text-center px-1">{frac1.n}</span>
                            <span className="text-gray-700">{frac1.d}</span>
                        </div>
                    </div>
                    <span className="text-gray-400">=</span>
                    {/* Result Fraction Display */}
                    <div className="flex items-center gap-2 text-blue-700">
                        {/* Improper Fraction Result */}
                        <div className="flex flex-col items-center leading-none">
                            <span className="border-b-2 border-blue-700 w-full text-center px-1">{totalNumerator}</span>
                            <span>{frac1.d}</span>
                        </div>
                        {/* Mixed Number Result (if applicable) */}
                        {totalNumerator >= frac1.d && resultRem !== 0 && (
                            <>
                                <span className="text-gray-400 text-xl">=</span>
                                <div className="flex items-center">
                                    <span className="mr-2 text-3xl">{resultWhole}</span>
                                    <div className="flex flex-col items-center leading-none">
                                        <span className="border-b-2 border-blue-700 w-full text-center px-1">{resultRem}</span>
                                        <span>{frac1.d}</span>
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Integer Result (if applicable) */}
                        {resultRem === 0 && (
                            <>
                                <span className="text-gray-400 text-xl">=</span>
                                <span className="text-3xl">{resultWhole}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Visualization Area: Side-by-Side Grid - Forced Horizontal */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 md:gap-4 w-full max-w-4xl items-stretch overflow-x-auto">

                    {/* Step 1: Individual Parts (Left Panel) */}
                    <Paper p="sm" withBorder className="bg-blue-50/50 relative flex flex-col items-center min-h-[300px] min-w-[150px]">
                        <Text size="xs" fw={700} c="blue.5" className="self-start mb-4">
                            과정 1: 따로따로 ({natural}개)
                        </Text>

                        {/* Flex container */}
                        <div className="flex flex-wrap justify-center content-start gap-3 w-full h-full">
                            {Array.from({ length: natural }).map((_, i) => (
                                <Stack key={i} gap={2} align="center" className="animate-in zoom-in-50 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="relative bg-white border border-gray-300 shadow-sm"
                                        style={{
                                            width: unitSize,
                                            height: unitSize * 1.5 // Fixed height for proper/unit
                                        }}>

                                        <div className="w-full h-full flex flex-col gap-1 p-0.5">
                                            {/* Fraction Part */}
                                            <div className={`w-full h-full flex flex-col border border-gray-400`}>
                                                {Array.from({ length: frac1.d }).map((__, fi) => (
                                                    <div key={fi} className={`flex-1 w-full border-b border-gray-400 last:border-0 ${fi < frac1.n ? 'bg-blue-400' : 'bg-transparent'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <Text fz={10} c="dimmed">({i + 1})</Text>
                                </Stack>
                            ))}
                        </div>
                    </Paper>

                    {/* Animated Arrow (Middle) */}
                    <div className="flex items-center justify-center h-full px-1">
                        <div className="text-3xl text-gray-300 font-bold animate-pulse">
                            ➔
                        </div>
                    </div>

                    {/* Step 2: Combined Result (Right Panel) */}
                    <Paper p="sm" withBorder className="bg-green-50/50 relative flex flex-col items-center min-h-[300px] min-w-[150px]">
                        <Text size="xs" fw={700} c="green.6" className="self-start mb-4">
                            과정 2: 합쳐서 보기 (총 {totalNumerator}칸)
                        </Text>

                        <div className="flex flex-wrap justify-center content-start gap-3 w-full">
                            {/* Draw Boxes */}
                            {Array.from({ length: Math.ceil(totalNumerator / frac1.d) }).map((_, boxIndex) => {
                                // Determine how many segments are filled in this specific box
                                const startIdx = boxIndex * frac1.d;

                                return (
                                    <div key={`res-box-${boxIndex}`}
                                        className="relative bg-white border-2 border-green-600 shadow-sm transition-all duration-500"
                                        style={{ width: unitSize, height: unitSize * 1.5 }} // Fixed height
                                    >
                                        <div className="w-full h-full flex flex-col">
                                            {Array.from({ length: frac1.d }).map((__, fi) => {
                                                // Calculate overall index of this segment
                                                const segmentGlobalIndex = startIdx + fi;
                                                const isFilled = segmentGlobalIndex < totalNumerator;

                                                // Animation delay based on index to simulate sequential filling "stacking up"
                                                const delay = isFilled ? segmentGlobalIndex * 50 + 500 : 0; // +500ms initial wait

                                                return (
                                                    <div key={fi}
                                                        className={`flex-1 w-full border-b border-gray-400 last:border-0 transition-colors duration-300`}
                                                        style={{
                                                            backgroundColor: isFilled ? '#4ade80' : 'transparent',
                                                            transitionDelay: `${delay}ms`
                                                        }}
                                                    ></div>
                                                );
                                            })}
                                        </div>
                                        {/* Label for whole Number */}
                                        {(Math.min(frac1.d, Math.max(0, totalNumerator - startIdx)) === frac1.d) && (
                                            <div className="absolute -top-6 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${(startIdx + frac1.d) * 50 + 600}ms` }}>
                                                <span className="text-xl font-bold text-green-600">1</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Paper>
                </div >

                <Text size="sm" c="dimmed" ta="center" mt="md" className="max-w-md">
                    {mode === 'nat_unit' && "조각들이 순서대로 쌓여서 자연수가 되는 과정을 확인해보세요."}
                    {mode === 'nat_proper' && `진분수 조각 ${natural}개가 모여 가분수(또는 대분수)가 됩니다.`}
                </Text>
            </div >
        );
    };

    // 2. Fraction x Fraction (Area Model)
    const renderFractionXFraction = () => {
        return (
            <div className="flex flex-col items-center gap-8 w-full px-2">
                <div className="flex items-center gap-4 text-3xl font-black font-mono text-gray-800">
                    <div className="flex flex-col items-center leading-none">
                        <span className="border-b-2 border-gray-800 w-full text-center px-1 text-blue-600">{frac1.n}</span>
                        <span className="text-blue-800">{frac1.d}</span>
                    </div>
                    <span className="text-gray-400">×</span>
                    <div className="flex flex-col items-center leading-none">
                        <span className="border-b-2 border-gray-800 w-full text-center px-1 text-yellow-600">{frac2.n}</span>
                        <span className="text-yellow-800">{frac2.d}</span>
                    </div>
                </div>

                <div className="relative mt-8 ml-8">
                    {/* Top Axis Labels (Frac1 - Columns) */}
                    <div className="absolute -top-8 left-0 w-64 h-8 flex items-end pb-1">
                        {Array.from({ length: frac1.d }).map((_, i) => (
                            <div key={`label-col-${i}`} className="flex-1 text-center text-sm font-bold text-blue-600">{i + 1}</div>
                        ))}
                    </div>
                    {/* Left Axis Labels (Frac2 - Rows) */}
                    <div className="absolute top-0 -left-8 h-64 w-8 flex flex-col items-end pr-2 pt-0">
                        {Array.from({ length: frac2.d }).map((_, i) => (
                            <div key={`label-row-${i}`} className="flex-1 flex items-center justify-end text-sm font-bold text-yellow-700">{i + 1}</div>
                        ))}
                    </div>
                    <div className="relative w-64 h-64 border-4 border-gray-800 bg-white shadow-xl rounded-lg overflow-hidden">
                        {/* Grid for Denominators */}
                        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${frac1.d}, 1fr)` }}>
                            {Array.from({ length: frac1.d }).map((_, i) => (
                                <div key={`col-${i}`} className="border-r border-gray-400 h-full"></div>
                            ))}
                        </div>
                        <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${frac2.d}, 1fr)` }}>
                            {Array.from({ length: frac2.d }).map((_, i) => (
                                <div key={`row-${i}`} className="border-b border-gray-400 w-full"></div>
                            ))}
                        </div>

                        {/* Colored Overlay */}
                        {/* Frac 1 (Blue Vertical Strips) */}
                        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${frac1.d}, 1fr)` }}>
                            {Array.from({ length: frac1.d }).map((_, i) => (
                                <div key={`fill-col-${i}`} className={`h-full transition-colors duration-300 ${i < frac1.n ? 'bg-blue-400/60' : ''}`}></div>
                            ))}
                        </div>

                        {/* Frac 2 (Yellow Horizontal Strips) */}
                        <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${frac2.d}, 1fr)` }}>
                            {Array.from({ length: frac2.d }).map((_, i) => (
                                <div key={`fill-row-${i}`} className={`w-full transition-colors duration-300 ${i < frac2.n ? 'bg-yellow-400/60' : ''}`}></div>
                            ))}
                        </div>

                        {/* Intersection Highlighting & Numbering */}
                        <div className="absolute inset-0 grid" style={{
                            gridTemplateColumns: `repeat(${frac1.d}, 1fr)`,
                            gridTemplateRows: `repeat(${frac2.d}, 1fr)`
                        }}>
                            {Array.from({ length: frac1.d * frac2.d }).map((_, i) => {
                                const colIndex = i % frac1.d;
                                const rowIndex = Math.floor(i / frac1.d);
                                const isIntersection = colIndex < frac1.n && rowIndex < frac2.n;

                                // Calculate count only for intersection items
                                // Logic: Iterate row by row for numbering? Or col by col?
                                // Standard reading order is row by row.
                                // But our grid mapping 'i' goes row by row automatically if we use standard grid flow?
                                // No, CSS grid items fill row 1 first, then row 2.
                                // So 'i' 0..frac1.d-1 is row 0.

                                // Re-calculating numbering specifically for intersection cells:
                                // We need to know how many intersection cells appeared before this one.
                                // Since we sweep row by row, and for each row we have 'frac1.n' intersection cells.
                                // Logic: (rowIndex * frac1.n) + colIndex + 1

                                return (
                                    <div key={`intersect-${i}`} className={`flex items-center justify-center ${isIntersection ? 'border-2 border-green-600 z-10' : ''}`}>
                                        {isIntersection && (
                                            <span className="text-green-800 font-bold text-xs sm:text-sm md:text-base bg-white/40 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-sm">
                                                {(rowIndex * frac1.n) + colIndex + 1}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Paper shadow="xs" p="md" radius="lg" withBorder className="w-full max-w-sm bg-gray-50/80 backdrop-blur-sm">
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Text fw={700} c="blue" size="sm">세로 (파란색): {frac1.n}/{frac1.d}</Text>
                            <Text fw={700} c="yellow.8" size="sm">가로 (노란색): {frac2.n}/{frac2.d}</Text>
                        </Group>
                        <Divider />
                        <Group justify="center" gap="md" align="center">
                            <Text fw={900} c="green.7" size="lg">겹치는 부분:</Text>
                            <div className="flex flex-col items-center leading-none text-2xl font-black text-green-700">
                                <span className="border-b-2 border-green-700 w-full text-center">{frac1.n * frac2.n}</span>
                                <span>{frac1.d * frac2.d}</span>
                            </div>
                        </Group>
                        <Text size="xs" c="dimmed" ta="center">
                            전체 {frac1.d}×{frac2.d}칸 중 겹친 {frac1.n}×{frac2.n}칸이 정답입니다.
                        </Text>
                    </Stack>
                </Paper>
            </div>
        );
    };

    if (!mounted) return null; // Avoid hydration mismatch on initial render

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-10">
            {/* Mode Selector - Responsive */}
            <div className="md:hidden">
                <SegmentedControl
                    orientation="vertical"
                    value={mode}
                    onChange={handleModeChange}
                    data={MODES}
                    color="blue"
                    fullWidth
                    size="sm"
                    radius="md"
                    className="shadow-sm"
                />
            </div>
            <div className="hidden md:block">
                <SegmentedControl
                    value={mode}
                    onChange={handleModeChange}
                    data={MODES}
                    color="blue"
                    fullWidth
                    size="md"
                    radius="md"
                    className="shadow-sm"
                />
            </div>

            {/* Controls Area */}
            <Paper p="lg" radius="xl" withBorder className="bg-white shadow-sm">
                <Stack gap="md">
                    <Group align="center" gap="xs" mb="xs">
                        <ThemeIcon color="gray" variant="light" radius="xl"><RefreshCcw size={16} /></ThemeIcon>
                        <Text size="sm" fw={700} c="dimmed">값 설정하기</Text>
                    </Group>

                    {mode.startsWith('nat') ? (
                        <>
                            <Group align="center" justify="space-between" wrap="nowrap" gap="xl" className="w-full">
                                <Stack gap={4} className="flex-1 min-w-[150px]">
                                    <Text size="xs" fw={700} c="gray.7">자연수 ({natural})</Text>
                                    <Slider
                                        value={natural}
                                        onChange={setNatural}
                                        min={1} max={6}
                                        marks={[
                                            { value: 1, label: '1' },
                                            { value: 2, label: '2' },
                                            { value: 3, label: '3' },
                                            { value: 4, label: '4' },
                                            { value: 5, label: '5' },
                                            { value: 6, label: '6' },
                                        ]}
                                        step={1}
                                        size="md"
                                        thumbSize={18}
                                        styles={{ markLabel: { fontSize: '0.7rem' } }}
                                    />
                                </Stack>

                                <Divider orientation="vertical" />

                                <Group gap="md" align="center">
                                    <Text size="xs" fw={700} c="gray.7">분수</Text>
                                    <Group gap={6} align="center">
                                        {mode === 'nat_mixed' && (
                                            <NumberInput
                                                value={frac1.w}
                                                onChange={(v) => setFrac1({ ...frac1, w: Number(v) })}
                                                min={1} max={3} w={50}
                                                size="sm"
                                                variant="filled"
                                                styles={{ input: { textAlign: 'center', fontWeight: 700, fontSize: '1rem' } }}
                                                aria-label="Natural Part"
                                            />
                                        )}
                                        <div className="flex flex-col gap-0.5 items-center">
                                            <NumberInput
                                                value={frac1.n}
                                                onChange={(v) => setFrac1({ ...frac1, n: Number(v) })}
                                                min={1} max={frac1.d - 1} w={44}
                                                size="xs"
                                                error={frac1.n >= frac1.d}
                                                styles={{ input: { textAlign: 'center', padding: 0, height: '24px', minHeight: '24px' } }}
                                                disabled={mode === 'nat_unit'}
                                                aria-label="Numerator"
                                            />
                                            <div className="w-full h-0.5 bg-gray-800 rounded-full my-0.5"></div>
                                            <NumberInput
                                                value={frac1.d}
                                                onChange={(v) => setFrac1({ ...frac1, d: Number(v) })}
                                                min={2} max={10} w={44}
                                                size="xs"
                                                styles={{ input: { textAlign: 'center', padding: 0, height: '24px', minHeight: '24px' } }}
                                                aria-label="Denominator"
                                            />
                                        </div>
                                    </Group>
                                </Group>
                            </Group>
                        </>
                    ) : (
                        // Frac x Frac Controls
                        <Group grow align="center">
                            <Stack gap="xs" align="center">
                                <Text size="sm" fw={600} c="blue.6">첫 번째 분수</Text>
                                <div className="flex flex-col gap-1 items-center bg-blue-50 p-2 rounded-lg">
                                    <NumberInput value={frac1.n} onChange={(v) => setFrac1({ ...frac1, n: Number(v) })} min={1} max={frac1.d - 1} w={60} size="sm" />
                                    <div className="w-full h-px bg-blue-300"></div>
                                    <NumberInput value={frac1.d} onChange={(v) => setFrac1({ ...frac1, d: Number(v) })} min={2} max={10} w={60} size="sm" />
                                </div>
                            </Stack>
                            <Text size="xl" fw={900} c="gray.4" className="self-center mx-2">×</Text>
                            <Stack gap="xs" align="center">
                                <Text size="sm" fw={600} c="yellow.8">두 번째 분수</Text>
                                <div className="flex flex-col gap-1 items-center bg-yellow-50 p-2 rounded-lg">
                                    <NumberInput value={frac2.n} onChange={(v) => setFrac2({ ...frac2, n: Number(v) })} min={1} max={frac2.d - 1} w={60} size="sm" />
                                    <div className="w-full h-px bg-yellow-400"></div>
                                    <NumberInput value={frac2.d} onChange={(v) => setFrac2({ ...frac2, d: Number(v) })} min={2} max={10} w={60} size="sm" />
                                </div>
                            </Stack>
                        </Group>
                    )}
                </Stack>
            </Paper>

            {/* Visualization Canvas */}
            <div className="min-h-[350px] flex items-center justify-center py-6">
                {mode.startsWith('nat') ? renderNaturalXFraction() : renderFractionXFraction()}
            </div>
        </div>
    );
}
