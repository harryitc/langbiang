"use client";

// Màn hình "Gửi email" — Ban tổ chức tự chọn người nhận rồi gửi một lá thư
// soạn sẵn từ mục "Mẫu email".
//
// Luồng cố ý làm chậm lại để không ai lỡ tay:
//   chọn người nhận -> chọn mẫu -> XEM TRƯỚC (máy chủ giải danh sách thật)
//   -> gõ đúng số người nhận để xác nhận -> mới bấm gửi được.
//
// Trình duyệt KHÔNG tự quyết định thư đi tới đâu: với hai kiểu đầu, nó chỉ báo
// lên máy chủ "form nào" và "những dòng nào đã tích"; máy chủ tự tra địa chỉ.
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Input,
  Modal,
  Radio,
  Result,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { MailOutlined, SendOutlined } from "@ant-design/icons";
import {
  bienDangDung,
  GIOI_HAN_TU_NHAP,
  laEmailHopLe,
  tachEmail,
  type KetQuaChuanBi,
  type KieuNguoiNhan,
  type NguoiNhan,
  type NhatKyGuiEmail,
  type YeuCauGui,
} from "@/lib/content/email-send-types";
import {
  chuanBiGuiEmailAction,
  guiEmailHangLoatAction,
} from "@/lib/content/email-send-actions";

type FormItem = { id: string; name: string };
type MauEmail = {
  id: string;
  name: string;
  note: string;
  subject: string;
  bodyHtml: string;
};
type NguoiDaDangKy = { at: string; ten: string; email: string };

/**
 * Khoá tạm trong bộ nhớ phiên của trình duyệt, dùng để chuyển các dòng đã tích
 * từ trang "Đăng ký nhận được" sang đây (danh sách có thể rất dài nên không
 * nhét vừa vào địa chỉ trang).
 */
export const KHOA_CHON_TAM = "gui-email:da-chon";

/** Chữ hiển thị của từng kiểu người nhận, dùng chung cho cả bảng nhật ký. */
const NHAN_KIEU: Record<KieuNguoiNhan, string> = {
  chon: "Người đăng ký đã chọn",
  "tat-ca": "Tất cả người đăng ký của form",
  "tu-nhap": "Địa chỉ tự nhập",
};

