"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, ListEditor, useSectionAutosave } from "@/components/admin/editorKit";
import type { Board, Member } from "@/lib/content/schema";

export default function BoardEditor({ initial }: { initial: Board }) {
  const [board, setBoard] = useState<Board>(initial);
  const { status, savedCount } = useSectionAutosave("board", board);

  const renderMember = (m: Member, patch: (p: Partial<Member>) => void) => (
    <div style={{ display: "grid", gap: 8 }}>
      <Input
        addonBefore="Tên"
        value={m.name}
        onChange={(e) => patch({ name: e.target.value })}
      />
      <Input
        addonBefore="Vai trò"
        value={m.role}
        onChange={(e) => patch({ role: e.target.value })}
      />
      <Input
        addonBefore="Ảnh"
        placeholder="/team/abc.jpg"
        value={m.photo}
        onChange={(e) => patch({ photo: e.target.value })}
      />
      <Input.TextArea
        autoSize={{ minRows: 2 }}
        value={m.bio}
        onChange={(e) => patch({ bio: e.target.value })}
      />
    </div>
  );

  return (
    <EditorLayout
      title="Ban tổ chức"
      description="Quản lý ban sáng lập và thành viên. Tự lưu nháp; xem trước bên phải."
      status={status}
      savedCount={savedCount}
      previewPath="/ban-to-chuc"
    >
      <div style={{ fontWeight: 700, margin: "4px 0 8px" }}>Ban sáng lập</div>
      <ListEditor<Member>
        value={board.founders}
        onChange={(founders) => setBoard((b) => ({ ...b, founders }))}
        addLabel="Thêm thành viên"
        itemTitle={(m) => m.name}
        newItem={() => ({ name: "Thành viên mới", role: "", photo: "", bio: "" })}
        renderItem={renderMember}
      />
      <div style={{ fontWeight: 700, margin: "4px 0 8px" }}>Thành viên</div>
      <ListEditor<Member>
        value={board.members}
        onChange={(members) => setBoard((b) => ({ ...b, members }))}
        addLabel="Thêm thành viên"
        itemTitle={(m) => m.name}
        newItem={() => ({ name: "Thành viên mới", role: "", photo: "", bio: "" })}
        renderItem={renderMember}
      />
    </EditorLayout>
  );
}
