"use client";

// Editor "Sự kiện & số năm" (FRD 2.2 + FR3).
// Gom 2 nhánh nội dung độc lập: main.event và currentYear.
import { useMemo, useState } from "react";
import { Alert, DatePicker, Input, InputNumber, Space } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
} from "../editorKit";
import { eventDateLabel, isValidYear } from "@/lib/content/year";
import {
  COUNTDOWN_LABEL_MAC_DINH,
  type EventInfo,
} from "@/lib/content/schema";

/** Editor sự kiện gom 2 nhánh nội dung: main.event và currentYear (FR3). */
export type EventEditorInitial = {
  event: EventInfo;
  currentYear: number;
};

const DATE_FORMAT = "DD/MM/YYYY";

// Dùng chung eventDateLabel/isValidYear từ @/lib/content/year để xem trước
// trong admin khớp đúng nội dung render trên trang công khai.

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
  const errDateLabel = event.dateLabel.trim()
    ? ""
    : "Chưa điền Nhãn ngày — nhập ngày và tháng, vd: Ngày 26 – 27 tháng 9.";
  const errDateISO = event.dateISO.trim()
    ? ""
    : "Chưa chọn Ngày bắt đầu — bấm vào ô để chọn trên lịch.";
  const errLocation = event.location.trim()
    ? ""
    : "Chưa điền Địa điểm tổ chức.";
  const errDateEnd =
    startDate && endDate && endDate.isBefore(startDate, "day")
      ? "Ngày kết thúc đang sớm hơn ngày bắt đầu — chọn lại giúp nhé."
      : "";
  const errYear = isValidYear(yearDraft)
    ? ""
    : "Số năm chưa đúng — nhập đủ 4 chữ số, vd 2026.";

  // Xem trước đúng chuỗi khách sẽ thấy (đã tự nối số năm hiện tại).
  const dateLabelPreview = useMemo(
    () => eventDateLabel(event.dateLabel, year),
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
              Số năm của mùa đang tổ chức. Nó hiện ở tiêu đề trang chủ, nút đăng
              ký, chân trang và các lời mời tham gia. Đổi ở đây rồi bấm{" "}
              <strong>Xuất bản</strong> là mọi nơi tự cập nhật theo.
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
          <Alert type="warning" showIcon title={errYear} className="mt-1" />
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
              Dòng ngày hiện dưới tiêu đề lớn ở <strong>trang chủ</strong>. Chỉ
              nhập <strong>ngày và tháng</strong> — vd:{" "}
              <em>Ngày 26 – 27 tháng 9</em>. Số năm được thêm tự động theo
              &ldquo;Số năm hiện tại&rdquo; ở trên, không cần gõ.
            </>
          }
        >
          <Input
            placeholder="Ngày 26 – 27 tháng 9"
            status={errDateLabel ? "error" : undefined}
            value={event.dateLabel}
            onChange={(e) => setField("dateLabel", e.target.value)}
          />
          {event.dateLabel.trim() ? (
            <div className="mt-2 text-xs opacity-70">
              Khách sẽ thấy: <strong>{dateLabelPreview}</strong>
            </div>
          ) : null}
        </Field>

        <Space size={16} wrap align="start">
          <Field
            label="Ngày bắt đầu"
            hint="Dùng cho đồng hồ đếm ngược ở trang chủ và thông tin sự kiện gửi cho Google."
          >
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Chọn ngày bắt đầu"
              status={errDateISO ? "error" : undefined}
              value={startDate}
              onChange={(d) => setField("dateISO", toISO(d))}
            />
          </Field>

          <Field
            label="Ngày kết thúc"
            hint="Bỏ trống nếu chương trình chỉ diễn ra trong một ngày."
          >
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Chọn ngày kết thúc"
              status={errDateEnd ? "error" : undefined}
              value={endDate}
              onChange={(d) => setField("dateEndISO", toISO(d))}
            />
          </Field>
        </Space>

        <Field
          label="Chữ trên đồng hồ đếm ngược"
          hint={
            <>
              Dòng chữ nhỏ nằm ngay trên đồng hồ đếm ngược ở{" "}
              <strong>trang chủ</strong>. Bỏ trống thì hiện câu mặc định{" "}
              <em>{COUNTDOWN_LABEL_MAC_DINH}</em>.
            </>
          }
        >
          <Input
            placeholder={COUNTDOWN_LABEL_MAC_DINH}
            value={event.countdownLabel ?? ""}
            onChange={(e) => setField("countdownLabel", e.target.value)}
          />
        </Field>

        <Field
          label="Địa điểm chính"
          hint={
            <>
              Nơi tổ chức, vd: <em>Phường Langbiang, Đà Lạt, Lâm Đồng</em>. Dùng
              cho thông tin sự kiện gửi cho Google, và là mặc định cho ba nơi
              bên dưới.
            </>
          }
        >
          <Input
            placeholder="Nhập địa điểm tổ chức"
            status={errLocation ? "error" : undefined}
            value={event.location}
            onChange={(e) => setField("location", e.target.value)}
          />
        </Field>

        <div className="mb-3 rounded-lg border border-black/10 bg-black/[0.02] p-3">
          <div className="mb-1 font-semibold">Ghi riêng cho từng nơi</div>
          <p className="mb-3 text-sm opacity-60">
            Ba ô dưới đây đều <strong>không bắt buộc</strong>. Bỏ trống thì nơi
            đó dùng luôn địa điểm chính ở trên. Chỉ điền khi muốn chỗ đó ghi
            khác đi — ví dụ chân trang cần ngắn gọn hơn.
          </p>

          <Field
            label="Ở chân trang"
            hint="Dòng địa chỉ nhỏ cuối mỗi trang. Thường viết ngắn."
          >
            <Input
              placeholder={event.location || "Bỏ trống để dùng địa điểm chính"}
              value={event.locationFooter ?? ""}
              onChange={(e) => setField("locationFooter", e.target.value)}
            />
          </Field>

          <Field
            label="Ở mục Lịch trình"
            hint="Câu “… tại <địa điểm>.” ngay dưới tiêu đề khối Lịch trình."
          >
            <Input
              placeholder={event.location || "Bỏ trống để dùng địa điểm chính"}
              value={event.locationTimeline ?? ""}
              onChange={(e) => setField("locationTimeline", e.target.value)}
            />
          </Field>

          <Field
            label="Ở trang Chương trình"
            hint="Phụ đề đầu trang Chương trình và mô tả trang đó khi chia sẻ."
          >
            <Input
              placeholder={event.location || "Bỏ trống để dùng địa điểm chính"}
              value={event.locationProgram ?? ""}
              onChange={(e) => setField("locationProgram", e.target.value)}
            />
          </Field>
        </div>

        {errDateLabel || errDateISO || errLocation || errDateEnd ? (
          <Alert
            type="warning"
            showIcon
            title="Còn vài ô cần điền lại"
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
