import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { branches, branchPath, getBranch, parseBranchId } from "@/data/branches";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { BranchView } from "@/views/branch-view";

type Props = { params: Promise<{ branch: string }> };

async function loadBranch(params: Props["params"]) {
  const id = parseBranchId((await params).branch);
  const branch = id ? getBranch(id) : null;
  return branch ? { branch, detail: branch.detail } : null;
}

export function generateStaticParams() {
  return branches.map((branch) => ({ branch: branch.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loaded = await loadBranch(params);
  if (!loaded) return { title: getDictionary("ar").notFound.metaTitle };
  return pageMetadata(
    "ar",
    branchPath(loaded.branch.id),
    { title: loaded.detail.metaTitle.ar, description: loaded.detail.metaDescription.ar },
    { draft: loaded.branch.draft },
  );
}

export default async function Page({ params }: Props) {
  const loaded = await loadBranch(params);
  if (!loaded) notFound();
  return <BranchView locale="ar" branch={loaded.branch} detail={loaded.detail} />;
}
