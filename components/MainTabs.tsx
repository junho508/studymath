"use client";

import { Tabs, Container, Title, Paper } from "@mantine/core";
import { useRouter, usePathname } from "next/navigation";
import { Compass, PenTool, LayoutDashboard } from "lucide-react";

export default function MainTabs() {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active tab based on pathname
    const activeTab = pathname === "/" || pathname === "/point-symmetry" ? "point-symmetry" : pathname.substring(1);

    return (
        <Paper shadow="sm" p="md" className="mb-6 sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100">
            <Container size="lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Compass className="w-8 h-8 text-blue-600" />
                        <Title order={2} size="h3">초등 수학 원리 탐험</Title>
                    </div>
                </div>

                <Tabs value={activeTab} onChange={(value) => router.push(`/${value}`)}>
                    <Tabs.List>
                        <Tabs.Tab value="point-symmetry" leftSection={<PenTool size={16} />}>
                            점대칭 도형
                        </Tabs.Tab>
                        {/* Future tabs can be added here */}
                        {/* 
            <Tabs.Tab value="fraction" leftSection={<LayoutDashboard size={16} />}>
              분수
            </Tabs.Tab>
            */}
                    </Tabs.List>
                </Tabs>
            </Container>
        </Paper>
    );
}
