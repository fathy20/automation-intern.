import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

def get_superbrain_body(recipient_name, category, sender_name, sender_phone, sender_email, linkedin_url=""):
    """
    Generates the customized SuperBrain email body (HTML and Plain Text)
    based on the organization category.
    """
    # Tailored reason based on organization
    category = str(category).strip().upper()
    if "NAID" in category:
        tailored_reason = "يتوافق 100% مع أهداف الأكاديمية في تطوير تقنيات مساعدة وتمكين ذوي الإعاقة."
    elif "BASEERA" in category:
        tailored_reason = "يدعم أهدافكم في التأهيل والإدماج للمكفوفين."
    elif "NBE" in category or "SIEMENS" in category or "CSR" in category:
        tailored_reason = "يناسب برامج الـCSR والابتكار الصحي والشمولية."
    else:
        tailored_reason = "يتوافق مع أهدافكم وتوجهاتكم الموقرة في دعم الابتكار الصحي والمسؤولية المجتمعية والشمولية."

    linkedin_html = f'<p><a href="{linkedin_url}" style="color: #0077b5; text-decoration: none; font-weight: bold;">LinkedIn Profile</a></p>' if linkedin_url else ""
    linkedin_text = f"\nLinkedIn: {linkedin_url}" if linkedin_url else ""

    # HTML Version with professional styling (RTL for Arabic, LTR fallback)
    html_content = f"""
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f7f9fa;
                color: #333333;
                margin: 0;
                padding: 0;
                line-height: 1.6;
            }}
            .container {{
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                overflow: hidden;
                border: 1px solid #e1e8ed;
            }}
            .header {{
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: #ffffff;
                padding: 30px 20px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }}
            .content {{
                padding: 30px 25px;
                direction: rtl;
                text-align: right;
            }}
            .greeting {{
                font-size: 18px;
                font-weight: bold;
                color: #1e3c72;
                margin-bottom: 20px;
            }}
            .highlight-box {{
                background-color: #f0f4f8;
                border-right: 5px solid #1e3c72;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-weight: 500;
            }}
            .list-title {{
                font-weight: bold;
                color: #2a5298;
                margin-top: 25px;
            }}
            ul {{
                padding-right: 20px;
                margin-top: 10px;
            }}
            li {{
                margin-bottom: 8px;
            }}
            .footer {{
                background-color: #f7f9fa;
                padding: 20px 25px;
                border-top: 1px solid #e1e8ed;
                font-size: 14px;
                color: #657786;
            }}
            .signature {{
                margin-top: 15px;
                border-top: 1px solid #e1e8ed;
                padding-top: 15px;
            }}
            .signature-name {{
                font-weight: bold;
                color: #1e3c72;
                font-size: 16px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>مشروع SuperBrain - تقنية مساعدة مبتكرة</h1>
            </div>
            <div class="content">
                <p class="greeting">السلام عليكم / Dear {recipient_name}،</p>
                <p>أنا <strong>{sender_name}</strong>، Software Engineer.</p>
                <p>أتواصل معكم بخصوص مشروع <strong>"SuperBrain"</strong> – تقنية wearable ثورية (headset) تحول الرؤية إلى حاسة لمس اصطناعية (haptic feedback) على الجبهة، مما يمكن المكفوفين من الشعور بالعوائق، الأشخاص، الحركة، والمسافات في الوقت الفعلي.</p>
                <p>الجهاز (من شركة 7Sense الإستونية) يوفر استقلالية كبيرة، أمان أعلى، ويُستخدم مع العصا البيضاء أو الكلب المرشد. تم تجربته بنجاح ويُعتبر تطور نوعي في Assistive Technology.</p>
                
                <div class="list-title">لماذا نتواصل معكم تحديداً؟</div>
                <div class="highlight-box">
                    {tailored_reason}
                </div>

                <div class="list-title">نقترح:</div>
                <ul>
                    <li>تنظيم تجربة Pilot في مصر (توزيع عدد محدود + تدريب).</li>
                    <li>شراكة للدعم المالي / اللوجستي / التسويقي / التوزيع.</li>
                    <li>مشاركة في فعالياتكم أو Africa Health ExCon.</li>
                </ul>

                <p style="margin-top: 25px;"><strong>مرفق مع الإيميل:</strong></p>
                <ul>
                    <li>عرض تقديمي مختصر (Pitch Deck).</li>
                    <li>فيديو توضيحي للجهاز.</li>
                    <li>معلومات عن التكلفة والتأثير المتوقع.</li>
                </ul>

                <p>أتمنى فرصة للقاء أو مكالمة لمناقشة التفاصيل.</p>
                <p>شكراً جزيلاً لدعمكم للمشاريع المؤثرة اجتماعياً.</p>

                <div class="signature">
                    <p class="signature-name">تحياتي،<br>{sender_name}</p>
                    <p style="margin: 5px 0;">الهاتف: {sender_phone}</p>
                    <p style="margin: 5px 0;">البريد الإلكتروني: {sender_email}</p>
                    {linkedin_html}
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    # Plain Text Fallback
    plain_text = f"""السلام عليكم / Dear {recipient_name}،

