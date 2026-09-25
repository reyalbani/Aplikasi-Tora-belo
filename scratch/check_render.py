with open("resources/js/pages/layanan/pendidikan-pemilih.tsx", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("{showForm ? (")
if idx != -1:
    print(text[idx:idx+8000])
