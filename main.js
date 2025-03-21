document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const authorizeBtn = document.getElementById('authorize-btn');
    const submitBtn = document.getElementById('submit-btn');
    const platformSelect = document.getElementById('platform');
    const authSection = document.getElementById('auth-section');
    const qqAuthFields = document.getElementById('qq-auth-fields');
    const wechatAuthFields = document.getElementById('wechatAuthFields');
    const howToAuthLink = document.getElementById('how-to-auth');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const understandBtn = document.getElementById('understand-btn');
    const qqAuthGuide = document.getElementById('qq-auth-guide');
    const wechatAuthGuide = document.getElementById('wechat-auth-guide');
    const logContainer = document.getElementById('log-container');
    const connectionForm = document.getElementById('connection-form');

    // Initialize theme
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="bx bx-sun text-lg"></i>';
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.innerHTML = isDarkMode 
            ? '<i class="bx bx-sun text-lg"></i>' 
            : '<i class="bx bx-moon text-lg"></i>';
    });

    // Show authorization section
    authorizeBtn.addEventListener('click', function() {
        authSection.classList.remove('hidden');
        authSection.classList.add('fade-in');
        this.textContent = '更新授权信息';
        submitBtn.disabled = false;
        
        addLogEntry('准备授权连接...');
    });

    // Platform change handler
    platformSelect.addEventListener('change', function() {
        const platform = this.value;
        
        if (platform === 'qq') {
            qqAuthFields.classList.remove('hidden');
            wechatAuthFields.classList.add('hidden');
            qqAuthGuide.classList.remove('hidden');
            wechatAuthGuide.classList.add('hidden');
        } else {
            qqAuthFields.classList.add('hidden');
            wechatAuthFields.classList.remove('hidden');
            qqAuthGuide.classList.add('hidden');
            wechatAuthGuide.classList.remove('hidden');
        }
        
        addLogEntry(`已选择 ${platform === 'qq' ? 'QQ' : '微信'} 平台`);
    });

    // Modal handling
    howToAuthLink.addEventListener('click', function(e) {
        e.preventDefault();
        authModal.classList.remove('hidden');
        
        // Show guide based on selected platform
        const platform = platformSelect.value;
        if (platform === 'qq') {
            qqAuthGuide.classList.remove('hidden');
            wechatAuthGuide.classList.add('hidden');
        } else {
            qqAuthGuide.classList.add('hidden');
            wechatAuthGuide.classList.remove('hidden');
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    understandBtn.addEventListener('click', closeModal);

    function closeModal() {
        authModal.classList.add('hidden');
    }

    // Click outside modal to close
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Form submission
    connectionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('phone').value;
        const platform = platformSelect.value;
        const account = document.getElementById('account').value;
        const message = document.getElementById('message').value;
        
        // Validate phone number
        if (!validatePhoneNumber(phone)) {
            addLogEntry('手机号码格式不正确', 'error');
            return;
        }
        
        // Simulate API call
        submitBtn.disabled = true;
        submitBtn.textContent = '处理中...';
        
        addLogEntry('正在处理您的请求...');
        
        // Simulate API delay
        setTimeout(() => {
            processRequest(phone, platform, account, message);
        }, 1500);
    });

    function processRequest(phone, platform, account, message) {
        // Simulate API response with random success/failure
        const success = Math.random() > 0.3; // 70% success rate
        
        if (success) {
            addLogEntry(`成功向 ${phone} 关联的${platform === 'qq' ? 'QQ' : '微信'}发送好友请求`, 'success');
            
            // Simulating email sending
            if (platform === 'qq') {
                addLogEntry(`正在向 ${account}@qq.com 发送自定义邮件...`);
                
                setTimeout(() => {
                    addLogEntry('邮件发送成功！', 'success');
                    resetForm();
                }, 1000);
            } else {
                addLogEntry('微信好友请求已发送', 'success');
                resetForm();
            }
        } else {
            // Random failure reasons
            const errors = [
                'API调用失败，请稍后再试',
                '授权信息无效，请重新授权',
                '对方账号设置了隐私保护，无法添加',
                '网络连接不稳定，请检查网络'
            ];
            
            const errorMsg = errors[Math.floor(Math.random() * errors.length)];
            addLogEntry(errorMsg, 'error');
            
            submitBtn.disabled = false;
            submitBtn.textContent = '发送好友请求';
        }
    }

    function resetForm() {
        submitBtn.disabled = false;
        submitBtn.textContent = '发送好友请求';
        connectionForm.reset();
        authSection.classList.add('hidden');
    }

    function addLogEntry(message, type = 'info') {
        // Remove placeholder if exists
        const placeholder = logContainer.querySelector('.italic');
        if (placeholder) {
            logContainer.innerHTML = '';
        }
        
        const entry = document.createElement('div');
        entry.className = 'log-entry mb-2 text-sm fade-in';
        
        const timestamp = new Date().toLocaleTimeString();
        
        let statusDot = '';
        if (type === 'success') {
            statusDot = '<span class="status-dot status-success"></span>';
        } else if (type === 'error') {
            statusDot = '<span class="status-dot status-error"></span>';
        } else if (type === 'warning') {
            statusDot = '<span class="status-dot status-warning"></span>';
        } else {
            statusDot = '<span class="status-dot status-info"></span>';
        }
        
        entry.innerHTML = `${statusDot}<span class="font-geist-mono text-xs mr-2">[${timestamp}]</span> ${message}`;
        
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Initialize with default log
    addLogEntry('应用已初始化，等待操作...');
});
