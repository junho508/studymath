"use client";

import { Container, Title, Text, Badge, Stack } from "@mantine/core";
import FractionMultiplicationVisualizer from "@/components/FractionMultiplicationVisualizer";

export default function FractionMultiplicationPage() {
    return (
        <Container size="lg" className="py-8 pb-32 min-h-screen space-y-12">
            <Stack gap="lg">
                <div>
                    <Badge color="blue" size="lg" mb="sm">초등 수학 5-2</Badge>
                    <Title order={1} className="text-4xl font-black text-gray-900 mb-2">
                        분수의 곱셈 정복하기
                    </Title>
                    <Text size="xl" c="dimmed">
                        자연수와 분수, 분수와 분수의 곱셈 원리를 시각적으로 알아봅시다.
                    </Text>
                </div>

                <FractionMultiplicationVisualizer />
            </Stack>
        </Container>
    );
}
