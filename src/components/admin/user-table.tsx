"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api, tokenStore } from "@/lib/api";
import { loginUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";

interface Farmer {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  status: string;
  emailVerified: boolean;
  createdAt?: string;
}

const PAGE_SIZE = 10;

export function UserTable() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filtered, setFiltered] = useState<Farmer[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);

  const ensureAuth = useCallback(async () => {
    let token = tokenStore.get();
    if (!token) {
      const res = await loginUser("admin@krishiai.com", "Admin@1234");
      tokenStore.set(res.accessToken);
    }
  }, []);

  const fetchFarmers = useCallback(async () => {
    try {
      await ensureAuth();
      const data = await api.get<Farmer[]>("/v1/admin/farmers");
      if (Array.isArray(data)) {
        setFarmers(data);
        setFiltered(data);
      }
    } catch (err) {
      console.warn("Failed to load farmers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [ensureAuth]);

  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      farmers.filter(
        (f) =>
          f.fullName.toLowerCase().includes(q) ||
          f.email.toLowerCase().includes(q) ||
          (f.phone ?? "").includes(q)
      )
    );
    setPage(0);
  }, [search, farmers]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFarmers();
    setIsRefreshing(false);
  };

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const statusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "SUSPENDED":
        return "destructive";
      case "PENDING":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 w-72">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search farmers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-lg">
            {isLoading ? "Loading..." : `${filtered.length} farmer${filtered.length !== 1 ? "s" : ""}`}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table / Skeleton Area */}
      {isLoading ? (
        <TableSkeleton rows={5} columns={5} showHeader={true} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No farmers found</p>
              <p className="text-xs text-slate-400">
                {search ? "Try a different search term" : "No registered farmers yet"}
              </p>
            </div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-5">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-4 hidden sm:table-cell">
                  Contact
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-4 hidden md:table-cell">
                  Email Verified
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-4 hidden lg:table-cell">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((farmer, i) => (
                <tr
                  key={farmer.id}
                  className={`border-b border-slate-50 hover:bg-emerald-50/30 transition-colors ${
                    i === paginated.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {farmer.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{farmer.fullName}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 sm:hidden">
                          <Mail className="w-3 h-3" />
                          {farmer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {farmer.email}
                      </p>
                      {farmer.phone && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {farmer.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={statusVariant(farmer.status) as any} className="text-xs">
                      {farmer.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    {farmer.emailVerified ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <XCircle className="w-3.5 h-3.5" />
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    {farmer.createdAt ? (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(farmer.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