أنا {sender_name}، Software Engineer.
أتواصل معكم بخصوص مشروع "SuperBrain" – تقنية wearable ثورية (headset) تحول الرؤية إلى حاسة لمس اصطناعية (haptic feedback) على الجبهة، مما يمكن المكفوفين من الشعور بالعوائق، الأشخاص، الحركة، والمسافات في الوقت الفعلي.

الجهاز (من شركة 7Sense الإستونية) يوفر استقلالية كبيرة، أمان أعلى، ويُستخدم مع العصا البيضاء أو الكلب المرشد. تم تجربته بنجاح ويُعتبر تطور نوعي في Assistive Technology.

لماذا نتواصل معكم تحديداً؟
-> {tailored_reason}

نقترح:
1. تنظيم تجربة Pilot في مصر (توزيع عدد محدود + تدريب).
2. شراكة للدعم المالي / اللوجستي / التسويقي / التوزيع.
3. مشاركة في فعالياتكم أو Africa Health ExCon.

مرفق مع الإيميل:
- عرض تقديمي مختصر (Pitch Deck).
- فيديو توضيحي للجهاز.
- معلومات عن التكلفة والتأثير المتوقع.

أتمنى فرصة للقاء أو مكالمة لمناقشة التفاصيل.
شكراً جزيلاً لدعمكم للمشاريع المؤثرة اجتماعياً.

