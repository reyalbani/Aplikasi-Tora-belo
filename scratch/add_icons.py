import re

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Users, Clock, CheckCircle2, FileText, Activity, AlertCircle, PhoneCall, Mail, MapPin, ExternalLink", 
"Users, Clock, CheckCircle2, FileText, Activity, AlertCircle, PhoneCall, Mail, MapPin, ExternalLink, Info, BookOpen")

with open('resources/js/components/layanan/ServiceInfoLayout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
