document.addEventListener('DOMContentLoaded', function() {
    // --- Fade-in sections logic (ĐÃ BỎ COMMENT ĐỂ ẨN KHI CUỘN LÊN) ---
    const fadeIns = document.querySelectorAll('.fade-in');

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        // Một phần tử được coi là trong viewport nếu nó có ít nhất một phần
        // nằm trong phạm vi hiển thị của cửa sổ trình duyệt.
        // Khoảng 100px ở cạnh trên và dưới có thể điều chỉnh để làm cho hiệu ứng mượt hơn.
        const viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
        const topThreshold = 100; // Hiện ra khi cách đỉnh viewport 100px
        const bottomThreshold = 100; // Hiện ra khi cách đáy viewport 100px

        return (
            rect.top < (viewportHeight - bottomThreshold) && // Phần tử chưa vượt quá đáy viewport quá 100px
            rect.bottom > topThreshold // Phần tử đã vào từ đỉnh viewport ít nhất 100px
        );
    }

    function showFadeIns() {
        fadeIns.forEach(section => {
            if (isElementInViewport(section)) {
                section.classList.add('active'); // Thêm class để hiện ra
            } else {
                // Tùy chọn: Nếu muốn ẩn lại khi cuộn ra khỏi viewport
                section.classList.remove('active'); // BỎ COMMENT DÒNG NÀY ĐỂ ẨN LẠI KHI CUỘN LÊN
            }
        });
    }

    showFadeIns(); // Kiểm tra ngay khi tải trang
    window.addEventListener('scroll', showFadeIns);
    window.addEventListener('resize', showFadeIns); // Kiểm tra khi thay đổi kích thước cửa sổ

    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.addEventListener('click', function() {
            alert('Chào bạn! Rất vui được kết nối với bạn qua trang cá nhân này.');
        });
    }

    // --- Hàm chung để thiết lập các section có thể thu gọn (độc quyền) ---
    function setupCollapsibleSection(triggerId, sectionId, iframeId = null) {
        const trigger = document.getElementById(triggerId);
        const section = document.getElementById(sectionId);
        const iframe = iframeId ? document.getElementById(iframeId) : null; // iframe là tùy chọn

        // Lấy tất cả các section có thể thu gọn để quản lý trạng thái độc quyền
        const allCollapsibleSections = document.querySelectorAll('.game-collapsible-section');

        if (trigger && section) {
            trigger.addEventListener('click', function() {
                // Xác định xem section được nhấp vào có đang hoạt động trước khi thay đổi trạng thái
                const isCurrentlyActive = section.classList.contains('active');

                // Đóng tất cả các section có thể thu gọn khác đang hoạt động
                allCollapsibleSections.forEach(otherSection => {
                    if (otherSection.classList.contains('active')) { // Chỉ đóng nếu nó đang active
                        otherSection.classList.remove('active');
                        // Nếu section khác có iframe, xóa src để dừng nội dung
                        const otherIframe = otherSection.querySelector('iframe');
                        if (otherIframe) {
                            otherIframe.src = ""; 
                        }
                    }
                });

                // Nếu section được nhấp vào không hoạt động ban đầu (tức là muốn mở nó)
                // hoặc nếu nó đã active và chúng ta muốn đóng nó (sau khi đã đóng tất cả các section khác)
                if (!isCurrentlyActive) {
                    section.classList.add('active'); // Mở section này
                    // Tải iframe nếu có
                    if (iframe) {
                        // Lấy src từ data-src nếu có, hoặc dùng src hiện tại
                        // Đảm bảo iframe có data-src="chess.html" (hoặc URL khác) trong HTML của bạn
                        iframe.src = iframe.dataset.src || iframe.src; 
                    }
                } else {
                    // Nếu nó đã active và chúng ta muốn đóng nó
                    section.classList.remove('active');
                    if (iframe) {
                        iframe.src = "";
                    }
                }
            });
        } else {
            console.warn(`Một hoặc nhiều phần tử cho section '${sectionId}' không được tìm thấy. Đảm bảo ID trong HTML là đúng: '${triggerId}', '${sectionId}'`);
        }
    }

    // --- Gọi hàm setupCollapsibleSection cho từng phần ---
    // Game Cờ Vua
    // Đảm bảo thẻ iframe trong index.html có thuộc tính data-src="chess.html"
    setupCollapsibleSection('chess-game-trigger', 'chess-game-section', 'chess-iframe');
    
    // Hoạt động tình nguyện (không có iframe)
    setupCollapsibleSection('volunteer-trigger', 'volunteer-section');
    
    // Đọc sách (không có iframe)
    setupCollapsibleSection('reading-trigger', 'reading-section');
    
    // Thích cảm giác chữa lành (không có iframe)
    setupCollapsibleSection('healing-trigger', 'healing-section');

    // --- (Tùy chọn) Logic cho Form Modal Cầu Lông (giữ nguyên nếu bạn có) ---
    // Phần này đã được comment lại trong code mẫu trước đó.
    // Nếu bạn có file HTML cho form cầu lông và muốn kích hoạt nó, hãy bỏ comment
    // và đảm bảo ID trong HTML (badminton-hobby-item, badminton-interest-form-modal, close-badminton-form) là đúng.
    // Ví dụ:
    // const badmintonHobbyItem = document.getElementById('badminton-hobby-item');
    // const badmintonFormModal = document.getElementById('badminton-interest-form-modal');
    // const closeBadmintonFormButton = document.getElementById('close-badminton-form');
    // if (badmintonHobbyItem && badmintonFormModal && closeBadmintonFormButton) {
    //     badmintonHobbyItem.addEventListener('click', function(event) {
    //         badmintonFormModal.classList.add('active');
    //     });
    //     closeBadmintonFormButton.addEventListener('click', function() {
    //         badmintonFormModal.classList.remove('active');
    //     });
    //     badmintonFormModal.addEventListener('click', function(event) {
    //         if (event.target === badmintonFormModal) {
    //             badmintonFormModal.classList.remove('active');
    //         });
    //     }
    // } else {
    //     console.warn("Một hoặc nhiều phần tử cho form cầu lông không được tìm thấy.");
    // }
});