import os
import json
import pandas as pd
import streamlit as st
import streamlit.components.v1 as components
from email_sender import get_superbrain_body, get_internship_body, get_hapticvision_sponsorship_body, send_email

# Set page configuration with a premium look
st.set_page_config(
    page_title="SuperBrain Outreach & Automation Hub",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom premium styling (Glassmorphism & Harmonious Dark/Blue theme)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Outfit:wght@300;400;600;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    .main-title {
        font-family: 'Outfit', sans-serif;
        background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        font-size: 3rem;
        margin-bottom: 0.5rem;
    }
    
    .sub-title {
        font-size: 1.1rem;
        color: #657786;
        margin-bottom: 2rem;
    }
    
    .stButton>button {
        background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 24px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 114, 255, 0.25);
    }
    
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 114, 255, 0.4);
        background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
        color: white;
    }
    
    .card {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid #e1e8ed;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
        margin-bottom: 1.5rem;
    }
    
    .info-box {
        border-right: 5px solid #0072ff;
        background: #f0f7ff;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Helper to manage local configurations
CONFIG_FILE = "config.json"

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "smtp_server": "smtp.gmail.com",
        "port": 465,
        "sender_email": "fathysaraf1@gmail.com",
        "sender_password": "",
        "sender_name": "Fathy Sharaf",
        "sender_phone": "01002137288",
        "linkedin_url": "https://www.linkedin.com/in/fathysharaf/"
    }

def save_config(config):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=4)

# Load current config and contacts
config = load_config()

CONTACTS_FILE = "contacts.csv"

def load_contacts():
    if os.path.exists(CONTACTS_FILE):
        return pd.read_csv(CONTACTS_FILE)
    else:
        # Fallback template
        data = {
            "company_name": ["NAID", "Baseera", "NBE", "Siemens", "General Hospital"],
            "contact_person": ["المسؤول في الأكاديمية الوطنية", "المسؤول في جمعية بصيرة", "مسؤول المسؤولية المجتمعية بالبنك الأهلي", "CSR Representative", "مدير المستشفى الموقر"],
            "email": ["info@naid.gov.eg", "info@baseera.org.eg", "csr@nbe.com.eg", "csr.eg@siemens.com", "info@healthcare-example.com"],
            "category": ["NAID", "Baseera", "CSR", "CSR", "General"],
            "notes": ["National Academy", "Baseera Association", "National Bank of Egypt", "Siemens Egypt", "General Hospital"]
        }
        df = pd.DataFrame(data)
        df.to_csv(CONTACTS_FILE, index=False)
        return df

contacts_df = load_contacts()

# Header Layout
st.markdown('<div class="main-title">🧠 SuperBrain & Internship Outreach Hub</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Automate your health-tech partnership campaigns and internship outreach with high-impact, tailored emails.</div>', unsafe_allow_html=True)

# Sidebar - Settings & SMTP Credentials
st.sidebar.markdown("### ⚙️ Sender Settings & SMTP")
smtp_server = st.sidebar.text_input("SMTP Server", value=config.get("smtp_server", "smtp.gmail.com"))
port = st.sidebar.number_input("Port", min_value=1, max_value=65535, value=config.get("port", 465))
sender_email = st.sidebar.text_input("Sender Email", value=config.get("sender_email", "fathysaraf1@gmail.com"))
sender_password = st.sidebar.text_input("Gmail App Password", value=config.get("sender_password", ""), type="password")

st.sidebar.markdown("""
<div style="font-size:0.85rem; color:#657786; background-color:#fff3cd; padding:10px; border-left:4px solid #ffc107; border-radius:4px;">
    <strong>💡 App Password is Required:</strong><br>
    Since Google blocked normal passwords for SMTP, you must generate an <strong>App Password</strong>:
    <ol style="margin-top:5px; padding-left:15px;">
        <li>Go to Google Account -> Security</li>
        <li>Enable 2-Step Verification</li>
        <li>Search for "App Passwords"</li>
        <li>Select 'Mail' and 'Other' (name it SuperBrain), copy the 16-character code here.</li>
    </ol>
</div>
""", unsafe_allow_html=True)

st.sidebar.markdown("### 📄 Sender Signature Details")
sender_name = st.sidebar.text_input("Full Name", value=config.get("sender_name", "Fathy Sharaf"))
sender_phone = st.sidebar.text_input("Phone Number", value=config.get("sender_phone", "01002137288"))
linkedin_url = st.sidebar.text_input("LinkedIn Profile URL", value=config.get("linkedin_url", "https://www.linkedin.com/in/fathysharaf/"))

