"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";

import { cn } from "./utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function toKeyPart(v: unknown): string | undefined {
  if (typeof v === "string" || typeof v === "number" || typeof v === "bigint") {
    return String(v);
  }
  return undefined;
}

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof ResponsiveContainer>["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          // Layout & containment
          "min-w-0 w-full h-full overflow-hidden text-xs",
          // Recharts internals theming hooks
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-hidden",
          "[&_.recharts-sector]:outline-hidden",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, c]) => c.theme || c.color);
  if (!colorConfig.length) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const lines = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            (itemConfig as { theme?: Record<keyof typeof THEMES, string>; color?: string }).theme?.[
              theme as keyof typeof THEMES
            ] || (itemConfig as { color?: string }).color;

          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");

      return `${prefix} [data-chart=${id}] {\n${lines}\n}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

// Re-export Recharts primitives for convenience
const ChartTooltip = RechartsTooltip;
const ChartLegend = RechartsLegend;

/** Minimal, version-safe tooltip item shape (works with Recharts v2/v3) */
type TooltipValue = number | string | bigint | Array<number | string | bigint>;
type TooltipName = React.ReactNode;
type TooltipItem = {
  color?: string;
  dataKey?: string | number | bigint;
  name?: TooltipName;
  value?: TooltipValue;
  payload: Record<string, unknown>;
};

/** Props the custom tooltip renderer actually receives from <Tooltip content={...} /> */
type ChartTooltipContentProps = {
  active?: boolean;
  payload?: TooltipItem[];
  label?: React.ReactNode;
  labelFormatter?: (label: React.ReactNode, payload: TooltipItem[] | undefined) => React.ReactNode;
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelClassName?: string;
  color?: string;
  nameKey?: string;
  labelKey?: string;
  formatter?: (
    value: TooltipValue,
    name: TooltipName,
    item: TooltipItem,
    index: number,
    payload: TooltipItem["payload"],
  ) => React.ReactNode;
};

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload || payload.length === 0) return null;

    const [first] = payload;
    const key =
      toKeyPart(labelKey) ??
      toKeyPart(first?.dataKey) ??
      toKeyPart(first?.name) ??
      "value";
    const itemConfig = getPayloadConfigFromPayload(config, first, key);

    const computed =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(computed ?? "", payload)}
        </div>
      );
    }

    if (!computed) return null;
    return <div className={cn("font-medium", labelClassName)}>{computed}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload || payload.length === 0) return null;

  const items = payload;
  const nestLabel = items.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}

      <div className="grid gap-1.5">
        {items.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          const indicatorColor =
            color ||
            (isRecord(item.payload) && typeof item.payload["fill"] === "string"
              ? (item.payload["fill"] as string)
              : undefined) ||
            item.color;

          // Allow CSS variables in style via an extended type
          type WithVars = React.CSSProperties & {
            ["--color-bg"]?: string;
            ["--color-border"]?: string;
          };

          return (
            <div
              key={String(item.dataKey ?? item.name ?? index)}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" ? "items-center" : undefined,
              )}
            >
              {formatter && item.value !== undefined && item.name !== undefined ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {!hideIndicator && (
                    <div
                      className={cn(
                        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                        {
                          "h-2.5 w-2.5": indicator === "dot",
                          "w-1": indicator === "line",
                          "w-0 border-[1.5px] border-dashed bg-transparent":
                            indicator === "dashed",
                          "my-0.5": nestLabel && indicator === "dashed",
                        },
                      )}
                      style={
                        {
                          "--color-bg": indicatorColor,
                          "--color-border": indicatorColor,
                        } as WithVars
                      }
                    />
                  )}

                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center",
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label ?? item.name}
                      </span>
                    </div>

                    {item.value != null && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {typeof item.value === "number"
                          ? item.value.toLocaleString()
                          : Array.isArray(item.value)
                            ? item.value.join(", ")
                            : String(item.value)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Legend payload item shape that works across Recharts versions */
type LegendPayloadItem = {
  value?: string | number;
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
};

type ChartLegendContentProps = {
  className?: string;
  hideIcon?: boolean;
  payload?: LegendPayloadItem[];
  verticalAlign?: "top" | "middle" | "bottom";
  nameKey?: string;
};

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload || payload.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload.map((item) => {
        const key =
          toKeyPart(nameKey) ??
          toKeyPart(item.dataKey) ??
          "value";
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={String(item.value ?? item.dataKey)}
            className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3",
            )}
          >
            {!hideIcon ? (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            ) : null}
            {itemConfig?.label ?? item.value}
          </div>
        );
      })}
    </div>
  );
}

// ---------- helpers ----------

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/**
 * Extracts a config entry from `config` by resolving `key`, allowing
 * indirection via `payload[key]` or `payload.payload[key]` when they are strings.
 */
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (!isRecord(payload)) return undefined;

  const topVal = payload[key];
  const nested = isRecord(payload.payload) ? (payload.payload as Record<string, unknown>) : undefined;
  const nestedVal = nested?.[key];

  let configLabelKey = key;
  if (typeof topVal === "string") {
    configLabelKey = topVal;
  } else if (typeof nestedVal === "string") {
    configLabelKey = nestedVal;
  }

  if (configLabelKey in config) {
    return config[configLabelKey as keyof ChartConfig];
  }
  if (key in config) {
    return config[key as keyof ChartConfig];
  }
  return undefined;
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
