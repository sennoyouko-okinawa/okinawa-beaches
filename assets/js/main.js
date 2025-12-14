let beaches = [];
let currentLanguage = 'zh'; // 'zh' for Chinese, 'ja' for Japanese

// 初始化
function initPage() {
    // 根据当前页面确定语言
    if (window.location.pathname.includes('-jp')) {
        currentLanguage = 'ja';
    } else {
        currentLanguage = 'zh';
    }
    
    renderTable(beaches);
    setupEventListeners();
    setupLanguageToggle();
}

document.addEventListener('DOMContentLoaded', function () {
    // 根据当前页面确定语言
    if (window.location.pathname.includes('-jp')) {
        currentLanguage = 'ja';
    } else {
        currentLanguage = 'zh';
    }
    loadBeachesData(currentLanguage);
});

function loadBeachesData(language = 'zh') {
    const dataFile = language === 'ja' ? 'assets/js/beaches_ja.json' : 'assets/js/beaches.json';
    fetch(dataFile)
        .then(response => response.json())
        .then(data => {
            beaches = data;
            initPage();
        })
        .catch(err => {
            console.error('海滩数据加载失败:', err);
            beaches = [];
            initPage();
        });
}

// 渲染表格
function renderTable(data) {
    const tbody = document.getElementById('beachTableBody');
    const countElement = document.getElementById('beachCount');
    const noResultsElement = document.getElementById('noResults');

    if (data.length === 0) {
        tbody.innerHTML = '';
        countElement.textContent = '0';
        noResultsElement.style.display = 'block';
        return;
    }

    noResultsElement.style.display = 'none';
    countElement.textContent = data.length;

    let html = '';

    data.forEach(beach => {
        html += `
            <tr>
                <td>
                    <div class="beach-name">${beach.name}</div>
                </td>
                <td>
                    <div>${beach.address}</div>
                    <i class="fas fa-map-marker-alt" style="color: #1e88e5; margin-right: 5px;"></i>
                    <small>${currentLanguage === 'zh' ? '冲绳' : '沖縄'}</small>
                </td>
                <td>
                    <div class="open-time">${beach.open_time}</div>
                </td>
                <td class="icon-cell">
                    ${beach.has_lifeguard
            ? `<span class="badge badge-yes"><i class="fas fa-check"></i> ${currentLanguage === 'zh' ? '有' : 'あり'}</span>`
            : `<span class="badge badge-no"><i class="fas fa-times"></i> ${currentLanguage === 'zh' ? '无' : 'なし'}</span>`}
                </td>
                <td class="icon-cell">
                    ${beach.has_shower
            ? `<span class="badge badge-yes"><i class="fas fa-check"></i> ${currentLanguage === 'zh' ? '有' : 'あり'}</span>`
            : `<span class="badge badge-no"><i class="fas fa-times"></i> ${currentLanguage === 'zh' ? '无' : 'なし'}</span>`}
                </td>
                <td class="icon-cell">
                    ${beach.is_free
            ? `<span class="badge badge-free"><i class="fas fa-check"></i> ${currentLanguage === 'zh' ? '免费' : '無料'}</span>`
            : `<span class="badge badge-paid"><i class="fas fa-yen-sign"></i> ${currentLanguage === 'zh' ? '收费' : '有料'}</span>`}
                </td>
                <td>
                    <div class="note">${beach.note}</div>
                </td>
            </tr>
            `;
    });

    tbody.innerHTML = html;
}

// 设置事件监听
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const lifeguardFilter = document.getElementById('lifeguardFilter');
    const showerFilter = document.getElementById('showerFilter');
    const feeFilter = document.getElementById('feeFilter');
    const resetBtn = document.getElementById('resetBtn');

    // 搜索功能
    searchInput.addEventListener('input', filterBeaches);

    // 筛选功能
    lifeguardFilter.addEventListener('change', filterBeaches);
    showerFilter.addEventListener('change', filterBeaches);
    feeFilter.addEventListener('change', filterBeaches);

    // 重置按钮
    resetBtn.addEventListener('click', function () {
        searchInput.value = '';
        lifeguardFilter.value = 'all';
        showerFilter.value = 'all';
        feeFilter.value = 'all';
        renderTable(beaches);
    });
}

// 设置语言切换按钮
function setupLanguageToggle() {
    const toggleButton = document.getElementById('languageToggle');
    if (toggleButton) {
        // 确保只添加一次事件监听器
        toggleButton.removeEventListener('click', toggleLanguage);
        toggleButton.addEventListener('click', toggleLanguage);
    }
}

// 切换语言
function toggleLanguage() {
    if (currentLanguage === 'zh') {
        // 跳转到日文页面
        window.location.href = 'index-jp.html';
    } else {
        // 跳转到中文页面
        window.location.href = 'index.html';
    }
}

// 筛选海滩
function filterBeaches() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const lifeguardValue = document.getElementById('lifeguardFilter').value;
    const showerValue = document.getElementById('showerFilter').value;
    const feeValue = document.getElementById('feeFilter').value;

    const filtered = beaches.filter(beach => {
        // 搜索过滤
        const matchesSearch = searchTerm === '' ||
            beach.name.toLowerCase().includes(searchTerm) ||
            beach.address.toLowerCase().includes(searchTerm);

        // 安全员过滤
        const matchesLifeguard = lifeguardValue === 'all' ||
            (lifeguardValue === 'yes' && beach.has_lifeguard) ||
            (lifeguardValue === 'no' && !beach.has_lifeguard);

        // 洗浴间过滤
        const matchesShower = showerValue === 'all' ||
            (showerValue === 'yes' && beach.has_shower) ||
            (showerValue === 'no' && !beach.has_shower);

        // 费用过滤
        const matchesFee = feeValue === 'all' ||
            (feeValue === 'free' && beach.is_free) ||
            (feeValue === 'paid' && !beach.is_free);

        return matchesSearch && matchesLifeguard && matchesShower && matchesFee;
    });

    renderTable(filtered);
}