# Upload attachments
st.sidebar.markdown("### 📎 Attachments")
uploaded_files = st.sidebar.file_uploader("Upload Pitch Deck or CV (Multiple allowed)", accept_multiple_files=True)

if st.sidebar.button("💾 Save Settings"):
    new_config = {
        "smtp_server": smtp_server,
        "port": port,
        "sender_email": sender_email,
        "sender_password": sender_password,
        "sender_name": sender_name,
        "sender_phone": sender_phone,
        "linkedin_url": linkedin_url
    }
    save_config(new_config)
    st.sidebar.success("Settings saved locally!")

# Main Tabs
tab1, tab2, tab3 = st.tabs(["👥 Contacts Directory", "👁️ Live Preview & Customization", "🚀 Email Dispatcher"])

# Tab 1: Contacts Directory
with tab1:
    st.markdown("### 👥 Manage Contacts Directory")
    st.write("Edit contact details directly inside the table. Click 'Save Changes' to commit updates.")
    
    # Editable DataFrame
    edited_df = st.data_editor(
        contacts_df,
        num_rows="dynamic",
        use_container_width=True,
        column_config={
            "category": st.column_config.SelectboxColumn(
                "Category",
                help="Template categorization (affects email content)",
                options=["NAID", "Baseera", "CSR", "General"],
                required=True
            ),
            "email": st.column_config.TextColumn(
                "Email Address",
                required=True
            ),
            "company_name": st.column_config.TextColumn(
                "Company / Organization",
                required=True
            )
        }
    )
    
    col1, col2 = st.columns([1, 5])
    with col1:
        if st.button("💾 Save Changes"):
            edited_df.to_csv(CONTACTS_FILE, index=False)
            st.success("Contacts list updated successfully!")
            contacts_df = edited_df

# Tab 2: Live Preview
with tab2:
    st.markdown("### 👁️ Email Template Live Preview")
    
    # Template Selection
    template_type = st.selectbox(
        "Choose Email Campaign Template",
        ["SuperBrain Partnership Outreach", "HapticVision Sponsorship (English)", "Summer Internship Application"]
    )
    
    # Recipient Selection for Preview
    preview_recipient = st.selectbox(
        "Select Organization to Preview Customization",
        contacts_df["company_name"].tolist() if not contacts_df.empty else ["None"]
    )
    
    if not contacts_df.empty and preview_recipient != "None":
        recipient_row = contacts_df[contacts_df["company_name"] == preview_recipient].iloc[0]
        recip_name = recipient_row["contact_person"]
        recip_cat = recipient_row["category"]
        recip_email = recipient_row["email"]
        
        # Build Subject and Body based on choice
        if template_type == "SuperBrain Partnership Outreach":
            subject = f"طلب شراكة / دعم لمشروع تقنية مساعدة مبتكرة للمكفوفين وضعاف البصر في مصر – SuperBrain"
            html_body, plain_body = get_superbrain_body(
                recipient_name=recip_name,
                category=recip_cat,
                sender_name=sender_name,
                sender_phone=sender_phone,
                sender_email=sender_email,
                linkedin_url=linkedin_url
            )
        elif template_type == "HapticVision Sponsorship (English)":
            subject = "Sponsorship Request: HapticVision Graduation Project – Innovative Assistive Technology for the Visually Impaired"
            html_body, plain_body = get_hapticvision_sponsorship_body(
                recipient_name=recip_name,
                company_name=recipient_row["company_name"],
                category=recip_cat,
                sender_name=sender_name,
                sender_phone=sender_phone,
                sender_email=sender_email,
                linkedin_url=linkedin_url
            )
        else:
            subject = f"طلب تدريب صيفي - Summer Internship Application - {sender_name}"
            html_body, plain_body = get_internship_body(
                recipient_name=recip_name,
                sender_name=sender_name,
                sender_phone=sender_phone,
                sender_email=sender_email,
                linkedin_url=linkedin_url
            )
            
        st.markdown(f"**Subject:** `{subject}`")
        st.markdown(f"**Recipient Email:** `{recip_email}`")
        
        # Show uploaded files list if any
        if uploaded_files:
            file_names = ", ".join([f.name for f in uploaded_files])
            st.markdown(f"📎 **Attached Files:** `{file_names}`")
        
        # Display styled iframe for the email
        st.markdown("---")
        st.markdown("##### 📧 HTML Email Preview")
        components.html(html_body, height=550, scrolling=True)
        
        with st.expander("📝 View Plain Text Version (Fallback)"):
            st.code(plain_body, language="text")

