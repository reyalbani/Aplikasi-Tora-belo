with open('resources/js/pages/layanan/ppid.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_part = """                ) : (


                        {/* Header Info (Information View) */}"""

good_part = """                ) : (
                    <>
                        {/* Header Info (Information View) */}"""

content = content.replace(bad_part, good_part)

end_part = """                            </form>
                        </div>
                    </div>
                )}"""

good_end_part = """                            </form>
                        </div>
                    </div>
                )}
                    </>"""

content = content.replace(end_part, good_end_part)

with open('resources/js/pages/layanan/ppid.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
