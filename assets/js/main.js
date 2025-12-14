let beaches = [];
let currentLanguage = 'zh'; // 'zh' for Chinese, 'ja' for Japanese

// 初始化
function initPage() {
    renderTable(beaches);
    setupEventListeners();
    setupLanguageToggle();
}

document.addEventListener('DOMContentLoaded', function () {
    loadBeachesData();
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
    currentLanguage = currentLanguage === 'zh' ? 'ja' : 'zh';
    updateUILanguage();
    loadBeachesData(currentLanguage);
}

// 更新界面语言
function updateUILanguage() {
    const toggleButton = document.getElementById('languageToggle');
    const titleElement = document.querySelector('title');
    const headerTitle = document.querySelector('header h1');
    const subtitle = document.querySelector('.subtitle');
    const searchInput = document.getElementById('searchInput');
    const lifeguardLabel = document.querySelector('[for="lifeguardFilter"]').previousElementSibling;
    const showerLabel = document.querySelector('[for="showerFilter"]').previousElementSibling;
    const feeLabel = document.querySelector('[for="feeFilter"]').previousElementSibling;
    const resetBtn = document.getElementById('resetBtn');
    const beachNameHeader = document.querySelector('th:nth-child(1)');
    const addressHeader = document.querySelector('th:nth-child(2)');
    const openTimeHeader = document.querySelector('th:nth-child(3)');
    const lifeguardHeader = document.querySelector('th:nth-child(4)');
    const showerHeader = document.querySelector('th:nth-child(5)');
    const feeHeader = document.querySelector('th:nth-child(6)');
    const noteHeader = document.querySelector('th:nth-child(7)');
    const noResultsText = document.querySelectorAll('#noResults p');
    const footerText = document.querySelector('footer p:first-child');
    const footerSuggestion = document.querySelector('footer p:last-child');

    if (currentLanguage === 'ja') {
        titleElement.textContent = '沖縄ビーチガイド | Okinawa Beach Guide';
        headerTitle.innerHTML = '🏖️ 沖縄ビーチガイド <button id="languageToggle" class="language-toggle">🇨🇳 中文</button>';
        subtitle.textContent = '沖縄のすべてのビーチのオープン時間、場所、ライフセーバー、シャワー、料金などの情報を提供';
        searchInput.placeholder = 'ビーチ名または住所を検索...';
        lifeguardLabel.textContent = 'ライフセーバー:';
        showerLabel.textContent = 'シャワー:';
        feeLabel.textContent = '料金:';
        resetBtn.innerHTML = '<i class="fas fa-redo"></i> フィルターをリセット';
        beachNameHeader.innerHTML = '<i class="fas fa-umbrella-beach"></i> ビーチ名';
        addressHeader.innerHTML = '<i class="fas fa-map-marker-alt"></i> 場所';
        openTimeHeader.innerHTML = '<i class="fas fa-clock"></i> オープン時間';
        lifeguardHeader.innerHTML = '<i class="fas fa-life-ring"></i> ライフセーバー';
        showerHeader.innerHTML = '<i class="fas fa-shower"></i> シャワー';
        feeHeader.innerHTML = '<i class="fas fa-yen-sign"></i> 料金';
        noteHeader.innerHTML = '<i class="fas fa-sticky-note"></i> 備考';
        document.getElementById('lifeguardFilter').innerHTML = `
            <option value="all">すべて</option>
            <option value="yes">あり</option>
            <option value="no">なし</option>
        `;
        document.getElementById('showerFilter').innerHTML = `
            <option value="all">すべて</option>
            <option value="yes">あり</option>
            <option value="no">なし</option>
        `;
        document.getElementById('feeFilter').innerHTML = `
            <option value="all">すべて</option>
            <option value="free">無料</option>
            <option value="paid">有料</option>
        `;
        if (noResultsText.length >= 2) {
            noResultsText[0].textContent = '条件に一致する結果が見つかりませんでした';
            noResultsText[1].textContent = '他の検索語またはフィルター条件をお試しください';
        }
        footerText.textContent = '© 2024 沖縄ビーチガイド | データは参考のみ、実際の情報と異なる場合があります';
        footerSuggestion.innerHTML = '<i class="fas fa-exclamation-circle"></i> 出発前に最新情報を確認することをおすすめします';
    } else {
        titleElement.textContent = '冲绳海滩指南 | Okinawa Beach Guide';
        headerTitle.innerHTML = '🏖️ 冲绳海滩指南 <button id="languageToggle" class="language-toggle">🇯🇵 日本語</button>';
        subtitle.textContent = '提供冲绳所有海滩的开放时间、位置、安全员、洗浴间、费用等信息';
        searchInput.placeholder = '搜索海滩名称或地址...';
        lifeguardLabel.textContent = '安全员:';
        showerLabel.textContent = '洗浴间:';
        feeLabel.textContent = '费用:';
        resetBtn.innerHTML = '<i class="fas fa-redo"></i> 重置筛选';
        beachNameHeader.innerHTML = '<i class="fas fa-umbrella-beach"></i> 海滩名称';
        addressHeader.innerHTML = '<i class="fas fa-map-marker-alt"></i> 位置';
        openTimeHeader.innerHTML = '<i class="fas fa-clock"></i> 开放时间';
        lifeguardHeader.innerHTML = '<i class="fas fa-life-ring"></i> 安全员';
        showerHeader.innerHTML = '<i class="fas fa-shower"></i> 洗浴间';
        feeHeader.innerHTML = '<i class="fas fa-yen-sign"></i> 费用';
        noteHeader.innerHTML = '<i class="fas fa-sticky-note"></i> 备注';
        document.getElementById('lifeguardFilter').innerHTML = `
            <option value="all">全部</option>
            <option value="yes">有安全员</option>
            <option value="no">无安全员</option>
        `;
        document.getElementById('showerFilter').innerHTML = `
            <option value="all">全部</option>
            <option value="yes">有洗浴间</option>
            <option value="no">无洗浴间</option>
        `;
        document.getElementById('feeFilter').innerHTML = `
            <option value="all">全部</option>
            <option value="free">免费</option>
            <option value="paid">收费</option>
        `;
        if (noResultsText.length >= 2) {
            noResultsText[0].textContent = '没有找到符合条件的结果';
            noResultsText[1].textContent = '请尝试其他搜索词或筛选条件';
        }
        footerText.textContent = '© 2024 冲绳海滩指南 | 数据仅供参考，实际信息可能有所变动';
        footerSuggestion.innerHTML = '<i class="fas fa-exclamation-circle"></i> 建议出行前确认最新信息';
    }

    // 重新绑定语言切换按钮事件
    const newToggleButton = document.getElementById('languageToggle');
    if (newToggleButton) {
        newToggleButton.removeEventListener('click', toggleLanguage);
        newToggleButton.addEventListener('click', toggleLanguage);
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