# Tab 3: Dispatcher
with tab3:
    st.markdown("### 🚀 Dispatch Campaign")
    st.write("Ready to send? Here is a breakdown of your current outreach queue:")
    
    # Show active configurations checklist
    errors = []
    if not sender_email:
        errors.append("❌ Sender Email is missing in Sidebar.")
    if not sender_password:
        errors.append("⚠️ Gmail App Password is missing in Sidebar (necessary for live sending).")
    if contacts_df.empty:
        errors.append("❌ Recipient list is empty. Add contacts first in Tab 1.")
        
    if errors:
        for err in errors:
            st.markdown(err)
    else:
        st.success("✅ Configuration validation passed. Ready to start!")
        
    # Render queue table
    queue_df = contacts_df.copy()
    queue_df["Campaign Type"] = template_type
    st.dataframe(queue_df[["company_name", "contact_person", "email", "category", "Campaign Type"]], use_container_width=True)
    
    # Send button
    if st.button("🚀 Start Bulk Sending", disabled=len(errors) > 0 and not sender_password):
        # Save any temporary files uploaded
        temp_paths = []
        if uploaded_files:
            os.makedirs("temp_attachments", exist_ok=True)
            for f in uploaded_files:
                path = os.path.join("temp_attachments", f.name)
                with open(path, "wb") as temp_file:
                    temp_file.write(f.getbuffer())
                temp_paths.append(path)

        st.markdown("---")
        st.markdown("#### Progress Status")
        progress_bar = st.progress(0.0)
        status_text = st.empty()
        
        results = []
        total_emails = len(contacts_df)
        
        for idx, row in contacts_df.iterrows():
            recip_name = row["contact_person"]
            recip_cat = row["category"]
            recip_email = row["email"]
            comp_name = row["company_name"]
            
            # Generate email
            if template_type == "SuperBrain Partnership Outreach":
                subj = f"طلب شراكة / دعم لمشروع تقنية مساعدة مبتكرة للمكفوفين وضعاف البصر في مصر – SuperBrain"
                h_body, p_body = get_superbrain_body(
                    recipient_name=recip_name,
                    category=recip_cat,
                    sender_name=sender_name,
                    sender_phone=sender_phone,
                    sender_email=sender_email,
                    linkedin_url=linkedin_url
                )
            elif template_type == "HapticVision Sponsorship (English)":
                subj = "Sponsorship Request: HapticVision Graduation Project – Innovative Assistive Technology for the Visually Impaired"
                h_body, p_body = get_hapticvision_sponsorship_body(
                    recipient_name=recip_name,
                    company_name=comp_name,
                    category=recip_cat,
                    sender_name=sender_name,
                    sender_phone=sender_phone,
                    sender_email=sender_email,
                    linkedin_url=linkedin_url
                )
            else:
                subj = f"طلب تدريب صيفي - Summer Internship Application - {sender_name}"
                h_body, p_body = get_internship_body(
                    recipient_name=recip_name,
                    sender_name=sender_name,
                    sender_phone=sender_phone,
                    sender_email=sender_email,
                    linkedin_url=linkedin_url
                )
                
            status_text.text(f"Sending to {comp_name} ({recip_email})...")
            
            # Send
            success, msg = send_email(
                smtp_server=smtp_server,
                port=port,
                sender_email=sender_email,
                sender_password=sender_password,
                recipient_email=recip_email,
                subject=subj,
                html_body=h_body,
                plain_body=p_body,
                attachment_paths=temp_paths if temp_paths else None
            )
            
            results.append({
                "Company": comp_name,
                "Email": recip_email,
                "Status": "✅ Sent" if success else "❌ Failed",
                "Details": msg
            })
            
            # Update progress
            progress_bar.progress((idx + 1) / total_emails)
            
        status_text.text("Campaign Finished!")
        
        # Display Report
        report_df = pd.DataFrame(results)
        st.dataframe(report_df, use_container_width=True)
        
        # Save Report
        report_file = "delivery_report.csv"
        report_df.to_csv(report_file, index=False)
        st.success(f"Report saved to `{report_file}`.")
        
        # Download button
        with open(report_file, "r", encoding="utf-8") as rf:
            st.download_button(
                label="📥 Download Delivery Report (CSV)",
                data=rf.read(),
                file_name="delivery_report.csv",
                mime="text/csv"
            )
            
        # Clean up temp files
        if temp_paths:
            for path in temp_paths:
                try:
                    os.remove(path)
                except Exception:
                    pass
            try:
                os.rmdir("temp_attachments")
            except Exception:
                pass
