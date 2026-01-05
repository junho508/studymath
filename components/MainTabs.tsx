"use client";

import { Tabs, Container, Title, Paper } from "@mantine/core";
import { useRouter, usePathname } from "next/navigation";
import { Compass, PenTool, LayoutDashboard, Box } from "lucide-react";

export default function MainTabs() {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active tab based on pathname
    const activeTab = pathname === "/" || pathname === "/point-symmetry" ? "point-symmetry" : pathname.substring(1);

    return (
        <Paper shadow="sm" p="xs" className="mb-4 sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100">
            <Container size="lg">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Compass className="w-6 h-6 text-blue-600" />
                        <Title order={4} size="h4">초등 수학 원리 탐험</Title>
                    </div>
                </div>

                <Tabs value={activeTab} onChange={(value) => router.push(`/${value}`)}>
                    <Tabs.List className="w-full pb-1 hide-scrollbar" style={{ flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <Tabs.Tab value="point-symmetry" leftSection={<PenTool size={16} />} className="whitespace-nowrap min-w-fit flex-shrink-0">
                            점대칭 도형
                        </Tabs.Tab>
                        <Tabs.Tab value="fraction-multiplication" leftSection={<LayoutDashboard size={16} />} className="whitespace-nowrap min-w-fit flex-shrink-0">
                            분수의 곱셈
                        </Tabs.Tab>
                        <Tabs.Tab value="cuboid" leftSection={<Box size={16} />} className="whitespace-nowrap min-w-fit flex-shrink-0">
                            직육면체와 정육면체
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </Container>
        </Paper>
    );
}
