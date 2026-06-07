document.addEventListener('DOMContentLoaded', () => {
    // State Data
    let contacts = [];
    let config = {};
    let uploadedFiles = []; // Absolute server paths of uploaded files
    let fileMeta = []; // File objects representing selected files
    
    // Elements Selection
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');
    
    // SMTP Settings Elements
    const smtpForm = document.getElementById('smtp-settings-form');
    const signatureForm = document.getElementById('sender-signature-form');
    const togglePassword = document.querySelector('.toggle-password');
    const smtpPassword = document.getElementById('sender_password');
    
    // Contacts Elements
    const searchInput = document.getElementById('search-contacts');
    const tableBody = document.getElementById('contacts-table-body');
    const addContactBtn = document.getElementById('btn-add-contact-modal');
    const contactModal = document.getElementById('modal-contact-form');
    const contactForm = document.getElementById('contact-form-data');
    const contactModalTitle = document.getElementById('contact-modal-title');
    const contactEditIndex = document.getElementById('contact-edit-index');
    
    // Campaign Selector Elements
    const templateSelect = document.getElementById('campaign-template');
    const dispatchRecipientsList = document.getElementById('dispatch-recipients-list');
    const previewRecipientSelect = document.getElementById('preview-recipient-select');
    const previewSubjectText = document.getElementById('preview-subject-text');
    const previewIframe = document.getElementById('preview-iframe');
    const selectAllRecipients = document.getElementById('select-all-recipients');
    const deselectAllRecipients = document.getElementById('deselect-all-recipients');
    const btnLaunchCampaign = document.getElementById('btn-start-campaign');

    // LinkedIn Elements
    const btnLinkedinSearch = document.getElementById('btn-linkedin-search');
    const linkedinMessageText = document.getElementById('linkedin-message-text');
    const btnCopyLinkedin = document.getElementById('btn-copy-linkedin');
    
    // File Upload Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadedFilesList = document.getElementById('uploaded-files-list');
    
    // Campaign Progress Modal Elements
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
            
            // Adjust title/desc based on tab
            if (tabId === 'campaigns') {
                pageTitle.textContent = 'Outreach Campaigns';
                pageDesc.textContent = 'Automate your health-tech partnership campaigns and internship outreach.';
            } else if (tabId === 'contacts') {
                pageTitle.textContent = 'Contacts Directory';
                pageDesc.textContent = 'Manage your healthcare organization and general outreach list.';
            } else if (tabId === 'config') {
                pageTitle.textContent = 'System Configuration';
                pageDesc.textContent = 'Configure SMTP credentials and email signatures.';
            }
        });
    });

    // ----------------------------------------------------
    // Password visibility toggle
    // ----------------------------------------------------
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = smtpPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            smtpPassword.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // ----------------------------------------------------
    // Data Loading & API Calls
    // ----------------------------------------------------
    async function loadConfig() {
        try {
            const res = await fetch('/api/config');
            config = await res.json();
            
            // Fill forms
            document.getElementById('smtp_server').value = config.smtp_server || '';
            document.getElementById('port').value = config.port || 465;
            document.getElementById('sender_email').value = config.sender_email || '';
            document.getElementById('sender_password').value = config.sender_password || '';
            
            document.getElementById('sender_name').value = config.sender_name || '';
            document.getElementById('sender_phone').value = config.sender_phone || '';
            document.getElementById('linkedin_url').value = config.linkedin_url || '';
            
            // Update sidebar profile card
            document.getElementById('sidebar-sender-name').textContent = config.sender_name || 'Fathy Sharaf';
        } catch (err) {
            showToast('Error loading configuration', 'error');
        }
    }

    async function loadContacts() {
        try {
            const res = await fetch('/api/contacts');
            contacts = await res.json();
            renderContactsTable(contacts);
            populateCampaignRecipients();
            updateLivePreview();
        } catch (err) {
            showToast('Error loading contacts list', 'error');
        }
    }

    // ----------------------------------------------------
    // Contacts Directory Management
    // ----------------------------------------------------
    function renderContactsTable(list) {
        tableBody.innerHTML = '';
        if (list.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No contacts found. Click 'Add Recipient' to start.</td></tr>`;
            return;
        }
        
        list.forEach((c, index) => {
            const tr = document.createElement('tr');
            
            // Map categories to badges
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

        // Add action listeners
        tableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                openContactForm(idx);
            });
        });

        tableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                deleteContact(idx);
            });
        });
    }

    // Search filter contacts
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

    // Open Contact Modal for Create or Edit
    function openContactForm(index = null) {
        contactModal.classList.add('active');
        if (index !== null) {
            // Edit mode
            contactModalTitle.textContent = 'Edit Recipient';
            contactEditIndex.value = index;
            const c = contacts[index];
            document.getElementById('c_company_name').value = c.company_name;
            document.getElementById('c_contact_person').value = c.contact_person;
            document.getElementById('c_email').value = c.email;
            document.getElementById('c_category').value = c.category;
            document.getElementById('c_notes').value = c.notes || '';
        } else {
            // Add mode
            contactModalTitle.textContent = 'Add New Recipient';
            contactEditIndex.value = '';
            contactForm.reset();
        }
    }

    // Delete contact
    async function deleteContact(index) {
        if (confirm(`Are you sure you want to delete ${contacts[index].company_name}?`)) {
            contacts.splice(index, 1);
            await saveContactsToServer();
            showToast('Recipient removed successfully', 'success');
        }
    }

    // Close contact modal
    document.querySelectorAll('.close-modal-trigger').forEach(el => {
        el.addEventListener('click', () => {
            contactModal.classList.remove('active');
        });
    });

    // Save Contact from form
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const index = contactEditIndex.value;
        const newContact = {
            company_name: document.getElementById('c_company_name').value,
            contact_person: document.getElementById('c_contact_person').value,
            email: document.getElementById('c_email').value,
            category: document.getElementById('c_category').value,
            notes: document.getElementById('c_notes').value
        };

        if (index !== '') {
            contacts[index] = newContact;
        } else {
            contacts.push(newContact);
        }

        await saveContactsToServer();
        contactModal.classList.remove('active');
        showToast('Recipient saved successfully!', 'success');
    });

    async function saveContactsToServer() {
        try {
            await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contacts)
            });
            await loadContacts();
        } catch (err) {
            showToast('Error saving contacts to server', 'error');
        }
    }

    // ----------------------------------------------------
    // Save Settings Forms
    // ----------------------------------------------------
    smtpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newConfig = {
            ...config,
            smtp_server: document.getElementById('smtp_server').value,
            port: parseInt(document.getElementById('port').value),
            sender_email: document.getElementById('sender_email').value,
            sender_password: document.getElementById('sender_password').value
        };
        await saveConfigToServer(newConfig);
    });

    signatureForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newConfig = {
            ...config,
            sender_name: document.getElementById('sender_name').value,
            sender_phone: document.getElementById('sender_phone').value,
            linkedin_url: document.getElementById('linkedin_url').value
        };
        await saveConfigToServer(newConfig);
        document.getElementById('sidebar-sender-name').textContent = newConfig.sender_name;
    });

    async function saveConfigToServer(newConfig) {
        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig)
            });
            const data = await res.json();
            if (data.status === 'success') {
                config = newConfig;
                showToast(data.message, 'success');
                updateLivePreview(); // updates Preview metadata if template details changed
            }
        } catch (err) {
            showToast('Error saving configurations', 'error');
        }
    }

    // ----------------------------------------------------
    // Campaign Tab Management (Recipients list & Previews)
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
            // Populate selector checklist
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

            // Populate preview dropdown
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = `${c.company_name} (${c.category})`;
            previewRecipientSelect.appendChild(opt);
        });

        // Re-attach listeners for checkboxes to update preview list or other triggers
        document.querySelectorAll('.recipient-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                // optional
            });
        });
    }

    selectAllRecipients.addEventListener('click', () => {
        document.querySelectorAll('.recipient-checkbox').forEach(cb => cb.checked = true);
    });

    deselectAllRecipients.addEventListener('click', () => {
        document.querySelectorAll('.recipient-checkbox').forEach(cb => cb.checked = false);
    });

    // Update live preview dynamically when template or preview recipient changes
    async function updateLivePreview() {
        if (contacts.length === 0 || previewRecipientSelect.value === 'none') {
            previewSubjectText.textContent = '(No subject)';
            previewIframe.srcdoc = '<div style="font-family:sans-serif; color:#666; padding:20px; text-align:center;">Add a recipient and configure the campaign to view the preview.</div>';
            return;
        }

        const selectedIndex = parseInt(previewRecipientSelect.value);
        if (isNaN(selectedIndex) || selectedIndex >= contacts.length) return;
        
        const recipient = contacts[selectedIndex];
        const templateType = templateSelect.value;

        try {
            const res = await fetch('/api/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template_type: templateType,
                    recipient_name: recipient.contact_person,
                    category: recipient.category,
                    company_name: recipient.company_name,
                    sender_name: config.sender_name || 'Fathy Sharaf',
                    sender_phone: config.sender_phone || '01002137288',
                    sender_email: config.sender_email || 'fathysaraf1@gmail.com',
                    linkedin_url: config.linkedin_url || ''
                })
            });
            const data = await res.json();
            previewSubjectText.textContent = data.subject;
            previewIframe.srcdoc = data.html_body;
            
            // Update LinkedIn elements
            if (btnLinkedinSearch) btnLinkedinSearch.href = data.linkedin_search_url || '#';
            if (linkedinMessageText) linkedinMessageText.value = data.linkedin_message || '';
        } catch (err) {
            console.error('Error fetching preview:', err);
        }
    }

    templateSelect.addEventListener('change', updateLivePreview);
    previewRecipientSelect.addEventListener('change', updateLivePreview);

    // ----------------------------------------------------
    // Drag & Drop File Uploads
    // ----------------------------------------------------
    // Trigger hidden file input on browse click
    dropZone.querySelector('.file-select-trigger').addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag-over styling classes
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleSelectedFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleSelectedFiles(e.target.files);
        }
    });

    async function handleSelectedFiles(filesList) {
        const formData = new FormData();
        for (let i = 0; i < filesList.length; i++) {
            formData.append('files', filesList[i]);
            fileMeta.push(filesList[i]);
        }

        showToast('Uploading attachments...', 'info');
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.status === 'success') {
                uploadedFiles = uploadedFiles.concat(data.files);
                renderUploadedFiles();
                showToast('Files uploaded successfully!', 'success');
            } else {
                showToast(data.message, 'error');
            }
        } catch (err) {
            showToast('Failed to upload files', 'error');
        }
    }

    function renderUploadedFiles() {
        uploadedFilesList.innerHTML = '';
        uploadedFiles.forEach((path, idx) => {
            const name = path.split('\\').pop().split('/').pop();
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = `
                <span><i class="fa-solid fa-paperclip" style="color: #3b82f6; margin-right:8px;"></i> ${escapeHtml(name)}</span>
                <i class="fa-solid fa-xmark remove-file-trigger" data-index="${idx}"></i>
            `;
            uploadedFilesList.appendChild(item);
        });

        // Bind delete files trigger
        uploadedFilesList.querySelectorAll('.remove-file-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(trigger.getAttribute('data-index'));
                uploadedFiles.splice(idx, 1);
                fileMeta.splice(idx, 1);
                renderUploadedFiles();
            });
        });
    }

    // ----------------------------------------------------
    // Launching Campaign Dispatch Flow
    // ----------------------------------------------------
    btnLaunchCampaign.addEventListener('click', async () => {
        // Collect checked recipients
        const checkedBoxes = document.querySelectorAll('.recipient-checkbox:checked');
        if (checkedBoxes.length === 0) {
            showToast('Please select at least one recipient.', 'error');
            return;
        }

        if (!config.sender_password) {
            showToast('Please configure your Gmail App Password in Settings tab first.', 'error');
            return;
        }

        const selectedRecipients = Array.from(checkedBoxes).map(cb => {
            return contacts[parseInt(cb.value)];
        });

        // Initialize progress UI
        progressModal.classList.add('active');
        modalFooter.style.display = 'none';
        progressFill.style.width = '0%';
        progressPct.textContent = '0%';
        dispatchLogs.innerHTML = '';
        
        appendLog('🚀 Campaign initialized...', 'info');
        appendLog(`Preparing to send ${selectedRecipients.length} outreach emails...`, 'info');

        let successCount = 0;
        let failCount = 0;
        const total = selectedRecipients.length;
        const reportLogs = [];

        const templateType = templateSelect.value;
        const senderName = config.sender_name || 'Fathy Sharaf';
        const senderPhone = config.sender_phone || '01002137288';
        const senderEmail = config.sender_email || 'fathysaraf1@gmail.com';
        const linkedinUrl = config.linkedin_url || '';

        // Dispatch sequence
        for (let i = 0; i < total; i++) {
            const recipient = selectedRecipients[i];
            appendLog(`[${i+1}/${total}] Generating layout for ${recipient.company_name}...`, 'info');

            // 1. Fetch Customized Preview Payload
            let emailData;
            try {
                const res = await fetch('/api/preview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        template_type: templateType,
                        recipient_name: recipient.contact_person,
                        category: recipient.category,
                        company_name: recipient.company_name,
                        sender_name: senderName,
                        sender_phone: senderPhone,
                        sender_email: senderEmail,
                        linkedin_url: linkedinUrl
                    })
                });
                emailData = await res.json();
            } catch (err) {
                appendLog(`Failed to parse preview metadata for ${recipient.company_name}. Skipping.`, 'error');
                failCount++;
                reportLogs.push({ company: recipient.company_name, email: recipient.email, status: 'Failed', details: 'Preview API error' });
                updateProgress(i + 1, total);
                continue;
            }

            // 2. Dispatch Send Email Request
            appendLog(`Sending outreach email to ${recipient.company_name} (${recipient.email})...`, 'info');
            try {
                const sendRes = await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recipient_email: recipient.email,
                        subject: emailData.subject,
                        html_body: emailData.html_body,
                        plain_body: emailData.plain_body,
                        attachment_paths: uploadedFiles
                    })
                });
                const sendData = await sendRes.json();
                
                if (sendData.status === 'success') {
                    appendLog(`✅ Email successfully delivered to ${recipient.company_name}!`, 'success');
                    successCount++;
                    reportLogs.push({ company: recipient.company_name, email: recipient.email, status: 'Success', details: 'Sent successfully' });
                } else {
                    appendLog(`❌ Delivery failed to ${recipient.company_name}: ${sendData.message}`, 'error');
                    failCount++;
                    reportLogs.push({ company: recipient.company_name, email: recipient.email, status: 'Failed', details: sendData.message });
                }
            } catch (err) {
                appendLog(`❌ Delivery connection error to ${recipient.company_name}`, 'error');
                failCount++;
                reportLogs.push({ company: recipient.company_name, email: recipient.email, status: 'Failed', details: 'Connection error' });
            }

            updateProgress(i + 1, total);
            // Wait brief pause to avoid SMTP rate throttling
            await new Promise(r => setTimeout(r, 1500));
        }

        // Complete campaign
        appendLog('--------------------------------------------', 'info');
        appendLog(`Campaign complete! Success: ${successCount}, Failures: ${failCount}.`, 'info');
        showToast(`Campaign dispatch finished. (${successCount} Sent, ${failCount} Failed)`, successCount > 0 ? 'success' : 'error');

        // Compile client download CSV report file data URL
        const csvContent = generateReportCSV(reportLogs);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        btnDownloadReport.href = url;
        btnDownloadReport.download = `delivery_report_${new Date().toISOString().slice(0, 10)}.csv`;

        // Clean temp uploads
        fetch('/api/clean-temp', { method: 'POST' });
        uploadedFiles = [];
        fileMeta = [];
        renderUploadedFiles();

        // Display Close options
        modalFooter.style.display = 'flex';
    });

    btnCloseProgress.addEventListener('click', () => {
        progressModal.classList.remove('active');
    });

    function updateProgress(curr, total) {
        const pct = Math.round((curr / total) * 100);
        progressFill.style.width = `${pct}%`;
        progressPct.textContent = `${pct}%`;
    }

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

        if (!config.sender_password) {
            showToast('Please configure SMTP app password first', 'error');
            return;
        }

        showToast('Sending test email...', 'info');
        try {
            // Preview a test message content
            const previewRes = await fetch('/api/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template_type: 'SuperBrain Partnership Outreach',
                    recipient_name: 'مدير التجربة والاختبار',
                    category: 'General',
                    company_name: 'Test Healthcare Org',
                    sender_name: config.sender_name || 'Fathy Sharaf',
                    sender_phone: config.sender_phone || '01002137288',
                    sender_email: config.sender_email || 'fathysaraf1@gmail.com',
                    linkedin_url: config.linkedin_url || ''
                })
            });
            const data = await previewRes.json();

            const sendRes = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipient_email: testEmail,
                    subject: `[TEST] ${data.subject}`,
                    html_body: data.html_body,
                    plain_body: data.plain_body,
                    attachment_paths: []
                })
            });
            const sendData = await sendRes.json();
            if (sendData.status === 'success') {
                showToast('Test email sent successfully!', 'success');
            } else {
                showToast(`Failed: ${sendData.message}`, 'error');
            }
        } catch (err) {
            showToast('Error sending test email', 'error');
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

    // Initialize Page Data
    addContactBtn.addEventListener('click', () => openContactForm());
    
    if (btnCopyLinkedin && linkedinMessageText) {
        btnCopyLinkedin.addEventListener('click', () => {
            if (linkedinMessageText.value) {
                navigator.clipboard.writeText(linkedinMessageText.value).then(() => {
                    showToast('LinkedIn connection note copied!', 'success');
                }).catch(() => {
                    // Fallback
                    linkedinMessageText.select();
                    document.execCommand('copy');
                    showToast('LinkedIn connection note copied!', 'success');
                });
            } else {
                showToast('No LinkedIn message available to copy.', 'error');
            }
        });
    }

    loadConfig();
    loadContacts();
});
