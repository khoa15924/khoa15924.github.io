// --- script.js ---

// --- Phần code Sidebar và Theme ---
const sidebarToggleBtns = document.querySelectorAll(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
const searchForm = document.querySelector(".search-form");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
// menuLinks sẽ được lấy lại bên trong DOMContentLoaded để đảm bảo chúng tồn tại

// Cập nhật biểu tượng theme dựa trên trạng thái hiện tại của theme và sidebar
const updateThemeIcon = () => {
    const isDark = document.body.classList.contains("dark-theme");
    themeIcon.textContent = sidebar.classList.contains("collapsed") ? (isDark ? "light_mode" : "dark_mode") : "dark_mode";
};

// Áp dụng theme tối nếu đã lưu hoặc hệ thống ưu tiên, sau đó cập nhật biểu tượng
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon();

// Chuyển đổi giữa các theme khi nhấn nút theme
themeToggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon();
});

// Chuyển đổi trạng thái thu gọn của sidebar khi nhấn nút
sidebarToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        updateThemeIcon();
    });
});

// Mở rộng sidebar khi nhấn vào form tìm kiếm
searchForm.addEventListener("click", () => {
    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
        searchForm.querySelector("input").focus();
    }
});

// Mở rộng sidebar mặc định trên màn hình lớn
if (window.innerWidth > 768) sidebar.classList.remove("collapsed");


// --- Phần code Xử lý chuyển đổi nội dung ---
document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử nội dung chính
    const dashboardContent = document.getElementById('dashboardContent');
    const profileIframe = document.getElementById('profileIframe');
    const memoryGameIframe = document.getElementById('memoryGameIframe');
    const drawIframe = document.getElementById('drawIframe');
    const pianoIframe = document.getElementById('pianoIframe');

    // Lấy tất cả các liên kết menu (được đặt trong DOMContentLoaded để đảm bảo chúng tồn tại)
    const menuLinks = document.querySelectorAll(".menu-link");

    // Dùng Map để lưu trữ các phần tử nội dung có thể hiển thị
    const contentMap = new Map();
    contentMap.set('dashboard', dashboardContent);
    if (profileIframe) contentMap.set('profile', profileIframe);
    if (memoryGameIframe) contentMap.set('memory-game', memoryGameIframe);
    if (drawIframe) contentMap.set('draw', drawIframe);
    if (pianoIframe) contentMap.set('piano', pianoIframe);


    const hideAllContent = () => {
        contentMap.forEach(element => {
            if (element) { // Đảm bảo phần tử tồn tại trước khi thao tác
                element.style.display = 'none';
            }
        });
        // main-content's alignment được đặt cố định trong CSS (justify-content/align-items: center),
        // nên không cần reset ở đây.
    };

    // Gắn sự kiện click cho mỗi link trong sidebar
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết

            // Xóa class 'active' khỏi tất cả các liên kết
            menuLinks.forEach(item => item.classList.remove('active'));
            // Thêm class 'active' vào liên kết được nhấp
            link.classList.add('active');

            const contentToShow = link.dataset.content; // Lấy giá trị từ data-content

            hideAllContent(); // Ẩn tất cả nội dung trước

            // Hiển thị nội dung dựa trên giá trị data-content
            const targetElement = contentMap.get(contentToShow);
            if (targetElement) {
                // Tất cả các iframe và dashboardContent đều dùng display: 'block'
                targetElement.style.display = 'block';
            } else {
                console.warn(`Không tìm thấy phần tử đích cho data-content="${contentToShow}".`);
            }
        });
    });

    // Thiết lập trạng thái ban đầu khi tải trang: hiển thị Dashboard
    // Kích hoạt click vào Dashboard để nó hiển thị mặc định và class 'active' được đặt đúng
    const dashboardLink = document.querySelector('.menu-link[data-content="dashboard"]');
    if (dashboardLink) { // Đảm bảo phần tử liên kết Dashboard tồn tại
        dashboardLink.click();
    } else {
        console.error("Lỗi: Không tìm thấy liên kết Dashboard (`data-content='dashboard'`). Vui lòng kiểm tra HTML.");
        // Fallback: Hiển thị Dashboard thủ công nếu không tìm thấy liên kết
        if (dashboardContent) {
            dashboardContent.style.display = 'block';
        }
    }
});