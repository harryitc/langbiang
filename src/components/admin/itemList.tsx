"use client";

// Hai kiểu danh sách dùng chung cho Admin CMS:
//  - SortableList: sửa tại chỗ (inline) + kéo thả. Dùng cho mục ngắn (FAQ, thẻ
//    biểu tượng, kênh gây quỹ, danh sách con lồng bên trong).
//  - ItemListEditor: danh sách gọn -> bấm mở Drawer sửa chi tiết + kéo thả.
//    Dùng cho mục nặng (bài tin tức, năm đã qua, ban tổ chức, hạng tài trợ)
//    để không phải cuộn qua hàng loạt form và không mount cùng lúc nhiều
//    trình soạn thảo.
import { useState, type ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Drawer, Empty, Popconfirm, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  RightOutlined,
  HolderOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";

/**
 * Số mục render mỗi lô. Danh sách dài (vd thư viện một năm có ~186 ảnh) mà
 * render hết sẽ dựng bấy nhiêu hàng kèm bấy nhiêu hook kéo-thả -> nặng.
 * Kéo-thả vẫn hoạt động trong phạm vi các mục đang hiện.
 */
const LIST_PAGE = 24;

/* ------------------------------------------------------------------
   Hạ tầng kéo thả dùng chung
   ------------------------------------------------------------------ */
function useDnd(count: number, onMove: (from: number, to: number) => void) {
  const sensors = useSensors(
    // Giữ 6px mới bắt đầu kéo -> không cướp cú bấm vào ô nhập bên trong.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const ids = Array.from({ length: count }, (_, i) => String(i));
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onMove(Number(active.id), Number(over.id));
  };
  return { sensors, ids, onDragEnd };
}

/** Nút nắm để kéo. */
type SortableHandle = Pick<
  ReturnType<typeof useSortable>,
  "attributes" | "listeners"
>;

function DragHandle({ attributes, listeners }: SortableHandle) {
  return (
    <Tooltip title="Kéo để đổi thứ tự">
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none px-1 text-base opacity-40 hover:opacity-80 active:cursor-grabbing"
      >
        <HolderOutlined />
      </span>
    </Tooltip>
  );
}

/* ------------------------------------------------------------------
   SortableList — sửa tại chỗ + kéo thả
   ------------------------------------------------------------------ */
function SortableRow({
  id,
  children,
  actions,
  summary,
  open,
  onToggle,
}: {
  id: string;
  children: ReactNode;
  actions: ReactNode;
  summary: ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`mb-2 rounded-xl border border-black/10 bg-white/60 ${
        isDragging ? "z-10 shadow-lg" : ""
      }`}
    >
      {/* Dòng đầu: kéo thả + tóm tắt + thu gọn/mở rộng + xoá */}
      <div className="flex items-center gap-2 p-2.5">
        <DragHandle attributes={attributes} listeners={listeners} />
        <button
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
          onClick={onToggle}
          title={open ? "Thu gọn" : "Mở rộng để sửa"}
        >
          {open ? <DownOutlined className="text-xs opacity-40" /> : <RightOutlined className="text-xs opacity-40" />}
          <span className="truncate">{summary}</span>
        </button>
        {actions}
      </div>
      {open ? <div className="border-t border-black/5 p-3">{children}</div> : null}
    </div>
  );
}

