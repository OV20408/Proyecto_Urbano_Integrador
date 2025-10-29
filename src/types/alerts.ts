export type Severity = "critical" | "high" | "medium" | "low";
export type Status = "open" | "ack" | "resolved" | "muted";
export type Source = "modelo" | "api" | "normativa";

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  status: Status;
  source: Source;
  createdAt: string; // ISO
  cityZone?: string;
  metric?: string;   // p.ej. PM2.5, NO2
  value?: number;
  threshold?: number;
}
