import React from "react";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ExpertTable() {
  return (
    <Table>
      <thead>
        <tr className="border-b text-xs font-semibold text-slate-400">
          <th className="py-2.5">Expert Name</th>
          <th>Field</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100 text-xs">
          <td className="py-3 font-semibold text-slate-800">Dr. Anil Sharma</td>
          <td>Vegetable Agronomy</td>
          <td><Badge variant="success">Verified</Badge></td>
        </tr>
      </tbody>
    </Table>
  );
}
