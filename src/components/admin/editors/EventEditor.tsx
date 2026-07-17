"use client";

// Editor "Sự kiện & số năm" (FRD 2.2 + FR3).
// Gom 2 nhánh nội dung độc lập: main.event và currentYear.
import { useMemo, useState } from "react";
import { Alert, DatePicker, Input, InputNumber, Space, Tag } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
} from "../editorKit";
import type { EventInfo } from "@/lib/content/schema";

/** Editor sự kiện gom 2 nhánh nội dung: main.event và currentYear (FR3). */
export type EventEditorInitial = {
  event: EventInfo;
  currentYear: number;
};

const DATE_FORMAT = "DD/MM/YYYY";

/** Chuỗi ISO 'YYYY-MM-DD' → Dayjs (null nếu trống/không hợp lệ). */
function toDayjs(iso?: string): Dayjs | null {
  if (!iso) return null;
  // 'YYYY-MM-DD' là định dạng ISO nên dayjs parse được sẵn (không cần plugin).
  const d = dayjs(iso);
  return d.isValid() ? d : null;
}

/** Dayjs → chuỗi ISO 'YYYY-MM-DD' (rỗng nếu bỏ chọn). */
function toISO(d: Dayjs | null): string {
  return d ? d.format("YYYY-MM-DD") : "";
}

/** Số năm hợp lệ = số nguyên 4 chữ số (FR3-R2). */
function isValidYear(y: unknown): y is number {
  return typeof y === "number" && Number.isInteger(y) && y >= 1000 && y <= 9999;
}

export default function EventEditor({
  initial,
}: {
  initial: EventEditorInitial;
}) {
  // Nhánh main.event — tự lưu nháp (FR5).
  const { value: event, update: updateEvent, status: eventStatus } =
    useSectionAutosave<EventInfo>("main.event", initial.event);

  // Nhánh currentYear — chỉ ghi khi số năm hợp lệ (FR3-R2).
  const { value: year, update: updateYear, status: yearStatus } =
    useSectionAutosave<number>("currentYear", initial.currentYear);

  // Giá trị đang gõ ở ô năm (có thể tạm rỗng/không hợp lệ, chưa ghi vào store).
  const [yearDraft, setYearDraft] = useState<number | null>(initial.currentYear);

  /** Sửa 1 trường của main.event. */
  const setField = <K extends keyof EventInfo>(key: K, val: EventInfo[K]) =>
    updateEvent({ ...event, [key]: val });

  const startDate = toDayjs(event.dateISO);
  const endDate = toDayjs(event.dateEndISO);

  // Kiểm tra trường bắt buộc (FR2-R3).
  const errDateLabel = event.dateLabel.trim() ? "" : "Cần điền Nhãn ngày.";
  const errDateISO = event.dateISO.trim() ? "" : "Cần chọn Ngày bắt đầu.";
  const errLocation = event.location.trim() ? "" : "Cần điền Địa điểm.";
  const errDateEnd =
    startDate && endDate && endDate.isBefore(startDate, "day")
      ? "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu."
      : "";
  const errYear = isValidYear(yearDraft) ? "" : "Số năm không hợp lệ (cần 4 chữ số).";

  // Xem trước nhãn ngày sau khi thay ký hiệu {năm} bằng số năm hiện tại.
  const dateLabelPreview = useMemo(
    () => event.dateLabel.replaceAll("{năm}", String(year)),
    [event.dateLabel, year]
  );

  return (
    <>
      <EditorCard
        title="Số năm hiện tại"
        extra={<SaveStatusTag status={yearStatus} />}
      >
        <Field
          label="Số năm hiện tại"
          hint={
            <>
              Số năm dùng chung cho toàn giao diện (tiêu đề trang, nút đăng ký,
              chân trang…). Đổi ở đây rồi <strong>Xuất bản</strong> là mọi nơi
              cập nhật theo.
            </>
          }
        >
          <InputNumber
            className="w-40"
            min={1000}
            max={9999}
            step={1}
            precision={0}
            controls={false}
            placeholder="vd 2026"
            status={errYear ? "error" : undefined}
            value={yearDraft}
            onChange={(v) => {
              const next = typeof v === "number" ? v : null;
              setYearDraft(next);
              // Để trống / sai định dạng → giữ giá trị cũ, không ghi nháp.
              if (isValidYear(next) && next !== year) updateYear(next);
            }}
            onBlur={() => {
              // Rời ô mà giá trị không hợp lệ → khôi phục số năm đang lưu.
              if (!isValidYear(yearDraft)) setYearDraft(year);
            }}
          />
        </Field>
        {errYear ? (
          <Alert type="warning" showIcon message={errYear} className="mt-1" />
        ) : null}
      </EditorCard>

      <EditorCard
        title="Thông tin sự kiện"
        extra={<SaveStatusTag status={eventStatus} />}
      >
        <Field
          label="Nhãn ngày (hiển thị)"
          hint={
            <>
              Chuỗi ngày hiển thị cho khách. Dùng ký hiệu{" "}
              <Tag className="mx-1">{"{năm}"}</Tag> để tự thay bằng số năm hiện
              tại — vd: <em>Ngày 26 – 27 tháng 9 năm {"{năm}"}</em>.
            </>
          }
        >
          <Input
            placeholder="Ngày 26 – 27 tháng 9 năm {năm}"
            status={errDateLabel ? "error" : undefined}
            value={event.dateLabel}
            onChange={(e) => setField("dateLabel", e.target.value)}
          />
          {event.dateLabel.trim() ? (
            <div className="mt-2 text-xs opacity-70">
              Xem trước: <strong>{dateLabelPreview}</strong>
            </div>
          ) : null}
        </Field>

        <Space size={16} wrap align="start">
          <Field
            label="Ngày bắt đầu"
            hint="Dùng cho đồng hồ đếm ngược và dữ liệu sự kiện (JSON-LD)."
          >
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Chọn ngày bắt đầu"
              status={errDateISO ? "error" : undefined}
              value={startDate}
              onChange={(d) => setField("dateISO", toISO(d))}
            />
          </Field>

          <Field label="Ngày kết thúc" hint="Có thể bỏ trống nếu sự kiện 1 ngày.">
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Chọn ngày kết thúc"
              status={errDateEnd ? "error" : undefined}
              value={endDate}
              onChange={(d) => setField("dateEndISO", toISO(d))}
            />
          </Field>
        </Space>

        <Field label="Địa điểm" hint="vd: Núi Langbiang, Lạc Dương, Lâm Đồng">
          <Input
            placeholder="Nhập địa điểm tổ chức"
            status={errLocation ? "error" : undefined}
            value={event.location}
            onChange={(e) => setField("location", e.target.value)}
          />
        </Field>

        {errDateLabel || errDateISO || errLocation || errDateEnd ? (
          <Alert
            type="warning"
            showIcon
            message="Còn trường cần kiểm tra"
            description={
              <ul className="m-0 list-disc pl-4">
                {[errDateLabel, errDateISO, errLocation, errDateEnd]
                  .filter(Boolean)
                  .map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
              </ul>
            }
          />
        ) : null}
      </EditorCard>
    </>
  );
}
