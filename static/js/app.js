document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Fallback Initial Contacts Data
    // ----------------------------------------------------
    const DEFAULT_CONTACTS = [
        {
            company_name: "NAID",
            contact_person: "المسؤول في الأكاديمية الوطنية",
            email: "info@naid.gov.eg",
            category: "NAID",
            notes: "National Academy (Pilot + training + tech support)"
        },
        {
            company_name: "Baseera Foundation",
            contact_person: "المسؤول في مؤسسة بصيرة",
            email: "info@baseerafoundation.org",
            category: "Baseera",
            notes: "Baseera Foundation (Pilot + distribution + partnership)"
        },
        {
            company_name: "National Bank of Egypt (NBE)",
            contact_person: "مسؤول المسؤولية المجتمعية بالبنك الأهلي",
            email: "csr@nbe.com.eg",
            category: "CSR",
            notes: "Financial sponsorship + CSR (Active in inclusion)"
        },
        {
            company_name: "Misr El Kheir Foundation",
            contact_person: "إدارة منح مشاريع التخرج بمؤسسة مصر الخير",
            email: "grants-hr@misrelkheir.org",
            category: "General",
            notes: "Graduation project support (up to 80K EGP)"
        },
        {
            company_name: "Dell Technologies Egypt",
            contact_person: "CSR and Tech Partnerships Manager",
            email: "egypt.partnerships@dell.com",
            category: "CSR",
            notes: "Partner in Assistive Tech (Partners with NAID)"
        },
        {
            company_name: "AstraZeneca Egypt",
            contact_person: "CSR & Patient Safety Team",
            email: "Patient.SafetyEgypt@astrazeneca.com",
            category: "CSR",
            notes: "Healthcare and CSR partnerships"
        },
        {
            company_name: "Sanofi Egypt",
            contact_person: "Communications & CSR Team",
            email: "EG.Communication@sanofi.com",
            category: "CSR",
            notes: "Strong CSR and health awareness programs"
        },
        {
            company_name: "Orange Egypt (DAesn Program)",
            contact_person: "مسؤول برنامج تدريب ذوي الإعاقة (Orange)",
            email: "daesnassociation@yahoo.com",
            category: "General",
            notes: "Orange Egypt program for training & employing disabled"
        },
        {
            company_name: "Ataa Charitable Investment Fund",
            contact_person: "إدارة الصندوق الاستثماري الخيري لعطاء",
            email: "contact@ataa.fund",
            category: "General",
            notes: "Charitable investment fund for disabled (Baseera partner)"
        },
        {
            company_name: "SDS Egypt (Smart Disability Society)",
            contact_person: "المسؤول بالجمعية الذكية لذوي الإعاقة",
            email: "info@sdsegypt.com",
            category: "General",
            notes: "Specialized in Assistive Tech + training for the blind"
        },
        {
            company_name: "Alameda Healthcare Group",
            contact_person: "Partnerships and Medical Tech Team",
            email: "info@alameda-hc.com",
            category: "CSR",
            notes: "Strategic partner of Siemens (Medical tech + CSR)"
        },
        {
            company_name: "Humanity & Inclusion Egypt",
            contact_person: "إدارة منظمة الإنسانية والإدماج بمصر",
            email: "egypt@hi.org",
            category: "General",
            notes: "International NGO specializing in disability support"
        }
    ];

    // State Variables
    let contacts = [];
    let config = {};

    // Elements Selection
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');
    
    // Configurations Form Elements
    const emailjsForm = document.getElementById('emailjs-settings-form');
    const signatureForm = document.getElementById('sender-signature-form');
    
    // Contacts Directory Elements
    const searchInput = document.getElementById('search-contacts');
    const tableBody = document.getElementById('contacts-table-body');
    const addContactBtn = document.getElementById('btn-add-contact-modal');
    const btnResetContacts = document.getElementById('btn-reset-contacts-default');
    const contactModal = document.getElementById('modal-contact-form');
    const contactForm = document.getElementById('contact-form-data');
    const contactModalTitle = document.getElementById('contact-modal-title');
    const contactEditIndex = document.getElementById('contact-edit-index');
    
    // Campaigns elements
    const templateSelect = document.getElementById('campaign-template');
    const dispatchRecipientsList = document.getElementById('dispatch-recipients-list');
    const previewRecipientSelect = document.getElementById('preview-recipient-select');
    const previewSubjectText = document.getElementById('preview-subject-text');
    const previewIframe = document.getElementById('preview-iframe');
    const selectAllRecipients = document.getElementById('select-all-recipients');
    const deselectAllRecipients = document.getElementById('deselect-all-recipients');
    const btnLaunchCampaign = document.getElementById('btn-start-campaign');
    
    // LinkedIn elements
    const btnLinkedinSearch = document.getElementById('btn-linkedin-search');
    const linkedinMessageText = document.getElementById('linkedin-message-text');
    const btnCopyLinkedin = document.getElementById('btn-copy-linkedin');

    // Campaign Progress elements
    const progressModal = document.getElementById('modal-campaign-progress');
    const progressFill = document.getElementById('campaign-progress-fill');
    const progressPct = document.getElementById('campaign-progress-pct');
    const dispatchLogs = document.getElementById('dispatch-logs');
    const modalFooter = document.getElementById('campaign-modal-footer');
    const btnCloseProgress = document.getElementById('btn-close-progress-modal');
    const btnDownloadReport = document.getElementById('btn-download-report');
    
    // Quick Test Mail
    const btnQuickPreview = document.getElementById('btn-quick-preview');

    // ----------------------------------------------------
    // Tab Navigation Logic
    // ----------------------------------------------------
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            
            navItems.forEach(n => n.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
            
            if (tabId === 'campaigns') {
                pageTitle.textContent = 'Outreach Campaigns';
                pageDesc.textContent = 'Automate your health-tech partnership campaigns and internship outreach.';
            } else if (tabId === 'contacts') {
                pageTitle.textContent = 'Contacts Directory';
                pageDesc.textContent = 'Manage your healthcare organization and general outreach list.';
            } else if (tabId === 'config') {
                pageTitle.textContent = 'EmailJS System Configuration';
                pageDesc.textContent = 'Configure your EmailJS keys and your dynamic email signature.';
            }
        });
    });

    // ----------------------------------------------------
    // Dynamic Email Template Engines (Pure JS Ports)
    // ----------------------------------------------------
    function formatGreeting(recipientName, companyName, category) {
        recipientName = String(recipientName).trim();
        companyName = String(companyName).trim();
        category = String(category).trim().toUpperCase();
        
        const genericTerms = ["المسؤول", "مسؤول", "مدير", "representative", "team", "committee", "partner", "csr"];
        const isGeneric = genericTerms.some(term => recipientName.toLowerCase().includes(term)) || 
                          recipientName.length < 3 || 
                          recipientName.includes("المسؤول") || 
                          recipientName.includes("مسؤول");
        
        if (!isGeneric) {
            return recipientName;
        } else {
            if (category === "NAID" || companyName.toUpperCase().includes("NAID")) {
                return "NAID Team";
            } else if (category === "BASEERA" || companyName.toUpperCase().includes("BASEERA")) {
                return "Baseera Partnership Team";
            } else if (category === "CSR" || companyName.toUpperCase().includes("CSR") || companyName.toUpperCase().includes("NBE") || companyName.toUpperCase().includes("SIEMENS")) {
                return `${companyName} CSR Committee`;
            } else {
                return `${companyName} Partnership Team`;
            }
        }
    }

    function getSuperBrainBody(recipientName, category, senderName, senderPhone, senderEmail, linkedinUrl = "") {
        category = String(category).trim().toUpperCase();
        let tailoredReason = "";
        if (category.includes("NAID")) {
            tailoredReason = "يتوافق 100% مع أهداف الأكاديمية في تطوير تقنيات مساعدة وتمكين ذوي الإعاقة.";
        } else if (category.includes("BASEERA")) {
            tailoredReason = "يدعم أهدافكم في التأهيل والإدماج للمكفوفين.";
        } else if (category.includes("NBE") || category.includes("SIEMENS") || category.includes("CSR")) {
            tailoredReason = "يناسب برامج الـCSR والابتكار الصحي والشمولية.";
        } else {
            tailoredReason = "يتوافق مع أهدافكم وتوجهاتكم الموقرة في دعم الابتكار الصحي والمسؤولية المجتمعية والشمولية.";
        }

        const linkedinHtml = linkedinUrl ? `<p><a href="${linkedinUrl}" style="color: #0077b5; text-decoration: none; font-weight: bold;">LinkedIn Profile</a></p>` : "";
        const linkedinText = linkedinUrl ? `\nLinkedIn: ${linkedinUrl}` : "";

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f9fa; color: #333333; margin: 0; padding: 0; line-height: 1.6; }
                .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e1e8ed; }
                .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                .content { padding: 30px 25px; direction: rtl; text-align: right; }
                .greeting { font-size: 18px; font-weight: bold; color: #1e3c72; margin-bottom: 20px; }
                .highlight-box { background-color: #f0f4f8; border-right: 5px solid #1e3c72; padding: 15px; margin: 20px 0; border-radius: 4px; font-weight: 500; }
                .list-title { font-weight: bold; color: #2a5298; margin-top: 25px; }
                ul { padding-right: 20px; margin-top: 10px; }
                li { margin-bottom: 8px; }
                .signature { margin-top: 15px; border-top: 1px solid #e1e8ed; padding-top: 15px; }
                .signature-name { font-weight: bold; color: #1e3c72; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>مشروع SuperBrain - تقنية مساعدة مبتكرة</h1>
                </div>
                <div class="content">
                    <p class="greeting">السلام عليكم / Dear ${recipientName}،</p>
                    <p>أنا <strong>{senderName}</strong>، Software Engineer.</p>
                    <p>أتواصل معكم بخصوص مشروع <strong>"SuperBrain"</strong> – تقنية wearable ثورية (headset) تحول الرؤية إلى حاسة لمس اصطناعية (haptic feedback) على الجبهة، مما يمكن المكفوفين من الشعور بالعوائق، الأشخاص، الحركة، والمسافات في الوقت الفعلي.</p>
                    <p>الجهاز (من شركة 7Sense الإستونية) يوفر استقلالية كبيرة، أمان أعلى، ويُستخدم مع العصا البيضاء أو الكلب المرشد. تم تجربته بنجاح ويُعتبر تطور نوعي في Assistive Technology.</p>
                    <div class="list-title">لماذا نتواصل معكم تحديداً؟</div>
                    <div class="highlight-box">${tailoredReason}</div>
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
                        <p class="signature-name">تحياتي،<br>${senderName}</p>
                        <p style="margin: 5px 0;">الهاتف: ${senderPhone}</p>
                        <p style="margin: 5px 0;">البريد الإلكتروني: ${senderEmail}</p>
                        ${linkedinHtml}
                    </div>
                </div>
            </div>
        </body>
        </html>
        `.replace(/{senderName}/g, senderName);

        const plainContent = `السلام عليكم / Dear ${recipientName}،

أنا ${senderName}، Software Engineer.
أتواصل معكم بخصوص مشروع "SuperBrain" – تقنية wearable ثورية (headset) تحول الرؤية إلى حاسة لمس اصطناعية (haptic feedback) على الجبهة، مما يمكن المكفوفين من الشعور بالعوائق، الأشخاص، الحركة، والمسافات في الوقت الفعلي.

الجهاز (من شركة 7Sense الإستونية) يوفر استقلالية كبيرة، أمان أعلى، ويُستخدم مع العصا البيضاء أو الكلب المرشد. تم تجربته بنجاح ويُعتبر تطور نوعي في Assistive Technology.

لماذا نتواصل معكم تحديداً؟
-> ${tailoredReason}

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
${senderName}
${senderPhone}
${senderEmail}${linkedinText}`;

        return { html: htmlContent, plain: plainContent };
    }

    function getHapticVisionSponsorshipBody(recipientName, companyName, category, senderName, senderPhone, senderEmail, linkedinUrl = "") {
        const greetingTarget = formatGreeting(recipientName, companyName, category);
        const linkedinHtml = linkedinUrl ? `<p><a href="${linkedinUrl}" style="color: #4f46e5; text-decoration: none; font-weight: bold;">LinkedIn Profile</a></p>` : "";
        const linkedinText = linkedinUrl ? `\nLinkedIn: ${linkedinUrl}` : "";

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 0; line-height: 1.6; }
                .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e5e7eb; }
                .header { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); color: #ffffff; padding: 35px 25px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
                .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 35px 30px; text-align: left; }
                .greeting { font-size: 18px; font-weight: bold; color: #4f46e5; margin-bottom: 20px; }
                .highlight-box { background-color: #eff6ff; border-left: 5px solid #3b82f6; padding: 18px; margin: 20px 0; border-radius: 4px; font-size: 15px; }
                .section-title { font-weight: 700; color: #1f2937; margin-top: 25px; font-size: 16px; border-bottom: 1.5px solid #f3f4f6; padding-bottom: 6px; }
                ul { padding-left: 20px; margin-top: 10px; }
                li { margin-bottom: 8px; }
                .signature { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 14px; color: #4b5563; }
                .signature-name { font-weight: bold; color: #4f46e5; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>HapticVision Graduation Project</h1>
                    <p>Innovative Assistive Technology for the Visually Impaired</p>
                </div>
                <div class="content">
                    <p class="greeting">Dear ${greetingTarget},</p>
                    <p>I hope this email finds you well.</p>
                    <p>My name is <strong>${senderName}</strong>, a Software Engineer and final-year student at the Faculty of Engineering and Computer Science. I am writing on behalf of our graduation project team to request your kind sponsorship and partnership for <strong>HapticVision</strong> — an innovative assistive technology project aimed at empowering blind and visually impaired individuals in Egypt.</p>
                    
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
                        <p class="signature-name">Best regards,<br>${senderName}</p>
                        <p style="margin: 5px 0;">Software Engineer & Team Lead – HapticVision Graduation Project</p>
                        <p style="margin: 5px 0;">Faculty of Engineering and Computer Science</p>
                        <p style="margin: 5px 0;">Mobile: ${senderPhone}</p>
                        <p style="margin: 5px 0;">Email: ${senderEmail}</p>
                        ${linkedinHtml}
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        const plainContent = `Dear ${greetingTarget},

I hope this email finds you well.

My name is ${senderName}, a Software Engineer and final-year student at the Faculty of Engineering and Computer Science. I am writing on behalf of our graduation project team to request your kind sponsorship and partnership for HapticVision — an innovative assistive technology project aimed at empowering blind and visually impaired individuals in Egypt.

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
${senderName}
Software Engineer & Team Lead – HapticVision Graduation Project
Faculty of Engineering and Computer Science
Mobile: ${senderPhone}
Email: ${senderEmail}${linkedinText}`;

        return { html: htmlContent, plain: plainContent };
    }

    function getInternshipBody(recipientName, senderName, senderPhone, senderEmail, linkedinUrl = "") {
        const linkedinHtml = linkedinUrl ? `<p><a href="${linkedinUrl}" style="color: #11998e; text-decoration: none; font-weight: bold;">LinkedIn Profile</a></p>` : "";
        const linkedinText = linkedinUrl ? `\nLinkedIn: ${linkedinUrl}` : "";

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f9fa; color: #333333; margin: 0; padding: 0; line-height: 1.6; }
                .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e1e8ed; }
                .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                .content { padding: 30px 25px; direction: rtl; text-align: right; }
                .greeting { font-size: 18px; font-weight: bold; color: #11998e; margin-bottom: 20px; }
                .highlight-box { background-color: #f0f8f5; border-right: 5px solid #11998e; padding: 15px; margin: 20px 0; border-radius: 4px; font-weight: 500; }
                .signature { margin-top: 15px; border-top: 1px solid #e1e8ed; padding-top: 15px; }
                .signature-name { font-weight: bold; color: #11998e; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>طلب تدريب صيفي - Summer Internship Application</h1>
                </div>
                <div class="content">
                    <p class="greeting">السلام عليكم / Dear ${recipientName}،</p>
                    <p>أتمنى أن تكونوا بخير وفي أفضل حال.</p>
                    <p>أنا <strong>${senderName}</strong>، Software Engineer.</p>
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
                        <p class="signature-name">تحياتي،<br>${senderName}</p>
                        <p style="margin: 5px 0;">الهاتف: ${senderPhone}</p>
                        <p style="margin: 5px 0;">البريد الإلكتروني: ${senderEmail}</p>
                        ${linkedinHtml}
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        const plainContent = `السلام عليكم / Dear ${recipientName}،

أتمنى أن تكونوا بخير وفي أفضل حال.

أنا ${senderName}، Software Engineer.
أتواصل معكم للتقديم على فرصة تدريب صيفي (Summer Internship) في شركتكم الموقرة.

أنا شغوف جداً بدمج التكنولوجيا مع الرعاية الصحية والتقنيات المساعدة (Healthcare & Assistive Tech)، وأتطلع بشدة لفرصة المساهمة في مشاريعكم واكتساب خبرات عملية حقيقية في بيئة عملكم المتميزة.

مرفق مع هذا الإيميل:
- السيرة الذاتية المحدثة (CV).
- تفاصيل عن مهاراتي التقنية ومشاريعي السابقة.

أتطلع لفرصة عمل مقابلة أو نقاش قصير لتوضيح كيف يمكنني تقديم قيمة مضافة لشركتكم خلال هذا الصيف.

شكراً جزيلاً لوقتكم واهتمامكم الكريم.

تحياتي،
${senderName}
${senderPhone}
${senderEmail}${linkedinText}`;

        return { html: htmlContent, plain: plainContent };
    }

    // ----------------------------------------------------
    // Configuration Caching & Persistence
    // ----------------------------------------------------
    function loadConfig() {
        const saved = localStorage.getItem('emailjs_config');
        if (saved) {
            config = JSON.parse(saved);
            if (!config.emailjs_service_id) config.emailjs_service_id = "service_74cjfib";
            if (!config.emailjs_template_id) config.emailjs_template_id = "B7pluV26yjwcFWNsRIrfZ";
            if (!config.emailjs_public_key) config.emailjs_public_key = "ULKnlSitxzcrZ1i81";
        } else {
            // Default fallbacks
            config = {
                emailjs_service_id: "service_74cjfib",
                emailjs_template_id: "B7pluV26yjwcFWNsRIrfZ",
                emailjs_public_key: "ULKnlSitxzcrZ1i81",
                sender_name: "Fathy Sharaf",
                sender_phone: "01002137288",
                sender_email: "fathysaraf1@gmail.com",
                linkedin_url: "https://www.linkedin.com/in/fathysharaf/"
            };
            localStorage.setItem('emailjs_config', JSON.stringify(config));
        }
        
        // Fill form fields
        document.getElementById('emailjs_service_id').value = config.emailjs_service_id || '';
        document.getElementById('emailjs_template_id').value = config.emailjs_template_id || '';
        document.getElementById('emailjs_public_key').value = config.emailjs_public_key || '';
        document.getElementById('sender_name').value = config.sender_name || '';
        document.getElementById('sender_phone').value = config.sender_phone || '';
        document.getElementById('linkedin_url').value = config.linkedin_url || '';
        
        // Update sidebar name
        document.getElementById('sidebar-sender-name').textContent = config.sender_name || 'Fathy Sharaf';
    }

    emailjsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        config.emailjs_service_id = document.getElementById('emailjs_service_id').value.trim();
        config.emailjs_template_id = document.getElementById('emailjs_template_id').value.trim();
        config.emailjs_public_key = document.getElementById('emailjs_public_key').value.trim();
        localStorage.setItem('emailjs_config', JSON.stringify(config));
        showToast('EmailJS configuration saved!', 'success');
        updateLivePreview();
    });

    signatureForm.addEventListener('submit', (e) => {
        e.preventDefault();
        config.sender_name = document.getElementById('sender_name').value.trim();
        config.sender_phone = document.getElementById('sender_phone').value.trim();
        config.linkedin_url = document.getElementById('linkedin_url').value.trim();
        localStorage.setItem('emailjs_config', JSON.stringify(config));
        document.getElementById('sidebar-sender-name').textContent = config.sender_name;
        showToast('Signature settings saved!', 'success');
        updateLivePreview();
    });

    // ----------------------------------------------------
    // Contacts Directory Storage (Client-side localStorage)
    // ----------------------------------------------------
    function loadContacts() {
        const saved = localStorage.getItem('contacts_list');
        if (saved) {
            contacts = JSON.parse(saved);
        } else {
            contacts = [...DEFAULT_CONTACTS];
            localStorage.setItem('contacts_list', JSON.stringify(contacts));
        }
        renderContactsTable(contacts);
        populateCampaignRecipients();
        updateLivePreview();
    }

    function renderContactsTable(list) {
        tableBody.innerHTML = '';
        if (list.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No contacts found. Click 'Add Recipient' to start.</td></tr>`;
            return;
        }
        
        list.forEach((c, index) => {
            const tr = document.createElement('tr');
            let badgeClass = 'badge-general';
            if (c.category === 'NAID') badgeClass = 'badge-naid';
            else if (c.category === 'Baseera') badgeClass = 'badge-baseera';
            else if (c.category === 'CSR') badgeClass = 'badge-csr';

            tr.innerHTML = `
                <td><strong>${escapeHtml(c.company_name)}</strong></td>
                <td>${escapeHtml(c.contact_person)}</td>
                <td><a href="mailto:${c.email}" style="color:#38bdf8; text-decoration:none;">${escapeHtml(c.email)}</a></td>
                <td><span class="badge ${badgeClass}">${c.category}</span></td>
                <td><span style="font-size:0.8rem; color:var(--text-secondary);">${escapeHtml(c.notes || '')}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="table-action-btn btn-edit" data-index="${index}"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="table-action-btn btn-delete" data-index="${index}"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        tableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openContactForm(btn.getAttribute('data-index')));
        });

        tableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteContact(btn.getAttribute('data-index')));
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = contacts.filter(c => 
                c.company_name.toLowerCase().includes(query) ||
                c.contact_person.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                c.category.toLowerCase().includes(query)
            );
            renderContactsTable(filtered);
        });
    }

    function openContactForm(index = null) {
        contactModal.classList.add('active');
        if (index !== null) {
            contactModalTitle.textContent = 'Edit Recipient';
            contactEditIndex.value = index;
            const c = contacts[index];
            document.getElementById('c_company_name').value = c.company_name;
            document.getElementById('c_contact_person').value = c.contact_person;
            document.getElementById('c_email').value = c.email;
            document.getElementById('c_category').value = c.category;
            document.getElementById('c_notes').value = c.notes || '';
        } else {
            contactModalTitle.textContent = 'Add New Recipient';
            contactEditIndex.value = '';
            contactForm.reset();
        }
    }

    async function deleteContact(index) {
        if (confirm(`Are you sure you want to delete ${contacts[index].company_name}?`)) {
            contacts.splice(index, 1);
            localStorage.setItem('contacts_list', JSON.stringify(contacts));
            loadContacts();
            showToast('Recipient removed successfully', 'success');
        }
    }

    document.querySelectorAll('.close-modal-trigger').forEach(el => {
        el.addEventListener('click', () => contactModal.classList.remove('active'));
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = contactEditIndex.value;
        const newContact = {
            company_name: document.getElementById('c_company_name').value.trim(),
            contact_person: document.getElementById('c_contact_person').value.trim(),
            email: document.getElementById('c_email').value.trim(),
            category: document.getElementById('c_category').value,
            notes: document.getElementById('c_notes').value.trim()
        };

        if (index !== '') {
            contacts[index] = newContact;
        } else {
            contacts.push(newContact);
        }

        localStorage.setItem('contacts_list', JSON.stringify(contacts));
        contactModal.classList.remove('active');
        loadContacts();
        showToast('Recipient saved successfully!', 'success');
    });

    btnResetContacts.addEventListener('click', () => {
        if (confirm('Reset contact list to default 12 healthcare and disability organizations? This will clear custom edits.')) {
            contacts = [...DEFAULT_CONTACTS];
            localStorage.setItem('contacts_list', JSON.stringify(contacts));
            loadContacts();
            showToast('Contacts reset to defaults!', 'success');
        }
    });

    // ----------------------------------------------------
    // Campaigns Preview & Selection
    // ----------------------------------------------------
    function populateCampaignRecipients() {
        dispatchRecipientsList.innerHTML = '';
        previewRecipientSelect.innerHTML = '';
        
        if (contacts.length === 0) {
            dispatchRecipientsList.innerHTML = '<span style="color:var(--text-secondary); font-size:0.9rem;">No recipients available. Add contacts in Directory first.</span>';
            previewRecipientSelect.innerHTML = '<option value="none">No Recipients Available</option>';
            return;
        }

        contacts.forEach((c, index) => {
            const div = document.createElement('label');
            div.className = 'recipient-option';
            div.innerHTML = `
                <input type="checkbox" class="recipient-checkbox" value="${index}" checked>
                <div class="recipient-details">
                    <span class="name">${escapeHtml(c.company_name)} - ${escapeHtml(c.contact_person)}</span>
                    <span class="info">${escapeHtml(c.email)} (${c.category})</span>
                </div>
            `;
            dispatchRecipientsList.appendChild(div);

            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = `${c.company_name} (${c.category})`;
            previewRecipientSelect.appendChild(opt);
        });
    }

    selectAllRecipients.addEventListener('click', () => {
        document.querySelectorAll('.recipient-checkbox').forEach(cb => cb.checked = true);
    });

    deselectAllRecipients.addEventListener('click', () => {
        document.querySelectorAll('.recipient-checkbox').forEach(cb => cb.checked = false);
    });

    function generateEmailContent(recipient, templateType) {
        let subject = "";
        let bodies = { html: "", plain: "" };
        const sName = config.sender_name || 'Fathy Sharaf';
        const sPhone = config.sender_phone || '01002137288';
        const sEmail = config.sender_email || 'fathysaraf1@gmail.com';
        const sLinkedin = config.linkedin_url || '';

        if (templateType === "SuperBrain Partnership Outreach") {
            subject = "طلب شراكة / دعم لمشروع تقنية مساعدة مبتكرة للمكفوفين وضعاف البصر في مصر – SuperBrain";
            bodies = getSuperBrainBody(recipient.contact_person, recipient.category, sName, sPhone, sEmail, sLinkedin);
        } else if (templateType === "HapticVision Sponsorship (English)") {
            subject = "Sponsorship Request: HapticVision Graduation Project – Innovative Assistive Technology for the Visually Impaired";
            bodies = getHapticVisionSponsorshipBody(recipient.contact_person, recipient.company_name, recipient.category, sName, sPhone, sEmail, sLinkedin);
        } else {
            subject = `طلب تدريب صيفي - Summer Internship Application - ${sName}`;
            bodies = getInternshipBody(recipient.contact_person, sName, sPhone, sEmail, sLinkedin);
        }

        return { subject, html: bodies.html, plain: bodies.plain };
    }

    function updateLivePreview() {
        if (contacts.length === 0 || previewRecipientSelect.value === 'none') {
            previewSubjectText.textContent = '(No subject)';
            previewIframe.srcdoc = '<div style="font-family:sans-serif; color:#666; padding:20px; text-align:center;">Add a recipient and configure the campaign to view the preview.</div>';
            return;
        }

        const selectedIndex = parseInt(previewRecipientSelect.value);
        if (isNaN(selectedIndex) || selectedIndex >= contacts.length) return;
        
        const recipient = contacts[selectedIndex];
        const templateType = templateSelect.value;
        const emailContent = generateEmailContent(recipient, templateType);

        previewSubjectText.textContent = emailContent.subject;
        previewIframe.srcdoc = emailContent.html;

        // Generate LinkedIn Connection Message
        const sName = config.sender_name || 'Fathy Sharaf';
        const sPhone = config.sender_phone || '01002137288';
        const linkedinMsg = `Hi,\nI hope you are doing well.\n\nMy name is ${sName}, a Software Engineer and Team Lead for HapticVision, a graduation project developing a wearable headset that scans surroundings and translates them into haptic feedback on the forehead for blind individuals in Egypt.\n\nGiven your role at ${recipient.company_name}, I would love to connect and briefly discuss potential CSR sponsorship or piloting opportunities to support assistive tech innovation.\n\nBest regards,\n${sName}\n${sPhone}`;
        
        if (btnLinkedinSearch) {
            btnLinkedinSearch.href = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(recipient.company_name)}%20CSR%20Partnership`;
        }
        if (linkedinMessageText) {
            linkedinMessageText.value = linkedinMsg;
        }
    }

    templateSelect.addEventListener('change', updateLivePreview);
    previewRecipientSelect.addEventListener('change', updateLivePreview);

    // ----------------------------------------------------
    // Sending emails via EmailJS API (REST endpoint)
    // ----------------------------------------------------
    async function sendEmailViaEmailJS(serviceId, templateId, publicKey, recipientEmail, subject, htmlBody, plainBody) {
        try {
            const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: serviceId,
                    template_id: templateId,
                    user_id: publicKey,
                    template_params: {
                        to_email: recipientEmail,
                        subject: subject,
                        html_body: htmlBody,
                        plain_body: plainBody
                    }
                })
            });
            
            if (res.ok) {
                return { success: true, message: "Sent successfully!" };
            } else {
                const text = await res.text();
                return { success: false, message: text || "EmailJS REST API transmission error" };
            }
        } catch (err) {
            return { success: false, message: err.message || "Network request failed" };
        }
    }

    // ----------------------------------------------------
    // Launching Campaign
    // ----------------------------------------------------
    btnLaunchCampaign.addEventListener('click', async () => {
        const checkedBoxes = document.querySelectorAll('.recipient-checkbox:checked');
        if (checkedBoxes.length === 0) {
            showToast('Please select at least one recipient.', 'error');
            return;
        }

        const serviceId = config.emailjs_service_id;
        const templateId = config.emailjs_template_id;
        const publicKey = config.emailjs_public_key;

        if (!serviceId || !templateId || !publicKey) {
            showToast('Please configure your EmailJS credentials in Settings tab first.', 'error');
            return;
        }

        const selectedRecipients = Array.from(checkedBoxes).map(cb => contacts[parseInt(cb.value)]);

        // Open modal logs
        progressModal.classList.add('active');
        modalFooter.style.display = 'none';
        progressFill.style.width = '0%';
        progressPct.textContent = '0%';
        dispatchLogs.innerHTML = '';
        
        appendLog('🚀 Campaign initialized...', 'info');
        appendLog(`Preparing to send ${selectedRecipients.length} emails via EmailJS...`, 'info');

        let successCount = 0;
        let failCount = 0;
        const total = selectedRecipients.length;
        const reportLogs = [];
        const templateType = templateSelect.value;

        for (let i = 0; i < total; i++) {
            const recipient = selectedRecipients[i];
            appendLog(`[${i+1}/${total}] Compiling email for ${recipient.company_name}...`, 'info');

            const emailData = generateEmailContent(recipient, templateType);

            appendLog(`Sending to ${recipient.company_name} (${recipient.email})...`, 'info');
            const result = await sendEmailViaEmailJS(
                serviceId,
                templateId,
                publicKey,
                recipient.email,
                emailData.subject,
                emailData.html,
                emailData.plain
            );

            if (result.success) {
                appendLog(`✅ Success: Email delivered to ${recipient.company_name}!`, 'success');
                successCount++;
                reportLogs.push({ company: recipient.company_name, email: recipient.email, status: 'Success', details: 'Sent successfully' });
            } else {
                appendLog(`❌ Failed for ${recipient.company_name}: ${result.message}`, 'error');
                failCount++;
                reportLogs.push({ company: recipient.company_name, email: recipient.email, status: 'Failed', details: result.message });
            }

            // Update UI progress
            const pct = Math.round(((i + 1) / total) * 100);
            progressFill.style.width = `${pct}%`;
            progressPct.textContent = `${pct}%`;

            // Wait 1.5 seconds cooldown
            await new Promise(r => setTimeout(r, 1500));
        }

        appendLog('--------------------------------------------', 'info');
        appendLog(`Campaign complete! Success: ${successCount}, Failures: ${failCount}.`, 'info');
        showToast(`Campaign dispatch finished. (${successCount} Sent, ${failCount} Failed)`, successCount > 0 ? 'success' : 'error');

        // Compile download report CSV file
        const csvContent = generateReportCSV(reportLogs);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        btnDownloadReport.href = url;
        btnDownloadReport.download = `delivery_report_${new Date().toISOString().slice(0, 10)}.csv`;

        modalFooter.style.display = 'flex';
    });

    btnCloseProgress.addEventListener('click', () => {
        progressModal.classList.remove('active');
    });

    function appendLog(text, type) {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        dispatchLogs.appendChild(entry);
        dispatchLogs.scrollTop = dispatchLogs.scrollHeight;
    }

    function generateReportCSV(logsList) {
        const headers = ['Company', 'Email', 'Status', 'Details'];
        const rows = logsList.map(l => [
            `"${l.company.replace(/"/g, '""')}"`,
            `"${l.email.replace(/"/g, '""')}"`,
            `"${l.status}"`,
            `"${l.details.replace(/"/g, '""')}"`
        ]);
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    // Quick test mail trigger
    btnQuickPreview.addEventListener('click', async () => {
        const testEmail = prompt("Enter target email address for quick test:", config.sender_email);
        if (!testEmail) return;

        const serviceId = config.emailjs_service_id;
        const templateId = config.emailjs_template_id;
        const publicKey = config.emailjs_public_key;

        if (!serviceId || !templateId || !publicKey) {
            showToast('Please configure your EmailJS credentials in Settings tab first.', 'error');
            return;
        }

        showToast('Sending test email via EmailJS...', 'info');
        
        const dummyRecipient = {
            contact_person: "مدير التجربة والاختبار",
            company_name: "Test Healthcare Org",
            category: "General",
            email: testEmail
        };
        const emailData = generateEmailContent(dummyRecipient, templateSelect.value);

        const result = await sendEmailViaEmailJS(
            serviceId,
            templateId,
            publicKey,
            testEmail,
            `[TEST] ${emailData.subject}`,
            emailData.html,
            emailData.plain
        );

        if (result.success) {
            showToast('Test email sent successfully!', 'success');
        } else {
            showToast(`Failed: ${result.message}`, 'error');
        }
    });

    // ----------------------------------------------------
    // Toast UI & Utilities
    // ----------------------------------------------------
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    let toastTimeout;

    function showToast(message, type = 'info') {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toast.className = `toast active ${type}`;
        
        if (type === 'success') {
            toastIcon.className = 'fa-solid fa-circle-check';
        } else if (type === 'error') {
            toastIcon.className = 'fa-solid fa-circle-xmark';
        } else {
            toastIcon.className = 'fa-solid fa-circle-info';
        }

        toastTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }

    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    if (btnCopyLinkedin && linkedinMessageText) {
        btnCopyLinkedin.addEventListener('click', () => {
            if (linkedinMessageText.value) {
                navigator.clipboard.writeText(linkedinMessageText.value).then(() => {
                    showToast('LinkedIn connection note copied!', 'success');
                }).catch(() => {
                    linkedinMessageText.select();
                    document.execCommand('copy');
                    showToast('LinkedIn connection note copied!', 'success');
                });
            } else {
                showToast('No LinkedIn message available to copy.', 'error');
            }
        });
    }

    // Initialize Page Data
    addContactBtn.addEventListener('click', () => openContactForm());
    loadConfig();
    loadContacts();
});
