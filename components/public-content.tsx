"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { SiteLanguage } from "./site-shell";

export type ContentItem = { id: number; kind: "news" | "tender"; titleEn: string; titleAr: string; summaryEn: string; summaryAr: string; date: string; status: string };

export function PublicContent({ kind, language }: { kind: "news" | "tender"; language: SiteLanguage }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  useEffect(() => { fetch(`/api/content?kind=${kind}`).then(r => r.ok ? r.json() : []).then(setItems).catch(() => setItems([])); }, [kind]);
  if (!items.length) return null;
  return <div className={kind === "news" ? "news-archive-grid dynamic-content" : "tender-list dynamic-content"}>
    {items.map((item, index) => <article className={kind === "news" ? "news-feature-card" : "tender-row"} key={item.id}>
      <div className="content-date"><span>{String(index + 1).padStart(2, "0")}</span><time>{item.date}</time></div>
      <div><span className="status-pill">{item.status}</span><h2>{language === "ar" ? item.titleAr : item.titleEn}</h2><p>{language === "ar" ? item.summaryAr : item.summaryEn}</p></div>
      <ArrowUpRight className="content-arrow" />
    </article>)}
  </div>;
}
