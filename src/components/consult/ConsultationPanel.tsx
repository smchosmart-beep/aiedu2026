import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Loader2, Pencil, Send, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createConsultation,
  updateConsultation,
  deleteConsultation,
  listConsultations,
  type ConsultationItem,
} from "@/lib/consultations.functions";

type Consultation = ConsultationItem;

function safeHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const isValidLink = (v: string) => v.length === 0 || /^https?:\/\/\S+$/i.test(v.trim());

export function ConsultationPanel({ surveyCode, readOnly = false }: { surveyCode: string; readOnly?: boolean }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [pin, setPin] = useState("");

  const createFn = useServerFn(createConsultation);
  const updateFn = useServerFn(updateConsultation);
  const deleteFn = useServerFn(deleteConsultation);

  const [editTarget, setEditTarget] = useState<Consultation | null>(null);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [editPin, setEditPin] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Consultation | null>(null);
  const [deletePin, setDeletePin] = useState("");

  const { data: list, isLoading } = useQuery({
    queryKey: ["consultations", surveyCode],
    queryFn: () => fetchConsultations(surveyCode),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["consultations", surveyCode] });

  const create = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          surveyCode,
          consultantName: name.trim(),
          content: content.trim(),
          linkUrl: linkUrl.trim() || null,
          pin,
        },
      }),
    onSuccess: () => {
      setContent("");
      setLinkUrl("");
      setPin("");
      invalidate();
      toast.success("컨설팅 기록이 저장되었습니다");
    },
    onError: (e: Error) => toast.error(e.message || "저장에 실패했습니다"),
  });

  const update = useMutation({
    mutationFn: () =>
      updateFn({
        data: {
          id: editTarget!.id,
          pin: editPin,
          consultantName: editName.trim(),
          content: editContent.trim(),
          linkUrl: editLinkUrl.trim() || null,
        },
      }),
    onSuccess: () => {
      setEditTarget(null);
      setEditPin("");
      invalidate();
      toast.success("수정되었습니다");
    },
    onError: (e: Error) => toast.error(e.message || "수정에 실패했습니다"),
  });

  const remove = useMutation({
    mutationFn: () =>
      deleteFn({ data: { id: deleteTarget!.id, pin: deletePin } }),
    onSuccess: () => {
      setDeleteTarget(null);
      setDeletePin("");
      invalidate();
      toast.success("삭제되었습니다");
    },
    onError: (e: Error) => toast.error(e.message || "삭제에 실패했습니다"),
  });

  const canSubmit =
    name.trim().length > 0 &&
    content.trim().length > 0 &&
    /^\d{4}$/.test(pin) &&
    isValidLink(linkUrl) &&
    !create.isPending;

  const openEdit = (c: Consultation) => {
    setEditTarget(c);
    setEditName(c.consultant_name);
    setEditContent(c.content);
    setEditLinkUrl(c.link_url ?? "");
    setEditPin("");
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border p-5 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📝</span>
        <h3 className="font-bold">교사지원단 컨설팅 기록</h3>
        <Badge variant="secondary" className="ml-auto rounded-full text-[11px]">
          {readOnly ? "열람 전용" : "공개"}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground -mt-2">
        {readOnly
          ? "이 영역은 공개되어 누구나 열람할 수 있습니다. 작성은 교사지원단 화면에서 가능합니다."
          : "이 영역은 공개되어 있어 누구나 열람·작성할 수 있습니다. 본인이 설정한 4자리 PIN을 알아야 수정·삭제할 수 있습니다."}
      </p>

      {!readOnly && (
        <div className="space-y-3 rounded-2xl border bg-muted/30 p-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="작성자 (예: 홍길동 · 00교육청 지원단)"
            className="h-12 rounded-xl"
            maxLength={60}
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="진단 결과와 학교 상황을 바탕으로 컨설팅 의견을 작성해 주세요."
            className="min-h-[140px] rounded-xl leading-relaxed"
            maxLength={4000}
          />
          <div className="space-y-1.5">
            <Input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="관련 링크 (선택) · 예: Canva 보기 전용 https://…"
              className="h-12 rounded-xl"
              maxLength={500}
            />
            {linkUrl.length > 0 && !isValidLink(linkUrl) && (
              <p className="text-[11px] text-destructive px-1">
                링크는 http:// 또는 https:// 로 시작해야 합니다.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Input
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="수정·삭제용 PIN 4자리 숫자"
              className="h-12 rounded-xl"
            />
            <p className="text-[11px] text-muted-foreground px-1">
              이 PIN을 알고 있는 사람만 본인이 남긴 기록을 수정·삭제할 수 있습니다. 분실 시 복구 불가.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => create.mutate()} disabled={!canSubmit} className="rounded-xl">
              {create.isPending ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-1.5" />
              )}
              기록 남기기
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="text-sm font-semibold text-muted-foreground">
          컨설팅 기록 {list ? `(${list.length})` : ""}
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> 불러오는 중…
          </div>
        )}

        {!isLoading && list && list.length === 0 && (
          <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            아직 작성된 컨설팅 기록이 없습니다. 첫 기록을 남겨 보세요.
          </div>
        )}

        {list?.map((c) => {
          const canModify = !readOnly && c.pin_hash !== "";
          const host = c.link_url ? safeHostname(c.link_url) : null;
          return (
            <article
              key={c.id}
              className="rounded-2xl border-l-4 border-primary bg-primary/5 p-4 space-y-2"
            >
              <header className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <User className="w-3.5 h-3.5 text-primary" />
                  {c.consultant_name}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(c.created_at).toLocaleString("ko-KR")}
                </span>
                {canModify && (
                  <div className="flex gap-1 w-full sm:w-auto sm:ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil className="w-3 h-3 mr-1" /> 수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                      onClick={() => {
                        setDeleteTarget(c);
                        setDeletePin("");
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> 삭제
                    </Button>
                  </div>
                )}
              </header>
              <p className="text-[15px] leading-7 text-foreground whitespace-pre-wrap">
                {c.content}
              </p>
              {c.link_url && (
                <a
                  href={c.link_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 mt-1 px-3 py-2 rounded-xl border bg-background hover:bg-muted text-sm font-medium text-primary break-all"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>첨부 링크 열기</span>
                  {host && (
                    <span className="text-xs text-muted-foreground font-normal">
                      · {host}
                    </span>
                  )}
                </a>
              )}
            </article>
          );
        })}
      </div>

      {/* 수정 다이얼로그 */}
      <Dialog open={editTarget !== null} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>컨설팅 기록 수정</DialogTitle>
            <DialogDescription>
              작성 시 설정한 4자리 PIN을 입력해야 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="작성자"
              maxLength={60}
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[140px]"
              maxLength={4000}
            />
            <div className="space-y-1.5">
              <Input
                type="url"
                value={editLinkUrl}
                onChange={(e) => setEditLinkUrl(e.target.value)}
                placeholder="관련 링크 (선택) · 비우면 링크 제거"
                maxLength={500}
              />
              {editLinkUrl.length > 0 && !isValidLink(editLinkUrl) && (
                <p className="text-[11px] text-destructive px-1">
                  링크는 http:// 또는 https:// 로 시작해야 합니다.
                </p>
              )}
            </div>
            <Input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={editPin}
              onChange={(e) => setEditPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="PIN 4자리"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              취소
            </Button>
            <Button
              onClick={() => update.mutate()}
              disabled={
                update.isPending ||
                !/^\d{4}$/.test(editPin) ||
                editName.trim().length === 0 ||
                editContent.trim().length === 0 ||
                !isValidLink(editLinkUrl)
              }
            >
              {update.isPending && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 다이얼로그 */}
      <Dialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>컨설팅 기록 삭제</DialogTitle>
            <DialogDescription>
              작성 시 설정한 4자리 PIN을 입력하면 이 기록이 영구 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={deletePin}
            onChange={(e) => setDeletePin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="PIN 4자리"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => remove.mutate()}
              disabled={remove.isPending || !/^\d{4}$/.test(deletePin)}
            >
              {remove.isPending && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