تحياتي،
{sender_name}
{sender_phone}
{sender_email}{linkedin_text}"""

    return html_content, plain_text


def get_internship_body(recipient_name, sender_name, sender_phone, sender_email, linkedin_url=""):
    """
    Generates the customized Summer Internship application email body (HTML and Plain Text).
    """
    linkedin_html = f'<p><a href="{linkedin_url}" style="color: #0077b5; text-decoration: none; font-weight: bold;">LinkedIn Profile</a></p>' if linkedin_url else ""
    linkedin_text = f"\nLinkedIn: {linkedin_url}" if linkedin_url else ""

    html_content = f"""
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f7f9fa;
                color: #333333;
                margin: 0;
                padding: 0;
                line-height: 1.6;
            }}
            .container {{
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                overflow: hidden;
                border: 1px solid #e1e8ed;
            }}
            .header {{
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                color: #ffffff;
                padding: 30px 20px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }}
            .content {{
                padding: 30px 25px;
                direction: rtl;
                text-align: right;
            }}
            .greeting {{
                font-size: 18px;
                font-weight: bold;
                color: #11998e;
                margin-bottom: 20px;
            }}
            .highlight-box {{
                background-color: #f0f8f5;
                border-right: 5px solid #11998e;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-weight: 500;
            }}
            .footer {{
                background-color: #f7f9fa;
                padding: 20px 25px;
                border-top: 1px solid #e1e8ed;
                font-size: 14px;
                color: #657786;
            }}
            .signature {{
                margin-top: 15px;
                border-top: 1px solid #e1e8ed;
                padding-top: 15px;
            }}
            .signature-name {{
                font-weight: bold;
                color: #11998e;
                font-size: 16px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>طلب تدريب صيفي - Summer Internship Application</h1>
            </div>
            <div class="content">
                <p class="greeting">السلام عليكم / Dear {recipient_name}،</p>
                <p>أتمنى أن تكونوا بخير وفي أفضل حال.</p>
                <p>أنا <strong>{sender_name}</strong>، Software Engineer.</p>
                <p>أتواصل معكم للتقديم على فرصة تدريب صيفي (Summer Internship) في شركتكم الموقرة بمجال التقنيات البرمجية أو الابتكار الصحي.</p>
                
                <div class="highlight-box">
                    أنا شغوف جداً بدمج التكنولوجيا مع الرعاية الصحية والتقنيات المساعدة (Healthcare & Assistive Tech)، وأتطلع بشدة لفرصة المساهمة في مشاريعكم واكتساب خبرات عملية حقيقية في بيئة عملكم المتميزة.
                </div>

                <p><strong>مرفق مع هذا الإيميل:</strong></p>
                <ul>
                    <li>السيرة الذاتية المحدثة (CV).</li>
                    <li>تفاصيل عن مهاراتي التقنية ومشاريعي السابقة.</li>
                </ul>

                <p>أتطلع لفرصة عمل مقابلة أو نقاش قصير لتوضيح كيف يمكنني تقديم قيمة مضافة لشركتكم خلال هذا الصيف.</p>
                <p>شكراً جزيلاً لوقتكم واهتمامكم الكريم.</p>

                <div class="signature">
                    <p class="signature-name">تحياتي،<br>{sender_name}</p>
                    <p style="margin: 5px 0;">الهاتف: {sender_phone}</p>
                    <p style="margin: 5px 0;">البريد الإلكتروني: {sender_email}</p>
                    {linkedin_html}
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    plain_text = f"""السلام عليكم / Dear {recipient_name}،

أتمنى أن تكونوا بخير وفي أفضل حال.

أنا {sender_name}، Software Engineer.
أتواصل معكم للتقديم على فرصة تدريب صيفي (Summer Internship) في شركتكم الموقرة.

أنا شغوف جداً بدمج التكنولوجيا مع الرعاية الصحية والتقنيات المساعدة (Healthcare & Assistive Tech)، وأتطلع بشدة لفرصة المساهمة في مشاريعكم واكتساب خبرات عملية حقيقية في بيئة عملكم المتميزة.

مرفق مع هذا الإيميل:
- السيرة الذاتية المحدثة (CV).
- تفاصيل عن مهاراتي التقنية ومشاريعي السابقة.

أتطلع لفرصة عمل مقابلة أو نقاش قصير لتوضيح كيف يمكنني تقديم قيمة مضافة لشركتكم خلال هذا الصيف.

شكراً جزيلاً لوقتكم واهتمامكم الكريم.

تحياتي،
{sender_name}
{sender_phone}
{sender_email}{linkedin_text}"""

    return html_content, plain_text


def format_greeting(recipient_name, company_name, category):
    recipient_name = str(recipient_name).strip()
    company_name = str(company_name).strip()
    category = str(category).strip().upper()
    
    generic_terms = ["المسؤول", "مسؤول", "مدير", "representative", "team", "committee", "partner", "csr"]
    is_generic = any(term in recipient_name.lower() for term in generic_terms) or len(recipient_name) < 3 or any(term in recipient_name for term in ["المسؤول", "مسؤول"])
    
    if not is_generic:
        return recipient_name
    else:
        if "NAID" in category or "NAID" in company_name.upper():
            return "NAID Team"
        elif "BASEERA" in category or "BASEERA" in company_name.upper():
            return "Baseera Partnership Team"
        elif "CSR" in category or "CSR" in company_name.upper() or "NBE" in company_name.upper() or "SIEMENS" in company_name.upper():
            return f"{company_name} CSR Committee"
        else:
            return f"{company_name} Partnership Team"


def get_hapticvision_sponsorship_body(recipient_name, company_name, category, sender_name, sender_phone, sender_email, linkedin_url=""):
    greeting_target = format_greeting(recipient_name, company_name, category)
    
    linkedin_html = f'<p><a href="{linkedin_url}" style="color: #4f46e5; text-decoration: none; font-weight: bold;">LinkedIn Profile</a></p>' if linkedin_url else ""
    linkedin_text = f"\nLinkedIn: {linkedin_url}" if linkedin_url else ""

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f3f4f6;
                color: #1f2937;
                margin: 0;
                padding: 0;
                line-height: 1.6;
            }}
            .container {{
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                overflow: hidden;
                border: 1px solid #e5e7eb;
            }}
            .header {{
                background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
                color: #ffffff;
                padding: 35px 25px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: -0.5px;
            }}
            .header p {{
                margin: 8px 0 0 0;
                font-size: 14px;
                opacity: 0.9;
            }}
            .content {{
                padding: 35px 30px;
                text-align: left;
            }}
            .greeting {{
                font-size: 18px;
                font-weight: bold;
                color: #4f46e5;
                margin-bottom: 20px;
            }}
            .highlight-box {{
                background-color: #eff6ff;
                border-left: 5px solid #3b82f6;
                padding: 18px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 15px;
            }}
            .section-title {{
                font-weight: 700;
                color: #1f2937;
                margin-top: 25px;
                font-size: 16px;
                border-bottom: 1.5px solid #f3f4f6;
                padding-bottom: 6px;
            }}
            ul {{
                padding-left: 20px;
                margin-top: 10px;
            }}
            li {{
                margin-bottom: 8px;
            }}
            .signature {{
                margin-top: 30px;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
                font-size: 14px;
                color: #4b5563;
            }}
            .signature-name {{
                font-weight: bold;
                color: #4f46e5;
                font-size: 16px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>HapticVision Graduation Project</h1>
                <p>Innovative Assistive Technology for the Visually Impaired</p>
            </div>
            <div class="content">
                <p class="greeting">Dear {greeting_target},</p>
                <p>I hope this email finds you well.</p>
                <p>My name is <strong>{sender_name}</strong>, a Software Engineer and final-year student at the Faculty of Engineering and Computer Science. I am writing on behalf of our graduation project team to request your kind sponsorship and partnership for <strong>HapticVision</strong> — an innovative assistive technology project aimed at empowering blind and visually impaired individuals in Egypt.</p>
                
                <div class="section-title">Project Overview</div>
                <p><strong>HapticVision</strong> is a wearable headset device that introduces a revolutionary concept called "Remote Sense of Touch". The system uses advanced 3D cameras, depth sensors, and intelligent algorithms to scan the surrounding environment in real time and translate visual information (obstacles, people, movement, distance, and direction) into precise haptic (tactile) feedback felt on the user’s forehead.</p>
                <p>This hands-free solution significantly improves spatial awareness, mobility, safety, and independence for visually impaired users, while working complementarily with traditional aids such as the white cane or guide dog.</p>
                
                <p>As a graduation project from the Faculty of Engineering and Computer Science, HapticVision combines multiple disciplines including:</p>
                <ul>
                    <li>Computer Vision & 3D Sensing</li>
                    <li>Embedded Systems & Hardware Integration</li>
                    <li>Haptic Feedback Algorithms</li>
                    <li>Human-Computer Interaction (HCI)</li>
                    <li>Real-time Data Processing</li>
                </ul>

                <div class="section-title">Why We Are Seeking Your Sponsorship</div>
                <div class="highlight-box">
                    Your organization is a leader in innovation, healthcare technology, and social responsibility. Supporting this project aligns perfectly with your goals in:
                    <ul style="margin-top: 8px; margin-bottom: 0;">
                        <li>Advancing Assistive Technology and Digital Inclusion</li>
                        <li>Empowering Persons with Disabilities</li>
                        <li>Promoting impactful student innovation and entrepreneurship</li>
                    </ul>
                </div>

                <div class="section-title">Forms of Support We Are Seeking:</div>
                <ul>
                    <li>Financial sponsorship for device acquisition and pilot implementation</li>
                    <li>Technical mentorship or hardware support</li>
                    <li>Opportunity to conduct a Pilot Program with your partners or beneficiaries</li>
                    <li>In-kind support (devices, testing facilities, or training venues)</li>
                    <li>Visibility and joint participation in events such as Africa Health ExCon</li>
                </ul>

                <div class="section-title">We have attached the following documents for your review:</div>
                <ul>
                    <li>Detailed Graduation Project Proposal (Pitch Deck)</li>
                    <li>Explanatory Video of the Technology</li>
                    <li>Project Timeline, Budget Breakdown, and Expected Impact</li>
                </ul>

                <p style="margin-top: 20px;">We would be extremely grateful for the opportunity to present our project in more detail through a short meeting or call at your convenience.</p>
                <p>Thank you for considering our request and for your continuous support to innovative student projects that create real social impact. We truly believe this collaboration can make a meaningful difference in the lives of many Egyptians.</p>

                <div class="signature">
                    <p class="signature-name">Best regards,<br>{sender_name}</p>
                    <p style="margin: 5px 0;">Software Engineer & Team Lead – HapticVision Graduation Project</p>
                    <p style="margin: 5px 0;">Faculty of Engineering and Computer Science</p>
                    <p style="margin: 5px 0;">Mobile: {sender_phone}</p>
                    <p style="margin: 5px 0;">Email: {sender_email}</p>
                    {linkedin_html}
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    plain_text = f"""Dear {greeting_target},

I hope this email finds you well.

My name is {sender_name}, a Software Engineer and final-year student at the Faculty of Engineering and Computer Science. I am writing on behalf of our graduation project team to request your kind sponsorship and partnership for HapticVision — an innovative assistive technology project aimed at empowering blind and visually impaired individuals in Egypt.

Project Overview
HapticVision is a wearable headset device that introduces a revolutionary concept called "Remote Sense of Touch". The system uses advanced 3D cameras, depth sensors, and intelligent algorithms to scan the surrounding environment in real time and translate visual information (obstacles, people, movement, distance, and direction) into precise haptic (tactile) feedback felt on the user’s forehead.

This hands-free solution significantly improves spatial awareness, mobility, safety, and independence for visually impaired users, while working complementarily with traditional aids such as the white cane or guide dog.

As a graduation project from the Faculty of Engineering and Computer Science, HapticVision combines multiple disciplines including:
- Computer Vision & 3D Sensing
- Embedded Systems & Hardware Integration
- Haptic Feedback Algorithms
- Human-Computer Interaction (HCI)
- Real-time Data Processing

Why We Are Seeking Your Sponsorship
Your organization is a leader in innovation, healthcare technology, and social responsibility. Supporting this project aligns perfectly with your goals in:
- Advancing Assistive Technology and Digital Inclusion
- Empowering Persons with Disabilities
- Promoting impactful student innovation and entrepreneurship

Forms of Support We Are Seeking:
- Financial sponsorship for device acquisition and pilot implementation
- Technical mentorship or hardware support
- Opportunity to conduct a Pilot Program with your partners or beneficiaries
- In-kind support (devices, testing facilities, or training venues)
- Visibility and joint participation in events such as Africa Health ExCon

We have attached the following documents for your review:
- Detailed Graduation Project Proposal (Pitch Deck)
- Explanatory Video of the Technology
- Project Timeline, Budget Breakdown, and Expected Impact

We would be extremely grateful for the opportunity to present our project in more detail through a short meeting or call at your convenience.

Thank you for considering our request and for your continuous support to innovative student projects that create real social impact. We truly believe this collaboration can make a meaningful difference in the lives of many Egyptians.

Best regards,
{sender_name}
Software Engineer & Team Lead – HapticVision Graduation Project
Faculty of Engineering and Computer Science
Mobile: {sender_phone}
Email: {sender_email}{linkedin_text}"""

    return html_content, plain_text


def send_email(smtp_server, port, sender_email, sender_password, recipient_email, subject, html_body, plain_body, attachment_paths=None):
    """
    Sends an email using Gmail SMTP secure connection (port 465 SSL or port 587 TLS).
    Supports multi-attachments and HTML body with a Plain Text fallback.
    """
    # Create the message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = recipient_email

    # Attach both parts (the mail client will render the HTML one if possible)
    part1 = MIMEText(plain_body, 'plain', 'utf-8')
    part2 = MIMEText(html_body, 'html', 'utf-8')
    msg.attach(part1)
    msg.attach(part2)

    # Attach files if any
    if attachment_paths:
        # We need a outer multipart to hold attachments
        outer_msg = MIMEMultipart('mixed')
        outer_msg['Subject'] = subject
        outer_msg['From'] = sender_email
        outer_msg['To'] = recipient_email
        
        # Attach the alternative body part
        outer_msg.attach(msg)
        
        for path in attachment_paths:
            if not os.path.exists(path):
                raise FileNotFoundError(f"Attachment file not found: {path}")
            
            filename = os.path.basename(path)
            # Binary mode
            with open(path, 'rb') as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
                
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename= {filename}',
            )
            outer_msg.attach(part)
            
        final_msg = outer_msg
    else:
        final_msg = msg

    # Connect to server
    # Port 465 is for SSL connection
    if int(port) == 465:
        server = smtplib.SMTP_SSL(smtp_server, port)
    else:
        # Port 587 is for TLS connection
        server = smtplib.SMTP(smtp_server, port)
        server.starttls()

    try:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, final_msg.as_string())
        return True, "Success"
    except Exception as e:
        return False, str(e)
    finally:
        server.quit()
