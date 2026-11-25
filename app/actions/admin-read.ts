"use server";
import "server-only";
import { requireAdmin } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import type { ContactMessage, InterventionRequest, Post, Stat, Testimonial } from "@/types";

/** Lectures pour les pages admin (toutes protégées par requireAdmin). */

export async function listInterventionRequests(): Promise<InterventionRequest[]> {
  await requireAdmin();
  const { data } = await getDb().from("intervention_requests").select("*").order("created_at", { ascending: false });
  return (data ?? []) as InterventionRequest[];
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  await requireAdmin();
  const { data } = await getDb().from("contact_messages").select("*").order("created_at", { ascending: false });
  return (data ?? []) as ContactMessage[];
}

export async function listStats(): Promise<Stat[]> {
  await requireAdmin();
  const { data } = await getDb().from("key_stats").select("*").order("sort_order");
  return (data ?? []) as Stat[];
}

export async function listTestimonials(): Promise<Testimonial[]> {
  await requireAdmin();
  const { data } = await getDb().from("testimonials").select("*").order("sort_order", { ascending: true });
  return (data ?? []) as Testimonial[];
}

export async function listInstagramPosts() {
  await requireAdmin();
  const { data } = await getDb().from("instagram_posts").select("*").order("sort_order");
  return (data ?? []) as { id: string; image_url: string; permalink: string; alt: string; sort_order: number }[];
}

export async function getPostById(id: string): Promise<Post | null> {
  await requireAdmin();
  const { data } = await getDb().from("posts").select("*").eq("id", id).maybeSingle();
  return (data as Post | null) ?? null;
}
