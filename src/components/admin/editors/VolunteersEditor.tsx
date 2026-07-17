"use client";

import { Alert, Input, InputNumber, Space, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
} from "../editorKit";
import type { Team } from "@/lib/content/schema";

/** Editor TNV gom 2 nhánh: main.volunteerTeams và main.volunteerCount. */
export type VolunteersEditorInitial = {
  teams: Team[];
  count: number;
};

/** FR2-2.10: tên ban là bắt buộc; mỗi ban nên có ít nhất 1 thành viên. */
function missingFields(team: Team): string[] {
  const missing: string[] = [];
  if (!team.name.trim()) missing.push("tên ban");
  if (team.members.filter((m) => m.trim()).length === 0)
    missing.push("ít nhất một thành viên");
  return missing;
}

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
  const invalidCount = teams.filter((t) => missingFields(t).length > 0).length;
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

        <ListEditor<Team>
          value={teams}
          onChange={updateTeams}
          addLabel="Thêm ban"
          newItem={() => ({ name: "", members: [] })}
          renderItem={(team, updateTeam) => {
            const missing = missingFields(team);
            return (
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <Field label="Tên ban">
                    <Input
                      value={team.name}
                      placeholder="Ban Hậu cần"
                      status={team.name.trim() ? "" : "error"}
                      onChange={(e) =>
                        updateTeam({ ...team, name: e.target.value })
                      }
                    />
                  </Field>
                  <div className="mb-[14px]">
                    <Tag color="blue">{team.members.length} thành viên</Tag>
                  </div>
                </div>

                <div className="rounded-lg border border-black/10 p-3">
                  <ListEditor<string>
                    title="Danh sách thành viên"
                    value={team.members}
                    onChange={(members) => updateTeam({ ...team, members })}
                    addLabel="Thêm thành viên"
                    newItem={() => ""}
                    renderItem={(member, updateMember, index) => (
                      <Input
                        value={member}
                        placeholder={`Họ và tên thành viên ${index + 1}`}
                        status={member.trim() ? "" : "error"}
                        onChange={(e) => updateMember(e.target.value)}
                      />
                    )}
                  />
                </div>

                {missing.length > 0 ? (
                  <div className="text-xs text-red-500">
                    Cần điền {missing.join(", ")}.
                  </div>
                ) : null}
              </Space>
            );
          }}
        />
      </EditorCard>
    </>
  );
}
