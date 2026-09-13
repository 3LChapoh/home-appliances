replacements = {
    'client/src/components/admin/AdminAuthGate.jsx': [
        (
            '<input className="field" type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />',
            '<PasswordField value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />',
        ),
        (
            '<input className="field" type="password" required value={form.securityKey} onChange={(e) => setForm((f) => ({ ...f, securityKey: e.target.value }))} />',
            '<PasswordField value={form.securityKey} onChange={(e) => setForm((f) => ({ ...f, securityKey: e.target.value }))} required />',
        ),
    ],
    'client/src/components/vendor/VendorAuthGate.jsx': [
        (
            '<input className="field" type="password" required minLength={6} value={form.password} onChange={(e) => update(\'password\', e.target.value)} />',
            '<PasswordField value={form.password} onChange={(e) => update(\'password\', e.target.value)} required />',
        ),
    ],
    'client/src/components/AccountDrawer.jsx': [
        (
            '<input className="field" type="password" required minLength={6} value={form.password} onChange={(e) => update(\'password\', e.target.value)} />',
            '<PasswordField value={form.password} onChange={(e) => update(\'password\', e.target.value)} required />',
        ),
    ],
}

for path, pairs in replacements.items():
    with open(path) as f:
        content = f.read()

    for old, new in pairs:
        if old not in content:
            print(f'WARNING: pattern not found in {path}, skipped')
        else:
            content = content.replace(old, new)

    # insert import after the last existing import line
    lines = content.split('\n')
    last_import_idx = max(i for i, l in enumerate(lines) if l.startswith('import '))
    rel = '../PasswordField' if '/admin/' in path or '/vendor/' in path else './PasswordField'
    import_line = f"import PasswordField from '{rel}'"
    if import_line not in content:
        lines.insert(last_import_idx + 1, import_line)
    content = '\n'.join(lines)

    with open(path, 'w') as f:
        f.write(content)

    print(f'Updated {path}')

print('Done')
