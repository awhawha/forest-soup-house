import { prisma } from "@/lib/db";
import type { AdminEntity, AdminField } from "@/lib/admin/registry";
import { saveEntity } from "@/lib/admin/actions";

const inputClass =
  "w-full rounded-xl border border-border-card bg-white px-3 py-2 text-sm text-wood focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss disabled:bg-paper-section disabled:text-wood-muted";

async function selectOptions(
  field: AdminField,
): Promise<{ value: string; label: string }[]> {
  if (field.options) return field.options;
  if (field.optionsFrom) {
    const { model, value, label } = field.optionsFrom;
    const delegate = (
      prisma as unknown as Record<
        string,
        { findMany: (args: object) => Promise<Record<string, string>[]> }
      >
    )[model];
    const rows = await delegate.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map((r) => ({
      value: r[value],
      label: `${r[label]}（${r[value]}）`,
    }));
  }
  return [];
}

function defaultValueFor(
  field: AdminField,
  record: Record<string, unknown> | null,
): string {
  const value = record?.[field.name];
  if (value === null || value === undefined) return "";
  switch (field.type) {
    case "lines":
      return Array.isArray(value) ? value.join("\n") : "";
    case "json":
      return JSON.stringify(value, null, 2);
    default:
      return String(value);
  }
}

async function FieldInput({
  field,
  record,
  isEdit,
}: {
  field: AdminField;
  record: Record<string, unknown> | null;
  isEdit: boolean;
}) {
  const readOnly = isEdit && field.readOnlyOnEdit;
  const defaultValue = defaultValueFor(field, record);

  if (field.type === "select") {
    const options = await selectOptions(field);
    return (
      <select
        id={field.name}
        name={field.name}
        defaultValue={defaultValue}
        required={field.required}
        disabled={readOnly}
        className={inputClass}
      >
        {!field.required ? <option value="">—（不設定）</option> : null}
        {field.required && defaultValue === "" ? (
          <option value="" disabled>
            請選擇⋯
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea" || field.type === "lines" || field.type === "json") {
    return (
      <textarea
        id={field.name}
        name={field.name}
        defaultValue={defaultValue}
        required={field.required}
        readOnly={readOnly}
        rows={field.rows ?? 4}
        className={`${inputClass} font-mono leading-relaxed`}
      />
    );
  }

  return (
    <input
      id={field.name}
      name={field.name}
      type={field.type === "number" ? "number" : "text"}
      defaultValue={defaultValue}
      required={field.required}
      readOnly={readOnly}
      disabled={field.type !== "number" ? readOnly : undefined}
      className={inputClass}
    />
  );
}

interface EntityFormProps {
  entity: AdminEntity;
  /** 編輯中的資料；新增時為 null */
  record: Record<string, unknown> | null;
  /** 編輯中的 id；新增時為 null */
  id: string | null;
}

export function EntityForm({ entity, record, id }: EntityFormProps) {
  const action = saveEntity.bind(null, entity.slug, id);
  const isEdit = id !== null;

  return (
    <form action={action} className="space-y-5">
      {entity.fields.map((field) => {
        if (isEdit && field.readOnlyOnEdit) {
          // 主鍵：顯示但不可改
          return (
            <div key={field.name} className="space-y-1.5">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-wood"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                value={defaultValueFor(field, record)}
                disabled
                className={inputClass}
              />
              <p className="text-xs text-wood-muted">主鍵欄位，建立後不可更改</p>
            </div>
          );
        }
        return (
          <div key={field.name} className="space-y-1.5">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-wood"
            >
              {field.label}
              {field.required ? <span className="text-red-600"> *</span> : null}
            </label>
            <FieldInput field={field} record={record} isEdit={isEdit} />
            {field.help ? (
              <p className="text-xs leading-relaxed text-wood-muted">{field.help}</p>
            ) : null}
          </div>
        );
      })}

      <div className="flex items-center gap-3 border-t border-border-paper pt-5">
        <button
          type="submit"
          className="rounded-xl bg-moss px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-moss-hover"
        >
          {isEdit ? "儲存變更" : "建立"}
        </button>
        <a
          href={`/admin/${entity.slug}`}
          className="rounded-xl border border-border-card px-6 py-2.5 text-sm text-wood transition-colors hover:bg-paper-section"
        >
          取消
        </a>
      </div>
    </form>
  );
}
