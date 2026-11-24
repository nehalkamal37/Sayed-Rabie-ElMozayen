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
  return branch?.detail ? { branch, detail: branch.detail } : null;
}

export function generateStaticParams() {
  return branches.filter((branch) => branch.detail).map((branch) => ({ branch: branch.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loaded = await loadBranch(params);
  if (!loaded) return { title: getDictionary("en").notFound.metaTitle };
  return pageMetadata("en", branchPath(loaded.branch.id), {
    title: loaded.detail.metaTitle.en,
    description: loaded.detail.metaDescription.en,
  });
}

export default async function Page({ params }: Props) {
  const loaded = await loadBranch(params);
  if (!loaded) notFound();
  return <BranchView locale="en" branch={loaded.branch} detail={loaded.detail} />;
}
