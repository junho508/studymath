"use client";

import { useState, useRef, useEffect } from "react";
import { Paper, SegmentedControl, Group, Text, Stack, Switch, Button, Slider, ThemeIcon } from "@mantine/core";
import { Box, Scan, Move3d, RotateCw } from "lucide-react";

type ShapeType = 'cuboid' | 'cube';
type HighlightType = 'none' | 'face' | 'edge' | 'vertex';

const SHAPE_CONFIG = {
    cube: { w: 160, h: 160, d: 160, label: '정육면체' },
    cuboid: { w: 200, h: 120, d: 100, label: '직육면체' }, // w: width, h: height (y), d: depth (z)
    // Note: In our hierarchical model:
    // Bottom (Base) is w * d.
    // Front/Back are w * h.
    // Left/Right are d * h.
    // Top is w * d.
};

export default function CuboidVisualizer() {
    const [shape, setShape] = useState<ShapeType>('cuboid');
    const [highlight, setHighlight] = useState<HighlightType>('none');
    const [isUnfolded, setIsUnfolded] = useState(false);

    // Rotation State
    const [rotX, setRotX] = useState(-30);
    const [rotY, setRotY] = useState(45);
    const [isAutoRotate, setIsAutoRotate] = useState(false);

    // Auto rotate effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoRotate && !isUnfolded) {
            interval = setInterval(() => {
                setRotY(prev => (prev + 1) % 360);
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isAutoRotate, isUnfolded]);

    // Dimensions
    const { w, h, d, label } = SHAPE_CONFIG[shape];

    // Colors
    const faceBase = isUnfolded ? "bg-blue-100/90" : "bg-blue-200/80";
    const faceHighlightStr = "bg-orange-400/90";
    const edgeBase = "border-2 border-blue-400";
    const edgeHighlightStr = "border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]";

    const isFaceHighlight = highlight === 'face';
    const isEdgeHighlight = highlight === 'edge';
    const isVertexHighlight = highlight === 'vertex';

    // Face Class Builder
    const getFaceClass = () => `absolute flex items-center justify-center transition-colors duration-300 backface-visible ${isFaceHighlight ? faceHighlightStr : faceBase} ${isEdgeHighlight ? edgeHighlightStr : edgeBase}`;

    // Vertex component
    const Vertex = ({ top, left, bottom, right }: { top?: boolean, left?: boolean, bottom?: boolean, right?: boolean }) => {
        if (!isVertexHighlight) return null;

        const style: React.CSSProperties = {
            position: 'absolute',
            width: '16px',
            height: '16px',
            backgroundColor: '#ef4444', // Red
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
            zIndex: 50,
        };

        if (top) style.top = 0;
        if (bottom) style.top = '100%';
        if (left) style.left = 0;
        if (right) style.left = '100%';

        return <div style={style}></div>;
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto items-center">

            {/* Controls */}
            <Paper p="md" withBorder className="w-full bg-white/90 backdrop-blur-sm sticky top-20 z-10 shadow-sm">
                <Stack>
                    <Group justify="space-between" wrap="wrap">
                        <SegmentedControl
                            value={shape}
                            onChange={(v) => { setShape(v as ShapeType); setIsUnfolded(false); }}
                            data={[
                                { label: '직육면체', value: 'cuboid' },
                                { label: '정육면체', value: 'cube' },
                            ]}
                        />
                        <Group>
                            <Switch
                                label="전개도 펼치기"
                                checked={isUnfolded}
                                onChange={(e) => { setIsUnfolded(e.currentTarget.checked); if (e.currentTarget.checked) setIsAutoRotate(false); }}
                                size="md"
                            />
                            <Button
                                variant={isAutoRotate ? "light" : "subtle"}
                                onClick={() => setIsAutoRotate(!isAutoRotate)}
                                disabled={isUnfolded}
                                leftSection={<RotateCw size={16} />}
                            >
                                회전
                            </Button>
                        </Group>
                    </Group>

                    <Group grow>
                        <Button
                            variant={highlight === 'face' ? 'filled' : 'light'}
                            color={highlight === 'face' ? 'orange' : 'gray'}
                            onClick={() => setHighlight(highlight === 'face' ? 'none' : 'face')}
                        >
                            면 (6개)
                        </Button>
                        <Button
                            variant={highlight === 'edge' ? 'filled' : 'light'}
                            color={highlight === 'edge' ? 'yellow' : 'gray'}
                            onClick={() => setHighlight(highlight === 'edge' ? 'none' : 'edge')}
                            className={highlight === 'edge' ? 'text-black' : ''}
                        >
                            모서리 (12개)
                        </Button>
                        <Button
                            variant={highlight === 'vertex' ? 'filled' : 'light'}
                            color={highlight === 'vertex' ? 'red' : 'gray'}
                            onClick={() => setHighlight(highlight === 'vertex' ? 'none' : 'vertex')}
                        >
                            꼭짓점 (8개)
                        </Button>
                    </Group>
                </Stack>
            </Paper>

            {/* 3D Viewport */}
            <div className="w-full h-[500px] bg-slate-50 rounded-xl border border-gray-200 relative overflow-hidden flex items-center justify-center"
                style={{ perspective: '1200px' }}>

                {/* Intro Text / Legend */}
                <div className="absolute top-4 left-4 p-4 bg-white/80 rounded-lg backdrop-blur text-sm border border-gray-100 max-w-[200px]">
                    <Text fw={700} size="lg" mb="xs">{label}</Text>
                    <Text size="xs" c="dimmed" mb={4}>
                        {highlight === 'face' && "면: 선분으로 둘러싸인 부분. 서로 마주 보는 면은 평행하고 합동입니다."}
                        {highlight === 'edge' && "모서리: 면과 면이 만나는 선분. 면이 수직으로 만납니다."}
                        {highlight === 'vertex' && "꼭짓점: 모서리와 모서리가 만나는 점. 3개의 모서리가 만납니다."}
                        {highlight === 'none' && "버튼을 눌러 구성 요소를 확인해보세요."}
                    </Text>
                    {isUnfolded && <Text size="xs" c="blue.6" fw={700} mt={2}>전개도가 펼쳐졌습니다!</Text>}
                </div>


                {/* 3D Scene Root */}
                <div
                    className="relative transition-transform duration-700 ease-in-out"
                    style={{
                        width: w,
                        height: d, // Base is Bottom face (w x d)
                        transformStyle: 'preserve-3d',
                        // If unfolded, we want to look from top down mostly, or centered
                        transform: isUnfolded
                            ? `rotateX(0deg) rotateY(0deg) scale(0.6)` // Flat view
                            : `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateX(90deg)` // 3D view
                    }}
                >
                    {/* HIERARCHY FOR NET ANIMATION */}
                    {/* Root: BOTTOM Face (Base) */}
                    <div
                        className={getFaceClass()}
                        style={{ width: w, height: d, transformStyle: 'preserve-3d' }} // Bottom dimensions
                    >
                        <Text className={`font-bold ${isFaceHighlight ? 'text-white' : 'text-blue-900/50'}`} style={{ transform: isUnfolded ? 'none' : 'scaleX(1)', display: 'inline-block' }}>밑면</Text>

                        {/* Vertices for Bottom specific corners (displayed only in net or specific highlight context if needed) */}
                        {/* We will attach vertices to corners of Child Faces mostly to cover the shape */}
                        <Vertex top left /> <Vertex top right /> <Vertex bottom left /> <Vertex bottom right />


                        {/* FRONT Face (Attached to Bottom Top-Edge in local 2D, which corresponds to Front in 3D) */}
                        {/* Note: 'Bottom' face in CSS 2D is w x d. Top edge is 'Back' in 3D usually? */}
                        {/* Let's define the standard: */}
                        {/* w is X, d is Y (in this div's 2D space). */}
                        {/* So 'height' of this div is 'd' (Depth). */}
                        {/* Top edge (y=0) connects to BACK. Bottom edge (y=d) connects to FRONT. */}

                        {/* FRONT */}
                        <div
                            className="absolute"
                            style={{
                                bottom: 0, left: 0, width: w, height: 0, // Pivot point
                                transformStyle: 'preserve-3d',
                                transform: isUnfolded ? 'rotateX(0deg)' : 'rotateX(90deg)', // Unfolding down
                                transition: 'transform 1s ease-in-out'
                            }}
                        >
                            {/* Actual Front Face Content */}
                            <div className={getFaceClass()} style={{
                                width: w, height: h,
                                top: 0, left: 0,
                                transformOrigin: 'top center', // Pivot is top of this face (which connects to parent bottom)
                                transformStyle: 'preserve-3d',
                                // transform: 'translateY(100%)' // Shift it down so top edge aligns with pivot
                                // Actually, simpler: Put Pivot wrapper at bottom of parent.
                                // Inside wrapper, offset the face.
                            }}>
                                <Text className={`font-bold ${isFaceHighlight ? 'text-white' : 'text-blue-900/50'}`} style={{ transform: isUnfolded ? 'none' : 'scaleY(-1)', display: 'inline-block' }}>앞면</Text>
                                <Vertex bottom left /> <Vertex bottom right />
                            </div>
                        </div>

                        {/* BACK Face (Attached to Top edge y=0) */}
                        <div
                            className="absolute"
                            style={{
                                top: 0, left: 0, width: w, height: 0,
                                transformStyle: 'preserve-3d',
                                transform: isUnfolded ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                                transition: 'transform 1s ease-in-out'
                            }}
                        >
                            <div className={getFaceClass()} style={{
                                width: w, height: h,
                                bottom: 0, left: 0,
                                transformOrigin: 'bottom center',
                                transformStyle: 'preserve-3d',
                                // transform: 'translateY(-100%)'
                            }}>
                                <Text className={`font-bold ${isFaceHighlight ? 'text-white' : 'text-blue-900/50'}`} style={{ transform: isUnfolded ? 'none' : 'scaleX(-1)', display: 'inline-block' }}>뒷면</Text>
                                <Vertex top left /> <Vertex top right />

                                {/* TOP Face (Attached to Back Face's Top Edge) */}
                                <div
                                    className="absolute"
                                    style={{
                                        top: 0, left: 0, width: w, height: 0, // Top edge of Back face
                                        transformStyle: 'preserve-3d',
                                        transform: isUnfolded ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                                        transition: 'transform 1s ease-in-out'
                                    }}
                                >
                                    <div className={getFaceClass()} style={{
                                        width: w, height: d,
                                        bottom: 0, left: 0,
                                        transformOrigin: 'bottom center',
                                        transformStyle: 'preserve-3d',
                                        // transform: 'translateY(-100%)'
                                    }}>
                                        <Text className={`font-bold ${isFaceHighlight ? 'text-white' : 'text-blue-900/50'}`} style={{ transform: isUnfolded ? 'none' : 'scaleY(-1)', display: 'inline-block' }}>윗면</Text>
                                        <Vertex top left /> <Vertex top right />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LEFT Face (Attached to Left edge x=0) */}
                        <div
                            className="absolute"
                            style={{
                                top: 0, left: 0, width: 0, height: d,
                                transformStyle: 'preserve-3d',
                                transform: isUnfolded ? 'rotateY(0deg)' : 'rotateY(90deg)',
                                transition: 'transform 1s ease-in-out'
                            }}
                        >
                            <div className={getFaceClass()} style={{
                                width: h, height: d,
                                top: 0, right: 0,
                                transformOrigin: 'center right',
                                transformStyle: 'preserve-3d',
                                // transform: 'translateX(-100%)'
                            }}>
                                <Text className={`font-bold ${isFaceHighlight ? 'text-white' : 'text-blue-900/50'}`} style={{ transform: isUnfolded ? 'none' : 'scaleX(-1) rotate(90deg)', display: 'inline-block' }}>왼쪽 면</Text>
                                <Vertex top left /> <Vertex bottom left />
                            </div>
                        </div>

                        {/* RIGHT Face (Attached to Right edge x=w) */}
                        <div
                            className="absolute"
                            style={{
                                top: 0, right: 0, width: 0, height: d,
                                transformStyle: 'preserve-3d',
                                transform: isUnfolded ? 'rotateY(0deg)' : 'rotateY(-90deg)',
                                transition: 'transform 1s ease-in-out'
                            }}
                        >
                            <div className={getFaceClass()} style={{
                                width: h, height: d,
                                top: 0, left: 0,
                                transformOrigin: 'center left',
                                transformStyle: 'preserve-3d',
                                // transform: 'translateX(100%)'
                            }}>
                                <Text className={`font-bold ${isFaceHighlight ? 'text-white' : 'text-blue-900/50'}`} style={{ transform: isUnfolded ? 'none' : 'scaleX(-1) rotate(-90deg)', display: 'inline-block' }}>오른쪽 면</Text>
                                <Vertex top right /> <Vertex bottom right />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manual Rotation Sliders (Visible only when not unfolded) */}
                {!isUnfolded && (
                    <div className="absolute bottom-4 right-4 flex flex-col gap-2 p-3 bg-white/90 rounded-lg border border-gray-200 shadow-sm w-48">
                        <Text size="xs" fw={700}>화면 회전</Text>
                        <Stack gap={0}>
                            <Text size="xs" c="dimmed">좌우 회전</Text>
                            <Slider value={rotY} onChange={setRotY} min={0} max={360} size="xs" />
                        </Stack>
                        <Stack gap={0}>
                            <Text size="xs" c="dimmed">상하 회전</Text>
                            <Slider value={rotX} onChange={setRotX} min={-180} max={180} size="xs" />
                        </Stack>
                    </div>
                )
                }
            </div >

            <Text size="sm" c="dimmed" ta="center">
                * 마우스를 드래그하면 회전하지 않아요 (슬라이더나 자동 회전을 사용하세요).
                <br />
                * 전개도 펼치기를 누르면 도형이 2차원 평면으로 펼쳐집니다.
            </Text>
        </div >
    );
}
