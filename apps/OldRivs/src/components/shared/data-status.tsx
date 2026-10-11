interface DataStatusProps {
  status: "current" | "stale" | "unavailable";
  message?: string;
  updatedAt?: string;
}

export function DataStatus({ status, message, updatedAt }: DataStatusProps) {
  if (status === "current") {
    return updatedAt ? <p className="data-status">Last updated {new Date(updatedAt).toLocaleString()}</p> : null;
  }
  return <p className={`data-status data-status--${status}`} role="status">{message ?? "Information is currently unavailable."}</p>;
}
