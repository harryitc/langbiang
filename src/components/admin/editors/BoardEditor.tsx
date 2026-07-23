"use client";

// Trình biên tập Ban tổ chức (main.board) — 2 danh sách: Sáng lập & Thành viên.
import { useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  Empty,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Tag,
} from "antd";
import {
  ImportOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
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

/** Modal chọn người đăng ký multi-select với Checkbox (chống thêm trùng) */
function SelectRegistrantModal({
  open,
  onClose,
  registrations = [],
  existingNames = [],
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  registrations?: Registration[];
  existingNames?: string[];
  onSelect: (items: { name: string; photo?: string }[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const existingSet = new Set(
    existingNames.map((n) => n.trim().toLowerCase())
  );

  const candidates = registrations.map((r, i) => {
    const info = extractRegistrantInfo(r);
    const isExisting = existingSet.has(info.name.trim().toLowerCase());
    return { id: i, ...info, at: r.at, isExisting };
  });

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const availableFiltered = filtered.filter((c) => !c.isExisting);

  const toggleSelect = (id: number, isExisting: boolean) => {
    if (isExisting) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const availableIds = availableFiltered.map((c) => c.id);
    const isAllAvailableSelected = availableIds.every((id) => selectedIds.has(id));

    if (isAllAvailableSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        availableIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        availableIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleConfirm = () => {
    const selectedItems = candidates
      .filter((c) => selectedIds.has(c.id) && !c.isExisting)
      .map((c) => ({ name: c.name, photo: c.photo }));
    onSelect(selectedItems);
    setSelectedIds(new Set());
    onClose();
  };

  const isAllSelected =
    availableFiltered.length > 0 &&
    availableFiltered.every((c) => selectedIds.has(c.id));

  return (
    <Modal
      open={open}
      onCancel={() => {
        setSelectedIds(new Set());
        onClose();
      }}
      title="Chọn người đăng ký làm thành viên"
      width={560}
      centered
      destroyOnClose
      footer={
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">
            {selectedIds.size > 0
              ? `Đã chọn ${selectedIds.size} người`
              : "Vui lòng tích chọn người đăng ký"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setSelectedIds(new Set());
                onClose();
              }}
            >
              Huỷ
            </Button>
            <Button
              type="primary"
              disabled={selectedIds.size === 0}
              icon={<PlusOutlined />}
              onClick={handleConfirm}
            >
              Thêm {selectedIds.size > 0 ? `${selectedIds.size} người` : ""}
            </Button>
          </div>
        </div>
      }
    >
      <div className="mb-3 flex items-center justify-between gap-3 pt-2">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm theo họ tên người đăng ký…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="flex-1"
        />
        {availableFiltered.length > 0 && (
          <Checkbox
            checked={isAllSelected}
            onChange={toggleSelectAll}
            className="select-none text-xs whitespace-nowrap"
          >
            Chọn tất cả ({availableFiltered.length})
          </Checkbox>
        )}
      </div>

      <div className="max-h-[380px] overflow-y-auto">
        {filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              search ? "Không tìm thấy người đăng ký phù hợp." : "Chưa có lượt đăng ký nào."
            }
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((c) => {
              const isChecked = selectedIds.has(c.id);
              const isExisting = c.isExisting;

              return (
                <div
                  key={c.id + c.name}
                  onClick={() => toggleSelect(c.id, isExisting)}
                  className={`flex items-center justify-between rounded-xl p-2.5 transition select-none ${isExisting
                    ? "bg-gray-50 opacity-60 cursor-not-allowed"
                    : isChecked
                      ? "bg-leaf/10 ring-1 ring-leaf/30 cursor-pointer"
                      : "hover:bg-gray-50 cursor-pointer"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked || isExisting}
                      disabled={isExisting}
                      onChange={() => toggleSelect(c.id, isExisting)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar
                      src={c.photo || undefined}
                      icon={!c.photo ? <UserOutlined /> : undefined}
                      size={40}
                      className="flex-shrink-0 bg-leaf"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{c.name}</span>
                        {isExisting && (
                          <Tag color="default" icon={<CheckCircleOutlined />} className="m-0 text-[11px]">
                            Đã có trong DS
                          </Tag>
                        )}
                      </div>
                      {c.at && (
                        <div className="text-xs opacity-50">
                          Đăng ký: {new Date(c.at).toLocaleDateString("vi-VN")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

  const existingNames = [...founders, ...members].map((m) => m.name);

  const handleSelectRegistrants = (selectedList: { name: string; photo?: string }[]) => {
    const existingSet = new Set(existingNames.map((n) => n.trim().toLowerCase()));

    const uniqueSelected = selectedList.filter(
      (s) => !existingSet.has(s.name.trim().toLowerCase())
    );

    const skippedCount = selectedList.length - uniqueSelected.length;
    if (skippedCount > 0) {
      message.warning(`Đã tự động bỏ qua ${skippedCount} thành viên đã có trong danh sách.`);
    }

    if (uniqueSelected.length === 0) return;

    const newMembers: Member[] = uniqueSelected.map((selected) => ({
      name: selected.name,
      photo: selected.photo ?? "",
      role: "",
      bio: "",
      isLeader: false,
      facebook: "",
    }));

    if (modalTarget === "founders") {
      update({ ...value, founders: [...founders, ...newMembers] });
    } else if (modalTarget === "members") {
      update({ ...value, members: [...members, ...newMembers] });
    }

    message.success(`Đã thêm ${uniqueSelected.length} thành viên mới!`);
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

          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold">Ban sáng lập — hiện ở đầu trang</div>
            <div className="flex items-center gap-2">
              <Button
                size="small"
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => update({ ...value, founders: [...founders, newMember()] })}
              >
                Thêm người sáng lập
              </Button>
              <Button
                size="small"
                icon={<ImportOutlined />}
                onClick={() => setModalTarget("founders")}
              >
                Chọn từ người đăng ký
              </Button>
              {founders.length > 0 && (
                <Popconfirm
                  title="Xoá hết danh sách Ban sáng lập?"
                  description="Toàn bộ người sáng lập sẽ bị xóa khỏi danh sách."
                  okText="Xoá hết"
                  cancelText="Huỷ"
                  onConfirm={() => {
                    update({ ...value, founders: [] });
                    message.success("Đã xóa toàn bộ Ban sáng lập.");
                  }}
                >
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    Xoá hết
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>

          <ItemListEditor<Member>
            addLabel="Thêm người sáng lập"
            hideAddButton
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
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold">
              Các thành viên — mục riêng bên dưới, để trống thì mục này tự ẩn
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="small"
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => update({ ...value, members: [...members, newMember()] })}
              >
                Thêm thành viên
              </Button>
              <Button
                size="small"
                icon={<ImportOutlined />}
                onClick={() => setModalTarget("members")}
              >
                Chọn từ người đăng ký
              </Button>
              {members.length > 0 && (
                <Popconfirm
                  title="Xoá hết danh sách thành viên Ban tổ chức?"
                  description="Toàn bộ thành viên sẽ bị xóa khỏi danh sách."
                  okText="Xoá hết"
                  cancelText="Huỷ"
                  onConfirm={() => {
                    update({ ...value, members: [] });
                    message.success("Đã xóa toàn bộ thành viên Ban tổ chức.");
                  }}
                >
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    Xoá hết
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>

          <ItemListEditor<Member>
            addLabel="Thêm thành viên"
            hideAddButton
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
        existingNames={existingNames}
        onSelect={handleSelectRegistrants}
      />
    </EditorCard>
  );
}
