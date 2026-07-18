"use client";

import { Alert, InputNumber } from "antd";
import { useSectionAutosave, SaveStatusTag, EditorCard, Field } from "../editorKit";
import { TeamListEditor, missingTeamFields } from "./sections";
import type { Team } from "@/lib/content/schema";

/** Editor TNV gom 2 nhánh: main.volunteerTeams và main.volunteerCount. */
export type VolunteersEditorInitial = {
  teams: Team[];
  count: number;
};

// Tình nguyện viên — main.volunteerTeams + main.volunteerCount
export default function VolunteersEditor({
  initial,
}: {
  initial: VolunteersEditorInitial;
}) {
  const {
    value: teams,
    update: updateTeams,
    status: teamsStatus,
  } = useSectionAutosave<Team[]>("main.volunteerTeams", initial.teams);
  const {
    value: count,
    update: updateCount,
    status: countStatus,
  } = useSectionAutosave<number>("main.volunteerCount", initial.count);

  // Tổng hợp cảnh báo cho toàn danh sách (hiện ở đầu thẻ).
  const invalidCount = teams.filter((t) => missingTeamFields(t).length > 0).length;
  // Số tên thành viên thực tế đã nhập (bỏ ô trống) — để đối chiếu với tổng số.
  const namedMembers = teams.reduce(
    (sum, t) => sum + t.members.filter((m) => m.trim()).length,
    0
  );

  return (
    <>
      <EditorCard
        title="Tổng số tình nguyện viên"
        extra={<SaveStatusTag status={countStatus} />}
      >
        <Field
          label="Tổng số TNV"
          hint='Hiển thị ở khối "Đại gia đình" dưới dạng "80+ trái tim". Nên đồng bộ với con số nổi bật tương ứng.'
        >
          <InputNumber
            value={count}
            min={0}
            precision={0}
            style={{ width: 200 }}
            placeholder="80"
            // Để trống ô số ⇒ quy về 0 (tránh NaN lọt vào bản nháp JSON).
            onChange={(v) => updateCount(typeof v === "number" ? v : 0)}
          />
        </Field>
        <div className="text-xs opacity-60">
          Đang có {namedMembers} tên thành viên trong {teams.length} ban.
        </div>
      </EditorCard>

      <EditorCard
        title="Các ban tình nguyện viên"
        extra={<SaveStatusTag status={teamsStatus} />}
      >
        {invalidCount > 0 ? (
          <Alert
            type="warning"
            showIcon
            className="mb-3"
            message={`Có ${invalidCount} ban chưa điền đủ thông tin.`}
          />
        ) : null}

        <TeamListEditor value={teams} onChange={updateTeams} />
      </EditorCard>
    </>
  );
}
