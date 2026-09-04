import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function VerificationCard({ name, credential }: { name: string; credential: string }) {
  return (
    <Card className="space-y-3">
      <h4 className="font-bold text-slate-900 text-sm">Verify Applicant: {name}</h4>
      <p className="text-xs text-slate-500">Submitted Credential: {credential}</p>
      <div className="flex gap-2">
        <Button size="sm">Approve</Button>
        <Button size="sm" variant="outline">Reject</Button>
      </div>
    </Card>
  );
}
