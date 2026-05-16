import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeEntry } from "@/components/consult/CodeEntry";
import { BrowseAll } from "@/components/consult/BrowseAll";
import { KeywordSearch } from "@/components/consult/KeywordSearch";

export const Route = createFileRoute("/view")({
  component: ViewPage,
  head: () => ({
    meta: [
      { title: "컨설팅 결과 열람 · 교사지원단 컨설팅" },
      {
        name: "description",
        content: "지역·학교명 또는 과목·학교급으로 컨설팅 결과를 누구나 열람할 수 있습니다.",
      },
    ],
  }),
});

function ViewPage() {
  const [tab, setTab] = useState<"search" | "browse" | "keyword">("search");

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b bg-background/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link to="/" className="p-1 -ml-1 rounded-full hover:bg-muted">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="font-semibold">컨설팅 결과 열람</div>
        </div>
      </div>

      <div className="max-w-2xl w-full mx-auto px-5 pt-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="grid grid-cols-3 w-full rounded-2xl h-auto">
            <TabsTrigger value="search" className="rounded-xl">학교명으로 찾기</TabsTrigger>
            <TabsTrigger value="browse" className="rounded-xl">학교급·과목으로 찾기</TabsTrigger>
            <TabsTrigger value="keyword" className="rounded-xl">키워드 검색</TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="mt-0">
            <CodeEntry readOnly embedded />
          </TabsContent>
          <TabsContent value="browse" className="mt-0">
            <BrowseAll />
          </TabsContent>
          <TabsContent value="keyword" className="mt-0">
            <KeywordSearch />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
