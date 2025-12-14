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
    setupCursorAnimation();
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
        // 为海滩名称添加点击事件，点击后在新窗口打开Google地图
        html += `
            <tr>
                <td>
                    <div class="beach-name-link" 
                        onclick="openBeachMap('${beach.name}', '${beach.address}')">
                        ${beach.name}
                    </div>
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

// 打开海滩在Google地图中的位置
function openBeachMap(name, address) {
    try {
        // 构造Google Maps搜索URL
        const searchQuery = `${name} ${address} 冲绳`;
        // 使用URLSearchParams确保正确的编码
        const params = new URLSearchParams();
        params.append('api', '1');
        params.append('query', searchQuery);
        
        const googleMapsUrl = `https://www.google.com/maps/search/?${params.toString()}`;
        
        // 在新窗口中打开Google Maps
        const newWindow = window.open(googleMapsUrl, '_blank');
        
        // 检查是否被广告拦截器阻止
        if (!newWindow) {
            console.warn('未能打开新窗口，可能被广告拦截器阻止');
            // 提示用户手动打开链接
            alert('请允许弹窗或手动打开以下链接:\n' + googleMapsUrl);
        }
        
        // 触发小丑鱼游动动画
        triggerFishSwimAnimation();
    } catch (error) {
        console.error('打开地图时发生错误:', error);
        alert('打开地图时发生错误，请稍后重试');
    }
}

// 设置光标动画
function setupCursorAnimation() {
    // 监听鼠标点击事件
    document.addEventListener('click', function(e) {
        // 在点击位置添加游动动画
        createFishSwimEffect(e.clientX, e.clientY);
    });
}

// 创建小丑鱼游动效果
function createFishSwimEffect(x, y) {
    // 创建一个临时的游动元素
    const fish = document.createElement('div');
    fish.style.position = 'fixed';
    fish.style.left = (x - 16) + 'px';
    fish.style.top = (y - 16) + 'px';
    fish.style.width = '32px';
    fish.style.height = '32px';
    fish.style.backgroundImage = "url('assets/imgs/clownfish_64.png')";
    fish.style.backgroundSize = 'contain';
    fish.style.backgroundRepeat = 'no-repeat';
    fish.style.pointerEvents = 'none';
    fish.style.zIndex = '9999';
    
    // 添加动画类
    fish.style.transition = 'all 1s ease-out';
    fish.style.opacity = '1';
    
    // 添加到页面
    document.body.appendChild(fish);
    
    // 执行游动动画
    setTimeout(() => {
        // 随机方向游动
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const newX = x + Math.cos(angle) * distance;
        const newY = y + Math.sin(angle) * distance;
        
        fish.style.left = (newX - 16) + 'px';
        fish.style.top = (newY - 16) + 'px';
        fish.style.opacity = '0';
        fish.style.transform = 'scale(1.5)';
    }, 10);
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (fish.parentNode) {
            fish.parentNode.removeChild(fish);
        }
    }, 1000);
}

// 触发小丑鱼游动动画
function triggerFishSwimAnimation() {
    // 获取鼠标当前位置（如果有的话）
    const x = window.event ? window.event.clientX : window.innerWidth / 2;
    const y = window.event ? window.event.clientY : window.innerHeight / 2;
    createFishSwimEffect(x, y);
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