import os
import json
import pandas as pd
from flask import Flask, request, jsonify, render_template, send_from_directory
from werkzeug.utils import secure_filename
from email_sender import get_superbrain_body, get_internship_body, get_hapticvision_sponsorship_body, send_email

app = Flask(__name__, static_folder='static', template_folder='templates')
UPLOAD_FOLDER = 'temp_uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CONFIG_FILE = "config.json"
CONTACTS_FILE = "contacts.csv"

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

def save_config(config_data):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config_data, f, indent=4)

def load_contacts():
    if os.path.exists(CONTACTS_FILE):
        return pd.read_csv(CONTACTS_FILE).to_dict(orient='records')
    else:
        # Create template CSV if missing
        data = {
            "company_name": ["NAID", "Baseera", "NBE", "Siemens", "General Hospital"],
            "contact_person": ["المسؤول في الأكاديمية الوطنية", "المسؤول في جمعية بصيرة", "مسؤول المسؤولية المجتمعية بالبنك الأهلي", "CSR Representative", "مدير المستشفى الموقر"],
            "email": ["info@naid.gov.eg", "info@baseera.org.eg", "csr@nbe.com.eg", "csr.eg@siemens.com", "info@healthcare-example.com"],
            "category": ["NAID", "Baseera", "CSR", "CSR", "General"],
            "notes": ["National Academy", "Baseera Association", "National Bank of Egypt", "Siemens Egypt", "General Hospital"]
        }
        df = pd.DataFrame(data)
        df.to_csv(CONTACTS_FILE, index=False)
        return df.to_dict(orient='records')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/config', methods=['GET', 'POST'])
def api_config():
    if request.method == 'GET':
        return jsonify(load_config())
    else:
        data = request.json
        save_config(data)
        return jsonify({"status": "success", "message": "Configuration saved!"})

@app.route('/api/contacts', methods=['GET', 'POST'])
def api_contacts():
    if request.method == 'GET':
        return jsonify(load_contacts())
    else:
        contacts = request.json
        df = pd.DataFrame(contacts)
        df.to_csv(CONTACTS_FILE, index=False)
        return jsonify({"status": "success", "message": "Contacts saved!"})

@app.route('/api/upload', methods=['POST'])
def api_upload():
    if 'files' not in request.files:
        return jsonify({"status": "error", "message": "No files uploaded"}), 400
    
    files = request.files.getlist('files')
    uploaded_paths = []
    
    for file in files:
        if file.filename:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            uploaded_paths.append(filepath)
            
    return jsonify({"status": "success", "files": uploaded_paths})

@app.route('/api/preview', methods=['POST'])
def api_preview():
    data = request.json
    template_type = data.get('template_type')
    recipient_name = data.get('recipient_name')
    category = data.get('category')
    
    sender_name = data.get('sender_name', 'Fathy Sharaf')
    sender_phone = data.get('sender_phone', '01002137288')
    sender_email = data.get('sender_email', 'Fathyahmed123456.o@gmail.com')
    linkedin_url = data.get('linkedin_url', '')

    company_name = data.get('company_name', '')

    if template_type == "SuperBrain Partnership Outreach":
        subject = "طلب شراكة / دعم لمشروع تقنية مساعدة مبتكرة للمكفوفين وضعاف البصر في مصر – SuperBrain"
        html_body, plain_body = get_superbrain_body(
            recipient_name=recipient_name,
            category=category,
            sender_name=sender_name,
            sender_phone=sender_phone,
            sender_email=sender_email,
            linkedin_url=linkedin_url
        )
    elif template_type == "HapticVision Sponsorship (English)":
        subject = "Sponsorship Request: HapticVision Graduation Project – Innovative Assistive Technology for the Visually Impaired"
        html_body, plain_body = get_hapticvision_sponsorship_body(
            recipient_name=recipient_name,
            company_name=company_name,
            category=category,
            sender_name=sender_name,
            sender_phone=sender_phone,
            sender_email=sender_email,
            linkedin_url=linkedin_url
        )
    else:
        subject = f"طلب تدريب صيفي - Summer Internship Application - {sender_name}"
        html_body, plain_body = get_internship_body(
            recipient_name=recipient_name,
            sender_name=sender_name,
            sender_phone=sender_phone,
            sender_email=sender_email,
            linkedin_url=linkedin_url
        )
        
    # Generate LinkedIn Connection Message
    linkedin_msg = f"Hi,\nI hope you are doing well.\n\nMy name is {sender_name}, a Software Engineer and Team Lead for HapticVision, a graduation project developing a wearable headset that scans surroundings and translates them into haptic feedback on the forehead for blind individuals in Egypt.\n\nGiven your role at {company_name}, I would love to connect and briefly discuss potential CSR sponsorship or piloting opportunities to support assistive tech innovation.\n\nBest regards,\n{sender_name}\n{sender_phone}"
    
    # LinkedIn Search Query URL
    linkedin_search_url = f"https://www.linkedin.com/search/results/people/?keywords={company_name.replace(' ', '%20')}%20CSR%20Partnership"

    return jsonify({
        "subject": subject,
        "html_body": html_body,
        "plain_body": plain_body,
        "linkedin_message": linkedin_msg,
        "linkedin_search_url": linkedin_search_url
    })

@app.route('/api/send', methods=['POST'])
def api_send():
    data = request.json
    recipient_email = data.get('recipient_email')
    subject = data.get('subject')
    html_body = data.get('html_body')
    plain_body = data.get('plain_body')
    attachment_paths = data.get('attachment_paths', [])
    
    config_data = load_config()
    smtp_server = config_data.get('smtp_server', 'smtp.gmail.com')
    port = config_data.get('port', 465)
    sender_email = config_data.get('sender_email', 'Fathyahmed123456.o@gmail.com')
    sender_password = config_data.get('sender_password', '')
    
    if not sender_password:
        return jsonify({"status": "error", "message": "SMTP password is not configured."}), 400

    success, msg = send_email(
        smtp_server=smtp_server,
        port=port,
        sender_email=sender_email,
        sender_password=sender_password,
        recipient_email=recipient_email,
        subject=subject,
        html_body=html_body,
        plain_body=plain_body,
        attachment_paths=attachment_paths if attachment_paths else None
    )
    
    if success:
        return jsonify({"status": "success", "message": "Email sent successfully!"})
    else:
        return jsonify({"status": "error", "message": msg}), 500

@app.route('/api/clean-temp', methods=['POST'])
def api_clean_temp():
    # Remove files in upload directory
    for f in os.listdir(UPLOAD_FOLDER):
        filepath = os.path.join(UPLOAD_FOLDER, f)
        try:
            if os.path.isfile(filepath):
                os.remove(filepath)
        except Exception:
            pass
    return jsonify({"status": "success", "message": "Temp directory cleaned!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
