"use client";

// Trình biên tập Ban tổ chức (main.board) — 2 danh sách: Sáng lập & Thành viên.
import { useState } from "react";
import { Alert, Avatar, Button, Empty, Input, Modal, Space, Switch } from "antd";
import {
  ImportOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ImageField,
} from "../editorKit";
import { ItemListEditor } from "../itemList";
import type { Board, Member, Registration } from "@/lib/content/schema";

/** Trích xuất tên và ảnh từ một đơn đăng ký */
function extractRegistrantInfo(r: Registration) {
  let name = "";
  let photo = "";

  for (const [key, val] of Object.entries(r.values ?? {})) {
    if (!val || typeof val !== "string") continue;
    const label = (r.labels?.[key] ?? key).toLowerCase();
    const strVal = val.trim();

    if (!name) {
      if (
        label.includes("tên") ||
        label.includes("họ") ||
        label.includes("name") ||
        key.toLowerCase().includes("name")
      ) {
        name = strVal;
      }
    }

    if (!photo) {
      if (
        label.includes("ảnh") ||
        label.includes("photo") ||
        label.includes("avatar") ||
        strVal.startsWith("http") ||
        strVal.startsWith("/uploads/")
      ) {
        photo = strVal;
      }
    }
  }

  if (!name) {
    const firstNonUrl = Object.values(r.values ?? {}).find(
      (v) => typeof v === "string" && !v.startsWith("http") && !v.startsWith("/") && v.trim().length > 0
    );
    name = firstNonUrl ? firstNonUrl.trim() : "Người đăng ký";
  }

  return { name, photo };
}

/** Modal chọn người đăng ký đơn giản (Ảnh + Họ tên) */
function SelectRegistrantModal({
  open,
  onClose,
  registrations = [],
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  registrations?: Registration[];
  onSelect: (item: { name: string; photo?: string }) => void;
}) {
  const [search, setSearch] = useState("");

  const candidates = registrations.map((r, i) => {
    const info = extractRegistrantInfo(r);
    return { id: i, ...info, at: r.at };
  });

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Chọn người đăng ký làm thành viên"
      width={520}
      destroyOnClose
    >
      <div className="mb-4 pt-2">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm theo họ tên người đăng ký…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      <div className="max-h-[380px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              search ? "Không tìm thấy người đăng ký phù hợp." : "Chưa có lượt đăng ký nào."
            }
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <div
                key={c.id + c.name}
                className="flex items-center justify-between py-2.5 px-3 hover:bg-gray-50 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={c.photo || undefined}
                    icon={!c.photo ? <UserOutlined /> : undefined}
                    size={42}
                    className="flex-shrink-0 bg-leaf"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{c.name}</div>
                    {c.at && (
                      <div className="text-xs opacity-50">
                        Đăng ký: {new Date(c.at).toLocaleDateString("vi-VN")}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    onSelect({ name: c.name, photo: c.photo });
                    onClose();
                  }}
                >
                  Chọn
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

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

export default function BoardEditor({
  initial,
  registrations = [],
}: {
  initial: Board;
  registrations?: Registration[];
}) {
  const { value, update, status } = useSectionAutosave<Board>(
    "main.board",
    initial
  );

  const [modalTarget, setModalTarget] = useState<"founders" | "members" | null>(null);

  const founders = value.founders ?? [];
  const members = value.members ?? [];
  const totalMissing =
    founders.filter((m) => missingFields(m).length > 0).length +
    members.filter((m) => missingFields(m).length > 0).length;

  const handleSelectRegistrant = (selected: { name: string; photo?: string }) => {
    const newM: Member = {
      name: selected.name,
      photo: selected.photo ?? "",
      role: "",
      bio: "",
      isLeader: false,
      facebook: "",
    };

    if (modalTarget === "founders") {
      update({ ...value, founders: [...founders, newM] });
    } else if (modalTarget === "members") {
      update({ ...value, members: [...members, newM] });
    }
  };

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

          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold">Ban sáng lập — hiện ở đầu trang</div>
            <Button
              size="small"
              icon={<ImportOutlined />}
              onClick={() => setModalTarget("founders")}
            >
              Chọn từ người đăng ký
            </Button>
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
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold">
              Các thành viên — mục riêng bên dưới, để trống thì mục này tự ẩn
            </div>
            <Button
              size="small"
              icon={<ImportOutlined />}
              onClick={() => setModalTarget("members")}
            >
              Chọn từ người đăng ký
            </Button>
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

      <SelectRegistrantModal
        open={modalTarget !== null}
        onClose={() => setModalTarget(null)}
        registrations={registrations}
        onSelect={handleSelectRegistrant}
      />
    </EditorCard>
  );
}
