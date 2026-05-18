
import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AppAlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const AppAlert: React.FC<AppAlertProps> = ({
  type,
  title,
  message,
  className,
  onAction,
  actionLabel
}) => {
  const styles = {
    error: "bg-red-500/10 border-red-500/20 text-red-500",
    success: "bg-green-500/10 border-green-500/20 text-green-500",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-500"
  };

  const Icons = {
    error: XCircle,
    success: CheckCircle2,
    warning: AlertCircle,
    info: Info
  };

  const Icon = Icons[type];

  return (
    <div className={cn(
      "w-full p-4 md:p-5 rounded-2xl border flex gap-4 transition-all animate-in fade-in slide-in-from-top-4",
      styles[type],
      className
    )}>
      <Icon className="w-5 h-5 shrink-0" />
      <div className="space-y-1">
        {title && <h4 className="text-xs font-black uppercase tracking-widest">{title}</h4>}
        <p className={cn("text-xs font-medium leading-relaxed", !title && "text-sm mt-0.5")}>
          {message}
        </p>
        {onAction && actionLabel && (
          <button 
            onClick={onAction}
            className="mt-2 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
