#!/data/data/com.termux/files/usr/bin/bash
set -e
cd /data/data/org.smartide.code/files/home/projects/TaskoraFrontend/src

echo "→ Creating components/Select directory"
mkdir -p components/Select

echo "→ Writing components/Select/Select.tsx"
cat > components/Select/Select.tsx << 'EOF'
import { useEffect, useRef, useState } from 'react'
import { HiChevronDown, HiCheck } from 'react-icons/hi2'
import './Select.css'

export interface SelectOption<T extends string | number> {
  value: T
  label: string
}

interface SelectProps<T extends string | number> {
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

function Select<T extends string | number>({
  value,
  options,
  onChange,
  disabled,
  className = '',
  ariaLabel,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`select ${className}`} ref={wrapRef}>
      <button
        type="button"
        className={`select-trigger ${open ? 'select-trigger-open' : ''}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className="select-value">{selected?.label ?? ''}</span>
        <HiChevronDown className="select-chevron" />
      </button>

      <div className={`select-panel ${open ? 'select-panel-open' : ''}`} role="listbox">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={option.value === value}
            className={`select-option ${option.value === value ? 'select-option-active' : ''}`}
            onClick={() => {
              onChange(option.value)
              setOpen(false)
            }}
          >
            <span className="select-option-label">{option.label}</span>
            {option.value === value && <HiCheck className="select-check" />}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Select
EOF

echo "→ Writing components/Select/Select.css"
cat > components/Select/Select.css << 'EOF'
.select {
  position: relative;
}

.select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 11px 12px;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-border-subtle);
  background: var(--color-surface-container-low);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--color-on-surface);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.select-trigger:hover {
  border-color: #cbd5e1;
}

.select-trigger-open {
  background: #ffffff;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 83, 212, 0.12);
}

.select-trigger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.select-chevron {
  font-size: 16px;
  color: var(--color-on-surface-variant);
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.select-trigger-open .select-chevron {
  transform: rotate(180deg);
}

.select-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 100%;
  width: max-content;
  background: #ffffff;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
  padding: 6px;
  z-index: 20;
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
  pointer-events: none;
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top left;
}

.select-panel-open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.select-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--radius);
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-display);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-on-surface);
  white-space: nowrap;
  transition: background 0.15s ease;
}

.select-option:hover {
  background: var(--color-surface-container-low);
}

.select-option-active {
  background: var(--color-brand-blue-tint);
  color: var(--color-primary);
}

.select-option-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-check {
  font-size: 15px;
  color: var(--color-primary);
  flex-shrink: 0;
}
EOF

echo "→ Patching pages/CreateTask/CreateTaskPage.tsx"
python3 << 'PYEOF'
path = "pages/CreateTask/CreateTaskPage.tsx"
with open(path, "r") as f:
    content = f.read()

changed = False

# 1. Import the new Select component
old_import = "import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'"
new_import = "import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'\nimport Select from '../../components/Select/Select'"
if old_import in content and "components/Select/Select'" not in content:
    content = content.replace(old_import, new_import, 1)
    changed = True

# 2. CriterionDraft.id should be a stable string (used directly as payload id)
old_iface = '''interface CriterionDraft {
  id: number
  question: string
  type: 'RATING' | 'TEXT'
  scale: number
}'''
new_iface = '''interface CriterionDraft {
  id: string
  question: string
  type: 'RATING' | 'TEXT'
  scale: number
}'''
if old_iface in content:
    content = content.replace(old_iface, new_iface, 1)
    changed = True

# 3. criteria initial state + id ref -> generate string ids
old_state = '''  const [criteria, setCriteria] = useState<CriterionDraft[]>([
    { id: 0, question: '', type: 'RATING', scale: 5 },
  ])
  const criteriaIdRef = useRef(1)'''
new_state = '''  const [criteria, setCriteria] = useState<CriterionDraft[]>([
    { id: 'criterion-1', question: '', type: 'RATING', scale: 5 },
  ])
  const criteriaIdRef = useRef(2)'''
if old_state in content:
    content = content.replace(old_state, new_state, 1)
    changed = True

# 4. Validation: require at least one non-empty evaluation question before submit
old_validation_anchor = '''    if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) {
      setFormError('Expiry must be in the future.')
      return
    }'''
new_validation = '''    if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) {
      setFormError('Expiry must be in the future.')
      return
    }
    const cleanCriteria = criteria.filter((c) => c.question.trim())
    if (cleanCriteria.length === 0) {
      setFormError('Add at least one evaluation question.')
      return
    }'''
if old_validation_anchor in content:
    content = content.replace(old_validation_anchor, new_validation, 1)
    changed = True

# 5. Payload builder: use cleanCriteria (already validated) and include id on each item
old_payload_criteria = '''        evaluationCriteria: criteria
          .filter((c) => c.question.trim())
          .map((c) =>
            c.type === 'RATING'
              ? { question: c.question.trim(), type: 'RATING' as const, scale: c.scale }
              : { question: c.question.trim(), type: 'TEXT' as const }
          ),'''
new_payload_criteria = '''        evaluationCriteria: cleanCriteria.map((c) =>
          c.type === 'RATING'
            ? { id: c.id, question: c.question.trim(), type: 'RATING' as const, scale: c.scale }
            : { id: c.id, question: c.question.trim(), type: 'TEXT' as const }
        ),'''
if old_payload_criteria in content:
    content = content.replace(old_payload_criteria, new_payload_criteria, 1)
    changed = True

# 6. Add-question button: generate string ids instead of numeric
old_add_criterion = '''                  onClick={() =>
                    setCriteria((prev) => [
                      ...prev,
                      { id: criteriaIdRef.current++, question: '', type: 'RATING', scale: 5 },
                    ])
                  }'''
new_add_criterion = '''                  onClick={() =>
                    setCriteria((prev) => [
                      ...prev,
                      { id: `criterion-${criteriaIdRef.current++}`, question: '', type: 'RATING', scale: 5 },
                    ])
                  }'''
if old_add_criterion in content:
    content = content.replace(old_add_criterion, new_add_criterion, 1)
    changed = True

# 7. Label: "Evaluation questions (optional)" -> "Evaluation questions"
old_label = '<span className="ct-field-label">Evaluation questions (optional)</span>'
new_label = '<span className="ct-field-label">Evaluation questions</span>'
if old_label in content:
    content = content.replace(old_label, new_label, 1)
    changed = True

# 8. Replace native <select> elements with the custom Select component
old_selects = '''                      <select
                        className="ct-input ct-select ct-select-type"
                        value={criterion.type}
                        onChange={(e) =>
                          updateCriterion(i, {
                            type: e.target.value as 'RATING' | 'TEXT',
                          })
                        }
                      >
                        <option value="RATING">Rating</option>
                        <option value="TEXT">Text</option>
                      </select>
                      {criterion.type === 'RATING' && (
                        <select
                          className="ct-input ct-select ct-select-scale"
                          value={criterion.scale}
                          onChange={(e) => updateCriterion(i, { scale: Number(e.target.value) })}
                        >
                          <option value={5}>1–5</option>
                          <option value={10}>1–10</option>
                          <option value={3}>1–3</option>
                        </select>
                      )}'''
new_selects = '''                      <Select
                        className="ct-select ct-select-type"
                        value={criterion.type}
                        ariaLabel="Question type"
                        onChange={(next) => updateCriterion(i, { type: next })}
                        options={[
                          { value: 'RATING', label: 'Rating' },
                          { value: 'TEXT', label: 'Text' },
                        ]}
                      />
                      {criterion.type === 'RATING' && (
                        <Select
                          className="ct-select ct-select-scale"
                          value={criterion.scale}
                          ariaLabel="Rating scale"
                          onChange={(next) => updateCriterion(i, { scale: next })}
                          options={[
                            { value: 5, label: '1–5' },
                            { value: 10, label: '1–10' },
                            { value: 3, label: '1–3' },
                          ]}
                        />
                      )}'''
if old_selects in content:
    content = content.replace(old_selects, new_selects, 1)
    changed = True

if changed:
    with open(path, "w") as f:
        f.write(content)
    print("   ✓ CreateTaskPage.tsx patched")
else:
    print("   ⚠ No matching patterns found — file may already be patched, or has diverged. Check manually.")
PYEOF

echo "→ Patching pages/CreateTask/CreateTaskPage.css (dropdown spacing + remove select-specific overrides)"
python3 << 'PYEOF'
path = "pages/CreateTask/CreateTaskPage.css"
with open(path, "r") as f:
    content = f.read()

changed = False

# Give the criterion row's flex children breathing room, and let the custom
# Select components size themselves instead of inheriting .ct-input padding.
old_block = '''/* ===== Criterion row ===== */
.ct-row-criterion {
  flex-wrap: wrap;
  align-items: center;
}

.ct-row-criterion .ct-input {
  flex: 1 1 200px;
  min-width: 0;
}

.ct-row-criterion .ct-select {
  flex: 0 1 auto;
  width: auto;
  padding: 11px 12px;
}

.ct-select-type {
  max-width: 96px;
}

.ct-select-scale {
  max-width: 72px;
}

.ct-row-criterion .ct-remove {
  margin-left: auto;
}'''

new_block = '''/* ===== Criterion row ===== */
.ct-row-criterion {
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.ct-row-criterion .ct-input {
  flex: 1 1 200px;
  min-width: 0;
}

.ct-row-criterion .select {
  flex: 0 1 auto;
}

.ct-select-type {
  min-width: 104px;
}

.ct-select-scale {
  min-width: 84px;
  margin-left: 10px;
}

.ct-row-criterion .ct-remove {
  margin-left: auto;
}'''

if old_block in content:
    content = content.replace(old_block, new_block, 1)
    changed = True

if changed:
    with open(path, "w") as f:
        f.write(content)
    print("   ✓ CreateTaskPage.css patched")
else:
    print("   ⚠ CSS block not found as expected — check manually")
PYEOF

echo ""
echo "✅ Evaluation criteria fix + custom dropdown complete."
echo "   - components/Select/Select.tsx (new, reusable custom dropdown)"
echo "   - components/Select/Select.css (new)"
echo "   - pages/CreateTask/CreateTaskPage.tsx:"
echo "       • 'Evaluation questions' label no longer says (optional)"
echo "       • submit now validates at least 1 non-empty question"
echo "       • each criterion now sends id, question, and type (fixes backend 400)"
echo "       • Rating/Scale dropdowns now use the custom Select component"
echo "   - pages/CreateTask/CreateTaskPage.css: spacing added between the two dropdowns"
echo ""
echo "Review the diffs, then run your dev server to verify."
