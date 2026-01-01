"use client";

import { Container, Title, Text, Card, Group, Stack, Badge, ThemeIcon, List, Alert } from "@mantine/core";
import { Check, Info, Move, PenTool, RotateCw } from "lucide-react";
import PointSymmetryCanvas from "@/components/PointSymmetryCanvas";
import LineSymmetryCanvas from "@/components/LineSymmetryCanvas";

export default function PointSymmetryPage() {
    return (
        <Container size="lg" className="py-8 space-y-12">
            {/* Introduction */}
            <Stack gap="lg">
                <div>
                    <Badge color="blue" size="lg" mb="sm">초등 수학 5-2</Badge>
                    <Title order={1} className="text-4xl font-black text-gray-900 mb-2">
                        점대칭 도형이 무엇인가요?
                    </Title>
                    <Text size="xl" c="dimmed">
                        어떤 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형을 알아봅시다.
                    </Text>
                </div>

                <Alert variant="light" color="blue" title="핵심 포인트" icon={<Info size={16} />}>
                    <List spacing="sm" size="sm" center icon={
                        <ThemeIcon color="blue" size={24} radius="xl">
                            <Check size={16} />
                        </ThemeIcon>
                    }>
                        <List.Item>한 점을 중심으로 180° 돌렸을 때 처음과 겹칩니다.</List.Item>
                        <List.Item>그 중심이 되는 점을 <strong>대칭의 중심</strong>이라고 합니다.</List.Item>
                    </List>
                </Alert>
            </Stack>

            {/* Point Symmetry Interactive Section */}
            <section>
                <Group align="center" mb="md">
                    <RotateCw className="text-blue-600" size={28} />
                    <Title order={2}>점대칭 도형 돌려보기</Title>
                </Group>
                <Card withBorder shadow="sm" radius="md" p="lg" className="bg-slate-50">
                    <Text mb="md">
                        아래 도형의 슬라이더를 움직여 <strong>180°</strong> 돌려보세요. <br />
                        도형이 완전히 겹쳐지는 것을 확인할 수 있습니다.
                    </Text>
                    <div className="flex justify-center py-8">
                        <PointSymmetryCanvas />
                    </div>
                </Card>
            </section>

            {/* Comparison with Line Symmetry */}
            <section>
                <Group align="center" mb="md">
                    <Move className="text-green-600" size={28} />
                    <Title order={2}>선대칭 도형과 어떻게 다른가요?</Title>
                </Group>
                <div className="flex justify-center">
                    <Card withBorder shadow="sm" padding="lg" className="max-w-md w-full">
                        <Card.Section withBorder inheritPadding py="xs" className="bg-green-50">
                            <Title order={4} className="flex items-center gap-2">
                                <Move size={18} /> 선대칭 도형과 비교하기
                            </Title>
                        </Card.Section>
                        <Text mt="md" mb="xs" size="sm" c="dimmed">
                            선대칭 도형은 대칭축을 따라 <strong>접었을 때</strong> 완전히 포개집니다.
                            <br />아래 버튼을 눌러 직접 접어보세요.
                        </Text>
                        <div className="h-56 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                            <LineSymmetryCanvas />
                        </div>
                    </Card>
                </div>
            </section>

        </Container>
    );
}
