import React from "react";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function UserTable() {
  const users = [
    { name: "Ram Bahadur", role: "FARMER", email: "ram@krishiai.com", date: "2026-08-10" },
    { name: "Dr. Sita Karki", role: "EXPERT", email: "sita@krishiai.com", date: "2026-08-01" },
  ];

  return (
    <Table>
      <thead>
        <tr className="border-b text-xs font-semibold text-slate-400">
          <th className="py-2.5">Name</th>
          <th>Role</th>
          <th>Email</th>
          <th>Registered</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u, i) => (
          <tr key={i} className="border-b border-slate-100 text-xs">
            <td className="py-3 font-semibold text-slate-800">{u.name}</td>
            <td><Badge variant={u.role === "EXPERT" ? "info" : "success"}>{u.role}</Badge></td>
            <td>{u.email}</td>
            <td>{u.date}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
