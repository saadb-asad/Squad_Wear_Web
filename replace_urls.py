import re
import glob

files = [
    'frontend/src/pages/Checkout/CheckoutPage.tsx',
    'frontend/src/pages/Portal/PortalPage.tsx',
    'frontend/src/pages/Portal/LoginPage.tsx',
    'frontend/src/pages/Portal/SignupPage.tsx',
    'frontend/src/pages/Admin/AdminDashboard.tsx',
    'frontend/src/contexts/AuthContext.tsx'
]

# Create config.ts
with open('frontend/src/config.ts', 'w') as f:
    f.write("export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';\n")

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
        
    # How many directories up to reach src?
    # e.g. frontend/src/pages/Checkout/CheckoutPage.tsx -> src is 2 levels up
    parts = filepath.split('/')
    src_idx = parts.index('src')
    depth = len(parts) - src_idx - 2
    rel_path = '../' * depth + 'config'
    if depth == 0:
        rel_path = './config'
        
    # Replace the URLs using a regex
    # Match: 'http://localhost:8000/api... ' or "http://localhost..." or `http://localhost...`
    # and replace with `${API_BASE_URL}/api...`
    
    def replacer(match):
        quote = match.group(1)
        url_rest = match.group(2)
        if quote in ["'", '"']:
            return f"`${{API_BASE_URL}}{url_rest}`"
        else:
            return f"${{API_BASE_URL}}{url_rest}" # if already backtick, just inject the variable
            
    # Regex explanation: (['"`])http://localhost:8000([^'"`]*)\1
    new_content = re.sub(r"(['\"`])http://localhost:8000([^'\"`]*)\1", replacer, content)
    
    # Add import statement if we made replacements
    if new_content != content:
        import_stmt = f"import {{ API_BASE_URL }} from '{rel_path}';\n"
        # add import after the last import statement or at the top
        # finding last import
        imports = list(re.finditer(r"^import .*$", new_content, re.MULTILINE))
        if imports:
            last_import = imports[-1]
            pos = last_import.end()
            new_content = new_content[:pos] + "\n" + import_stmt + new_content[pos:]
        else:
            new_content = import_stmt + new_content
            
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

