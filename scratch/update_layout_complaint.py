import re

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add complaintContent to props interface
content = content.replace("complaintChannels?: ComplaintChannel[];", "complaintChannels?: ComplaintChannel[];\n    complaintContent?: ReactNode;")

# Add complaintContent to destructuring
content = content.replace("complaintChannels = [],", "complaintChannels = [],\n    complaintContent,")

# Render complaintContent inside sec-pengaduan
replacement = """<div className="p-6">
                    {complaintContent ? (
                        complaintContent
                    ) : (
                        <>
                            <p className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed mb-6">
                                {complaintText}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {channels.map((ch, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50/30">
                                        {ch.type === 'email' && <Mail className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        {ch.type === 'phone' && <PhoneCall className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        {ch.type === 'location' && <MapPin className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        {ch.type === 'sipadu' && <ExternalLink className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        {ch.type === 'custom' && <ExternalLink className="w-4 h-4 text-neutral-500 mt-0.5" />}
                                        
                                        <div className="flex-1">
                                            {ch.link ? (
                                                <a href={ch.link} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-kpu-primary hover:underline">
                                                    {ch.label}
                                                </a>
                                            ) : (
                                                <span className="text-[13px] font-semibold text-neutral-700">{ch.label}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>"""

pattern = r'<div className="p-6">\s*<p className="text-\[13px\] sm:text-sm text-neutral-600 leading-relaxed mb-6">\s*\{complaintText\}\s*</p>\s*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">\s*\{channels\.map\(\(ch, idx\) => \(\s*<div key=\{idx\}.*?</div>\s*\)\)}\s*</div>\s*</div>'

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
