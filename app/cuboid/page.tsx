"use client";

import { Container, Title, Text, Badge, Stack } from "@mantine/core";
import CuboidVisualizer from "@/components/CuboidVisualizer";

export default function CuboidPage() {
    return (
        <Container size="lg" className="py-8 pb-32 min-h-screen space-y-12">
            <Stack gap="lg">
                <div>
                    <Badge color="blue" size="lg" mb="sm">초등 수학 5-2</Badge>
                    <Title order={1} className="text-4xl font-black text-gray-900 mb-2">
                        직육면체와 정육면체
                    </Title>
                    <Text size="xl" c="dimmed">
                        직육면체와 정육면체의 구성 요소를 알아보고 전개도를 펼쳐봅시다.
                    </Text>
                </div>

                <CuboidVisualizer />
            </Stack>
        </Container>
    );
}