export function SortableList<T>({
  value,
  onChange,
  renderItem,
  newItem,
  addLabel = "Thêm mục",
  title,
  getSummary,
}: {
  value: T[];
  onChange: (next: T[]) => void;
  renderItem: (item: T, update: (next: T) => void, index: number) => ReactNode;
  newItem: () => T;
  addLabel?: string;
  title?: ReactNode;
  /** Dòng tóm tắt hiển thị khi mục đang thu gọn. */
  getSummary?: (item: T, index: number) => ReactNode;
}) {
  // Mặc định thu gọn hết cho dễ nhìn tổng thể; mở từng mục khi cần sửa.
  const [openRows, setOpenRows] = useState<Set<number>>(new Set());
  const [limit, setLimit] = useState(LIST_PAGE);
  const shown = Math.min(value.length, limit);
  const toggle = (i: number) =>
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const move = (from: number, to: number) => {
    // Đổi thứ tự làm lệch chỉ số -> thu gọn hết cho khỏi mở nhầm mục.
    setOpenRows(new Set());
    onChange(arrayMove(value, from, to));
  };
  const { sensors, ids, onDragEnd } = useDnd(shown, move);

  const replaceAt = (i: number, next: T) => {
    const arr = value.slice();
    arr[i] = next;
    onChange(arr);
  };
  const removeAt = (i: number) => {
    const arr = value.slice();
    arr.splice(i, 1);
    setOpenRows(new Set());
    onChange(arr);
  };

  return (
    <div>
      {title ? <div className="mb-2 font-semibold">{title}</div> : null}

      {value.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có mục nào. Bấm nút bên dưới để thêm."
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {value.slice(0, limit).map((item, i) => (
              <SortableRow
                key={i}
                id={String(i)}
                open={openRows.has(i)}
                onToggle={() => toggle(i)}
                summary={getSummary?.(item, i) ?? `Mục ${i + 1}`}
                actions={
                  <Popconfirm
                    title="Xoá mục này?"
                    description="Mục sẽ biến mất khỏi trang web sau khi bấm Xuất bản."
                    okText="Xoá"
                    cancelText="Huỷ"
                    onConfirm={() => removeAt(i)}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                }
              >
                {renderItem(item, (next) => replaceAt(i, next), i)}
              </SortableRow>
            ))}
          </SortableContext>
        </DndContext>
      )}

      {value.length > limit ? (
        <Button
          block
          className="mt-2 cursor-pointer"
          onClick={() => setLimit((n) => n + LIST_PAGE)}
        >
          Xem thêm ({value.length - limit} mục)
        </Button>
      ) : null}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        block
        className="mt-2"
        onClick={() => {
          // Mục mới mở sẵn để nhập luôn; nhớ nới lô để thấy được mục vừa thêm.
          setLimit((n) => Math.max(n, value.length + 1));
          setOpenRows((prev) => new Set(prev).add(value.length));
          onChange([...value, newItem()]);
        }}
      >
        {addLabel}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------
   ItemListEditor — danh sách gọn -> Drawer sửa chi tiết
   ------------------------------------------------------------------ */
export type ItemRow = {
  /** Dòng tiêu đề của mục trong danh sách. */
  title: string;
  /** Dòng phụ (mô tả ngắn / thông tin phụ). */
  subtitle?: string;
  /** Ảnh đại diện của mục (nếu có). */
  thumb?: string;
  /** Các nhãn nhỏ hiển thị bên phải tiêu đề. */
  tags?: { text: string; color?: string }[];
  /** Mục còn thiếu trường bắt buộc -> đánh dấu cảnh báo. */
  invalid?: boolean;
};

function CompactRow({
  id,
  row,
  onEdit,
  onDelete,
}: {
  id: string;
  row: ItemRow;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`mb-2 flex items-center gap-3 rounded-xl border p-2.5 transition ${
        row.invalid ? "border-red-300 bg-red-50/40" : "border-black/10 bg-white/60"
      } ${isDragging ? "z-10 shadow-lg" : "hover:border-black/25"}`}
    >
      <DragHandle attributes={attributes} listeners={listeners} />

      {row.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.thumb}
          alt=""
          className="h-11 w-11 shrink-0 rounded-lg object-cover"
        />
      ) : null}

      <button
        className="min-w-0 flex-1 cursor-pointer text-left"
        onClick={onEdit}
        title="Bấm để sửa"
      >
        <div className="flex flex-wrap items-center gap-x-2">
          <span className="truncate font-medium">
            {row.title || <span className="opacity-40">(chưa có tiêu đề)</span>}
          </span>
          {row.invalid ? (
            <Tag color="error" icon={<WarningOutlined />} className="m-0">
              Thiếu thông tin
            </Tag>
          ) : null}
          {row.tags?.map((t) => (
            <Tag key={t.text} color={t.color} className="m-0">
              {t.text}
            </Tag>
          ))}
        </div>
        {row.subtitle ? (
          <div className="truncate text-xs opacity-60">{row.subtitle}</div>
        ) : null}
      </button>

      <Button size="small" icon={<EditOutlined />} onClick={onEdit}>
        Sửa
      </Button>
      <Popconfirm
        title="Xoá mục này?"
        description="Mục sẽ biến mất khỏi trang web sau khi bấm Xuất bản."
        okText="Xoá"
        cancelText="Huỷ"
        onConfirm={onDelete}
      >
        <Button size="small" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </div>
  );
}

export function ItemListEditor<T>({
  value,
  onChange,
  newItem,
  getRow,
  renderForm,
  addLabel = "Thêm mục",
  drawerTitle = "Chỉnh sửa",
}: {
  value: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  /** Thông tin hiển thị của 1 dòng trong danh sách. */
  getRow: (item: T, index: number) => ItemRow;
  /** Form chi tiết hiện trong Drawer. */
  renderForm: (item: T, update: (next: T) => void, index: number) => ReactNode;
  addLabel?: string;
  drawerTitle?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [limit, setLimit] = useState(LIST_PAGE);
  const move = (from: number, to: number) => onChange(arrayMove(value, from, to));
  const { sensors, ids, onDragEnd } = useDnd(Math.min(value.length, limit), move);

  const replaceAt = (i: number, next: T) => {
    const arr = value.slice();
    arr[i] = next;
    onChange(arr);
  };
  const removeAt = (i: number) => {
    const arr = value.slice();
    arr.splice(i, 1);
    onChange(arr);
    setOpenIndex(null);
  };
  const add = () => {
    setLimit((n) => Math.max(n, value.length + 1));
    onChange([...value, newItem()]);
    // Mở luôn form của mục vừa thêm — đỡ phải đi tìm.
    setOpenIndex(value.length);
  };

  const editing = openIndex !== null ? value[openIndex] : undefined;

  return (
    <div>
      {value.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có mục nào. Bấm nút bên dưới để thêm."
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {value.slice(0, limit).map((item, i) => (
              <CompactRow
                key={i}
                id={String(i)}
                row={getRow(item, i)}
                onEdit={() => setOpenIndex(i)}
                onDelete={() => removeAt(i)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {value.length > limit ? (
        <Button
          block
          className="mt-2 cursor-pointer"
          onClick={() => setLimit((n) => n + LIST_PAGE)}
        >
          Xem thêm ({value.length - limit} mục)
        </Button>
      ) : null}

      <Button type="dashed" icon={<PlusOutlined />} block className="mt-2" onClick={add}>
        {addLabel}
      </Button>

      <Drawer
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        size={Math.min(760, typeof window === "undefined" ? 760 : window.innerWidth)}
        destroyOnHidden
        title={
          openIndex !== null
            ? `${drawerTitle} — ${getRow(value[openIndex], openIndex).title || `mục ${openIndex + 1}`}`
            : drawerTitle
        }
        extra={
          <Button type="primary" onClick={() => setOpenIndex(null)}>
            Xong
          </Button>
        }
      >
        {editing !== undefined && openIndex !== null
          ? renderForm(editing, (next) => replaceAt(openIndex, next), openIndex)
          : null}
      </Drawer>
    </div>
  );
}
