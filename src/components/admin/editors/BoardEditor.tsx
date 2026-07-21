"use client";

// Trình biên tập Ban tổ chức (main.board) — 2 danh sách: Sáng lập & Thành viên.
import { Alert, Input, Space, Switch } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ImageField,
} from "../editorKit";
import { ItemListEditor } from "../itemList";
import type { Board, Member } from "@/lib/content/schema";

/** Phần tử mới rỗng cho danh sách thành viên. */
function newMember(): Member {
  return { name: "", role: "", photo: "", bio: "", isLeader: false, facebook: "" };
}

/** Danh sách trường bắt buộc còn trống của một thành viên (FR2-R3). */
function missingFields(m: Member): string[] {
  const missing: string[] = [];
  if (!m.name.trim()) missing.push("họ tên");
  return missing;
}

/** Biểu mẫu cho một thành viên (dùng chung cho cả 2 danh sách). */
function MemberForm({
  item,
  update,
  folder,
}: {
  item: Member;
  update: (next: Member) => void;
  folder: string;
}) {
  const missing = missingFields(item);
  return (
    <div className="w-full">
      <div className="grid gap-x-4 md:grid-cols-2">
        <Field label="Họ tên *">
          <Input
            placeholder="Vd: Lê Minh Vũ"
            value={item.name}
            status={item.name.trim() ? undefined : "error"}
            onChange={(e) => update({ ...item, name: e.target.value })}
          />
        </Field>
        <Field label="Vai trò (tùy chọn)">
          <Input
            placeholder="Vd: Trưởng ban sáng lập"
            value={item.role ?? ""}
            onChange={(e) => update({ ...item, role: e.target.value })}
          />
        </Field>
      </div>

      <div className="grid gap-x-4 md:grid-cols-2">
        <Field label="Link Facebook (tùy chọn)" hint="Đường dẫn trang Facebook cá nhân">
          <Input
            placeholder="https://facebook.com/..."
            value={item.facebook ?? ""}
            onChange={(e) => update({ ...item, facebook: e.target.value })}
          />
        </Field>
        <Field label="Trưởng ban (tùy chọn)" hint="Hiển thị ngôi sao ⭐ ở góc trên bên trái ảnh (dành cho Ban sáng lập)">
          <div className="flex items-center gap-2 pt-1">
            <Switch
              checked={item.isLeader ?? false}
              onChange={(checked) => update({ ...item, isLeader: checked })}
            />
            <span className="text-xs text-gray-500">
              {item.isLeader ? "Có (Hiển thị ngôi sao ⭐)" : "Không"}
            </span>
          </div>
        </Field>
      </div>

      <Field
        label="Ảnh (tùy chọn)"
        hint="Ảnh chân dung. Bỏ trống thì trang hiện vòng tròn chữ cái đầu của tên."
      >
        <ImageField
          /* Ảnh chân dung hiện trong vòng tròn nên cắt vuông. */
          aspect={1}
          value={item.photo ?? ""}
          onChange={(url) => update({ ...item, photo: url })}
          folder={folder}
        />
      </Field>
      <Field
        label="Giới thiệu / Nội dung (tùy chọn)"
        hint="Vài dòng giới thiệu hoặc nội dung hiển thị bên dưới thành viên."
      >
        <Input.TextArea
          placeholder="Vài dòng giới thiệu về thành viên…"
          autoSize={{ minRows: 2, maxRows: 6 }}
          value={item.bio ?? ""}
          onChange={(e) => update({ ...item, bio: e.target.value })}
        />
      </Field>
      {missing.length > 0 ? (
        <Alert
          type="warning"
          showIcon
          title="Vui lòng nhập Họ tên cho thành viên."
        />
      ) : null}
    </div>
  );
}

export default function BoardEditor({ initial }: { initial: Board }) {
  const { value, update, status } = useSectionAutosave<Board>(
    "main.board",
    initial
  );

  const founders = value.founders ?? [];
  const members = value.members ?? [];
  const totalMissing =
    founders.filter((m) => missingFields(m).length > 0).length +
    members.filter((m) => missingFields(m).length > 0).length;

  return (
    <EditorCard title="Ban tổ chức" extra={<SaveStatusTag status={status} />}>
      <Space orientation="vertical" size={16} style={{ width: "100%" }}>
        {totalMissing > 0 ? (
          <Alert
            type="warning"
            showIcon
            title={`Có ${totalMissing} thành viên chưa nhập họ tên.`}
            description="Mỗi người cần điền họ tên trước khi xuất bản."
          />
        ) : null}

        <div>
          <p className="mb-2 text-xs opacity-60">
            Hai danh sách này hiện ở <strong>trang Ban tổ chức</strong>. Thứ tự
            xếp ở đây cũng là thứ tự khách nhìn thấy. Kéo biểu tượng ⣿ để đổi
            thứ tự; bấm vào một dòng để sửa chi tiết.
          </p>
          <div className="mb-2 font-semibold">
            Ban sáng lập — hiện ở đầu trang
          </div>
          <ItemListEditor<Member>
            addLabel="Thêm người sáng lập"
            value={founders}
            onChange={(next) => update({ ...value, founders: next })}
            newItem={newMember}
            getRow={(m) => ({
              title: m.name,
              subtitle: m.role || undefined,
              thumb: m.photo || undefined,
              invalid: missingFields(m).length > 0,
            })}
            drawerTitle="Thành viên"
            renderForm={(item, updateItem) => (
              <MemberForm
                item={item}
                update={updateItem}
                folder="team/founders"
              />
            )}
          />
        </div>

        <div>
          <div className="mb-2 font-semibold">
            Các thành viên — mục riêng bên dưới, để trống thì mục này tự ẩn
          </div>
          <ItemListEditor<Member>
            addLabel="Thêm thành viên"
            value={members}
            onChange={(next) => update({ ...value, members: next })}
            newItem={newMember}
            getRow={(m) => ({
              title: m.name,
              subtitle: m.role || undefined,
              thumb: m.photo || undefined,
              invalid: missingFields(m).length > 0,
            })}
            drawerTitle="Thành viên"
            renderForm={(item, updateItem) => (
              <MemberForm
                item={item}
                update={updateItem}
                folder="team/members"
              />
            )}
          />
        </div>
      </Space>
    </EditorCard>
  );
}
