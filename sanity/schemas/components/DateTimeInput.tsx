import React, { useCallback, useMemo } from "react";
import { Flex, Stack } from "@sanity/ui";
import { set, unset, type InputProps } from "sanity";

function parseDatetime(value: string | undefined): {
  date: string;
  time: string;
} {
  if (!value) return { date: "", time: "" };
  const d = new Date(value);
  if (isNaN(d.getTime())) return { date: "", time: "" };
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}

function toISOString(date: string, time: string): string {
  const t = time || "00:00";
  return new Date(`${date}T${t}:00`).toISOString();
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "3px",
  border: "1px solid var(--card-border-color, #ccc)",
  background: "var(--card-bg-color, #fff)",
  color: "var(--card-fg-color, #1a1a1a)",
  fontSize: "1rem",
  fontFamily: "inherit",
  lineHeight: "normal",
  boxSizing: "border-box",
};

export function DateTimeInput(props: InputProps) {
  const { value, onChange } = props;
  const { date, time } = useMemo(
    () => parseDatetime(value as string | undefined),
    [value],
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      if (!newDate) {
        onChange(unset());
        return;
      }
      onChange(set(toISOString(newDate, time)));
    },
    [onChange, time],
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value;
      if (!date) return;
      onChange(set(toISOString(date, newTime)));
    },
    [onChange, date],
  );

  return (
    <Flex gap={3}>
      <Stack space={2} style={{ flex: 2 }}>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          style={inputStyle}
        />
      </Stack>
      <Stack space={2} style={{ flex: 1 }}>
        <input
          type="time"
          value={time}
          onChange={handleTimeChange}
          style={inputStyle}
        />
      </Stack>
    </Flex>
  );
}