export default function GuiEmailView({
  forms,
  currentFormId,
  currentFormName,
  nguoiDaDangKy,
  templates,
  nhatKy,
}: {
  forms: FormItem[];
  currentFormId: string;
  currentFormName: string;
  nguoiDaDangKy: NguoiDaDangKy[];
  templates: MauEmail[];
  nhatKy: NhatKyGuiEmail[];
}) {
  const router = useRouter();
  const { message } = App.useApp();

  const [kieu, setKieu] = useState<KieuNguoiNhan>("chon");
  const [daTich, setDaTich] = useState<string[]>([]);
  const [emailTuNhap, setEmailTuNhap] = useState("");
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");

  const [dangChuanBi, setDangChuanBi] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [xemTruoc, setXemTruoc] = useState<
    Extract<KetQuaChuanBi, { ok: true }> | null
  >(null);
  const [goXacNhan, setGoXacNhan] = useState("");

  // Nhận các dòng đã tích từ trang "Đăng ký nhận được" (nếu vừa bấm sang).
  useEffect(() => {
    const raw = sessionStorage.getItem(KHOA_CHON_TAM);
    if (!raw) return;
    sessionStorage.removeItem(KHOA_CHON_TAM);
    try {
      const { formId, moc } = JSON.parse(raw) as {
        formId: string;
        moc: string[];
      };
      if (formId === currentFormId && Array.isArray(moc)) {
        setKieu("chon");
        setDaTich(moc);
      }
    } catch {
      // Dữ liệu tạm hỏng thì bỏ qua, admin tự tích lại.
    }
  }, [currentFormId]);

  const mauDangChon = templates.find((t) => t.id === templateId);

  // Số người nhận ƯỚC TÍNH để hiện ngay trên màn hình. Con số CHỐT vẫn do máy
  // chủ trả về ở bước xem trước.
  const emailHopLeTuNhap = useMemo(
    () => tachEmail(emailTuNhap).filter(laEmailHopLe),
    [emailTuNhap]
  );
  const emailSaiTuNhap = useMemo(
    () => tachEmail(emailTuNhap).filter((e) => !laEmailHopLe(e)),
    [emailTuNhap]
  );
  const coEmail = useMemo(
    () => nguoiDaDangKy.filter((n) => n.email),
    [nguoiDaDangKy]
  );

  const soUocTinh =
    kieu === "chon"
      ? nguoiDaDangKy.filter((n) => daTich.includes(n.at) && n.email).length
      : kieu === "tat-ca"
        ? coEmail.length
        : Math.min(emailHopLeTuNhap.length, GIOI_HAN_TU_NHAP);

  // Mẫu có dùng biến riêng của người đăng ký thì không hợp để gửi tới địa chỉ
  // tự nhập — báo trước ngay khi admin còn đang chọn.
  const bienRieng = mauDangChon
    ? bienDangDung(mauDangChon.subject, mauDangChon.bodyHtml).filter((b) =>
      ["ho_ten", "vai_tro", "thoi_diem", "bang_thong_tin"].includes(b)
    )
    : [];

  const yeuCau: YeuCauGui = {
    templateId,
    kieu,
    formId: currentFormId,
    mocThoiGian: kieu === "chon" ? daTich : undefined,
    emailTuNhap: kieu === "tu-nhap" ? emailTuNhap : undefined,
  };

  const moXemTruoc = async () => {
    if (!templateId) {
      message.warning("Bạn chọn mẫu email trước đã nhé.");
      return;
    }
    setDangChuanBi(true);
    try {
      const kq = await chuanBiGuiEmailAction(yeuCau);
      if (!kq.ok) {
        message.error(kq.error);
        return;
      }
      setGoXacNhan("");
      setXemTruoc(kq);
    } catch {
      message.error(
        "Không kết nối được với máy chủ. Bạn kiểm tra mạng rồi thử lại nhé."
      );
    } finally {
      setDangChuanBi(false);
    }
  };

  const gui = async () => {
    if (dangGui) return; // chặn bấm hai lần
    setDangGui(true);
    try {
      const kq = await guiEmailHangLoatAction(yeuCau);
      if (kq.error) {
        message.error(kq.error);
        return;
      }
      if (kq.soLoi > 0) {
        message.warning(
          `Gửi xong nhưng KHÔNG trọn vẹn: ${kq.soThanhCong} thư gửi được, ${kq.soLoi} thư bị lỗi. ` +
          "Bạn xem lại nhật ký bên dưới rồi gửi lại cho những người còn thiếu nhé."
        );
      } else {
        message.success(`Đã gửi xong ${kq.soThanhCong} lá thư.`);
      }
      setXemTruoc(null);
      setDaTich([]);
      router.refresh();
    } catch {
      message.error(
        "Không kết nối được với máy chủ nên chưa rõ thư đã gửi hay chưa. " +
        "Bạn xem nhật ký bên dưới trước khi gửi lại nhé."
      );
    } finally {
      setDangGui(false);
    }
  };

  if (templates.length === 0) {
    return (
      <Result
        status="info"
        title="Chưa có mẫu email nào để gửi"
        subTitle="Bạn soạn ít nhất một mẫu thư ở mục “Mẫu email”, rồi quay lại đây gửi."
        extra={
          <Link href="/admin/mau-email">
            <Button type="primary" className="cursor-pointer">
              Sang mục Mẫu email
            </Button>
          </Link>
        }
      />
    );
  }

  const soNguoiNhanThat = xemTruoc?.nguoiNhan.length ?? 0;
  const xacNhanDung = goXacNhan.trim() === String(soNguoiNhanThat);

  return (
    <div>
      <Card
        title={
          <span className="flex items-center gap-2">
            <MailOutlined /> Gửi email
          </span>
        }
        styles={{ body: { paddingTop: 12 } }}
      >
        <p className="mb-4 text-sm opacity-60">
          Chọn người nhận, chọn lá thư (soạn sẵn ở mục{" "}
          <Link href="/admin/mau-email" className="cursor-pointer underline">
            Mẫu email
          </Link>
          ), xem trước rồi mới gửi. Thư <strong>gửi đi là không lấy lại được</strong>,
          nên bạn cứ xem kỹ ở bước xem trước.
        </p>

        {/* ---------------- 1. Người nhận ---------------- */}
        <div className="mb-2 text-sm font-semibold">1. Gửi cho ai</div>
        <Radio.Group
          className="mb-3"
          value={kieu}
          onChange={(e) => setKieu(e.target.value)}
          options={[
            { value: "chon", label: NHAN_KIEU.chon },
            { value: "tat-ca", label: NHAN_KIEU["tat-ca"] },
            { value: "tu-nhap", label: NHAN_KIEU["tu-nhap"] },
          ]}
        />

        {kieu !== "tu-nhap" && (
          <Space orientation="horizontal" size="small" wrap className="mb-3">
            <span className="text-sm">Danh sách đăng ký của form:</span>
            <Select<string>
              value={currentFormId || undefined}
              style={{ minWidth: 260 }}
              className="cursor-pointer"
              placeholder="Chọn form"
              options={forms.map((f) => ({ value: f.id, label: f.name }))}
              onChange={(id) => {
                setDaTich([]);
                router.push(`/admin/gui-email?form=${id}`);
              }}
            />
          </Space>
        )}

        {kieu === "chon" &&
          (nguoiDaDangKy.length === 0 ? (
            <Empty
              className="mb-3"
              description={`Chưa có ai đăng ký form “${currentFormName}”.`}
            />
          ) : (
            <Table<NguoiDaDangKy>
              className="mb-3"
              size="small"
              rowKey="at"
              dataSource={nguoiDaDangKy}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              rowSelection={{
                selectedRowKeys: daTich,
                onChange: (keys) => setDaTich(keys as string[]),
                // Không có email thì không gửi được -> không cho tích.
                getCheckboxProps: (r) => ({ disabled: !r.email }),
              }}
              columns={[
                {
                  title: "Thời điểm đăng ký",
                  dataIndex: "at",
                  width: 190,
                  render: (at: string) => (
                    <Tag variant="filled" color="green">
                      {dinhDangGio(at)}
                    </Tag>
                  ),
                },
                {
                  title: "Họ tên",
                  dataIndex: "ten",
                  render: (v: string) =>
                    v || <span className="opacity-40">—</span>,
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  render: (v: string) =>
                    v || (
                      <span className="opacity-40">
                        (không có email — không gửi được)
                      </span>
                    ),
                },
              ]}
            />
          ))}

        {kieu === "tat-ca" && (
          <Alert
            className="mb-3"
            type="warning"
            showIcon
            title={`Sẽ gửi cho TẤT CẢ ${coEmail.length} người đã đăng ký form “${currentFormName}” và có email.`}
            description="Mỗi người nhận một lá thư riêng, điền đúng tên và thông tin họ đã khai."
          />
        )}

        {kieu === "tu-nhap" && (
          <div className="mb-3">
            <Input.TextArea
              rows={5}
              value={emailTuNhap}
              placeholder={
                "Mỗi địa chỉ một dòng, hoặc cách nhau bằng dấu phẩy:\nnhataitro@congty.com, doitac@truong.edu.vn"
              }
              onChange={(e) => setEmailTuNhap(e.target.value)}
            />
            <div className="mt-1 text-xs opacity-60">
              Dùng cho nhà tài trợ, đối tác — những người không điền form đăng
              ký. Tối đa {GIOI_HAN_TU_NHAP} địa chỉ mỗi lượt gửi.
            </div>
            {emailSaiTuNhap.length > 0 && (
              <Alert
                className="mt-2"
                type="error"
                showIcon
                title={`${emailSaiTuNhap.length} địa chỉ không đúng dạng email và sẽ bị bỏ qua.`}
                description={emailSaiTuNhap.slice(0, 10).join(", ")}
              />
            )}
          </div>
        )}

        {/* ---------------- 2. Lá thư ---------------- */}
        <div className="mb-2 text-sm font-semibold">2. Gửi lá thư nào</div>
        <Select<string>
          value={templateId || undefined}
          style={{ minWidth: 320 }}
          className="mb-2 cursor-pointer"
          placeholder="Chọn mẫu email"
          options={templates.map((t) => ({ value: t.id, label: t.name }))}
          onChange={setTemplateId}
        />
        {mauDangChon?.note && (
          <div className="mb-2 text-xs opacity-60">{mauDangChon.note}</div>
        )}

        {kieu === "tu-nhap" && bienRieng.length > 0 && (
          <Alert
            className="mb-3"
            type="warning"
            showIcon
            title="Lá thư này có chỗ dành riêng cho người đăng ký, gửi tới địa chỉ tự nhập sẽ bị trống."
            description={
              <>
                Mẫu đang dùng {bienRieng.map((b) => `{{${b}}}`).join(", ")} — là
                họ tên, thời điểm đăng ký, bảng thông tin đã điền. Người nhận tự
                nhập không có những thông tin đó nên chỗ ấy sẽ trắng. Bạn nên{" "}
                <Link
                  href="/admin/mau-email"
                  className="cursor-pointer underline"
                >
                  soạn một mẫu riêng
                </Link>{" "}
                cho nhà tài trợ, đối tác.
              </>
            }
          />
        )}

        {/* ---------------- 3. Xem trước ---------------- */}
        <div className="mt-4">
          <Button
            type="primary"
            icon={<SendOutlined />}
            className="cursor-pointer"
            loading={dangChuanBi}
            disabled={soUocTinh === 0 || !templateId}
            onClick={moXemTruoc}
          >
            {soUocTinh === 0
              ? "Chưa có người nhận nào"
              : `Xem trước rồi gửi cho ${soUocTinh} người`}
          </Button>
        </div>
      </Card>

      {/* ---------------- Nhật ký ---------------- */}
      <Card
        title="Đã gửi những gì"
        className="mt-4"
        styles={{ body: { paddingTop: 12 } }}
      >
        <p className="mb-3 text-sm opacity-60">
          Mỗi dòng là một lượt bấm gửi, mới nhất nằm trên cùng. Xem ở đây để
          tránh gửi trùng một lá thư hai lần. Hệ thống giữ lại 200 lượt gần nhất.
        </p>
        {nhatKy.length === 0 ? (
          <Empty description="Chưa gửi lượt email nào." />
        ) : (
          <Table<NhatKyGuiEmail>
            size="small"
            rowKey={(r, i) => `${r.at}-${i}`}
            dataSource={nhatKy}
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            columns={[
              {
                title: "Lúc gửi",
                dataIndex: "at",
                width: 190,
                render: (at: string) => dinhDangGio(at),
              },
              { title: "Lá thư", dataIndex: "tenMau" },
              {
                title: "Gửi cho ai",
                dataIndex: "kieu",
                render: (k: KieuNguoiNhan, r) =>
                  r.tenForm ? `${NHAN_KIEU[k]} — ${r.tenForm}` : NHAN_KIEU[k],
              },
              { title: "Số người nhận", dataIndex: "soNguoiNhan", width: 130 },
              {
                title: "Kết quả",
                key: "ketQua",
                width: 200,
                render: (_: unknown, r) =>
                  r.soLoi === 0 ? (
                    <Tag variant="filled" color="green">
                      Gửi được cả {r.soThanhCong}
                    </Tag>
                  ) : (
                    <Tag variant="filled" color="red">
                      {r.soThanhCong} gửi được, {r.soLoi} lỗi
                    </Tag>
                  ),
              },
            ]}
          />
        )}
      </Card>

      {/* ---------------- Cửa sổ xem trước + xác nhận ---------------- */}
      <Modal
        open={xemTruoc !== null}
        onCancel={() => !dangGui && setXemTruoc(null)}
        width={900}
        destroyOnHidden
        style={{ top: 24, paddingBottom: 24 }}
        title="Xem lại trước khi gửi"
        footer={
          <Space orientation="horizontal">
            <Button
              className="cursor-pointer"
              disabled={dangGui}
              onClick={() => setXemTruoc(null)}
            >
              Quay lại sửa
            </Button>
            <Button
              type="primary"
              danger
              icon={<SendOutlined />}
              className="cursor-pointer"
              loading={dangGui}
              disabled={!xacNhanDung}
              onClick={gui}
            >
              Gửi {soNguoiNhanThat} lá thư ngay
            </Button>
          </Space>
        }
      >
        {xemTruoc && (
          <div>
            <Alert
              type="error"
              showIcon
              className="mb-3"
              title={`Sắp gửi ${soNguoiNhanThat} lá thư. Thư đã gửi đi thì KHÔNG thu hồi được.`}
              description="Bạn xem kỹ danh sách người nhận và lá thư bên dưới. Nếu có chỗ nào chưa đúng, bấm “Quay lại sửa”."
            />

            {xemTruoc.canhBao.map((c, i) => (
              <Alert
                key={i}
                type="warning"
                showIcon
                className="mb-2"
                title={c}
              />
            ))}

            <div className="mt-3 mb-2 text-sm font-semibold">
              Danh sách {soNguoiNhanThat} người nhận
            </div>
            <Table<NguoiNhan>
              size="small"
              rowKey="email"
              dataSource={xemTruoc.nguoiNhan}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              columns={[
                {
                  title: "Họ tên",
                  dataIndex: "ten",
                  render: (v: string) =>
                    v || <span className="opacity-40">(không rõ tên)</span>,
                },
                { title: "Email", dataIndex: "email" },
              ]}
            />

            <div className="mt-4 mb-2 text-sm font-semibold">
              Lá thư mà{" "}
              <em>{xemTruoc.nguoiNhan[0]?.ten || xemTruoc.nguoiNhan[0]?.email}</em>{" "}
              sẽ nhận được
            </div>
            {xemTruoc.xemTruoc ? (
              <>
                <Input
                  readOnly
                  className="mb-2"
                  addonBefore="Tiêu đề"
                  value={xemTruoc.xemTruoc.subject}
                />
                <iframe
                  title="Xem trước lá thư sẽ gửi"
                  srcDoc={xemTruoc.xemTruoc.html}
                  sandbox=""
                  className="h-[420px] w-full rounded-xl border border-black/10 bg-white"
                />
                <div className="mt-1 text-xs opacity-60">
                  Những người khác nhận thư cùng nội dung này, chỉ khác phần
                  thông tin riêng của từng người.
                </div>
              </>
            ) : (
              <Empty description="Không dựng được thư xem trước." />
            )}

            <div className="mt-4 mb-2 text-sm font-semibold">
              Gõ số <strong>{soNguoiNhanThat}</strong> vào ô dưới để xác nhận
            </div>
            <Input
              value={goXacNhan}
              status={goXacNhan && !xacNhanDung ? "error" : undefined}
              placeholder={String(soNguoiNhanThat)}
              style={{ maxWidth: 220 }}
              onChange={(e) => setGoXacNhan(e.target.value)}
            />
            <div className="mt-1 text-xs opacity-60">
              Bước này để chắc chắn bạn đã thấy đúng số người sắp nhận thư.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/** Giờ Việt Nam, dễ đọc. */
function dinhDangGio(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}
