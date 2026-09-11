import {
  BarChart3,
  Bell,
  BookOpen,
  FileCheck,
  FileText,
  History,
  LayoutDashboard,
  Leaf,
  MapPin,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sprout,
  UserCheck,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  { title: "Overview", items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }] },
  {
    title: "Users",
    items: [
      { label: "Farmers", href: "/admin/users", icon: Users },
      { label: "Verified Experts", href: "/admin/experts?status=active", icon: UserCheck },
      { label: "Expert Verification", href: "/admin/verification", icon: ShieldCheck },
    ],
  },
  {
    title: "AI & Agriculture",
    items: [
      { label: "AI Analyses", href: "/admin/analytics", icon: Sprout },
      { label: "Crops", href: "/admin/crops", icon: Leaf },
      { label: "Diseases & Conditions", href: "/admin/diseases", icon: FileCheck },
    ],
  },
  {
    title: "Knowledge",
    items: [
      { label: "Knowledge Base", href: "/admin/knowledge", icon: BookOpen },
      { label: "Articles", href: "/admin/knowledge", icon: FileText },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Consultations", href: "/admin/consultations", icon: MessageSquare },
      { label: "Reports", href: "/admin/analytics", icon: BarChart3 },
      { label: "Notifications", href: "/admin/dashboard", icon: Bell },
      { label: "Activity Logs", href: "/admin/dashboard", icon: History },
      { label: "Locations", href: "/admin/dashboard", icon: MapPin },
    ],
  },
  { title: "System", items: [{ label: "Settings", href: "/admin/settings", icon: Settings }] },
];
