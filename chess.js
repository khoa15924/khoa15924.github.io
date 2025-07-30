document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo Chess.js (engine game)
    const chess = new Chess();

    // Khởi tạo Chessboard.js (giao diện)
    let board = null; // Biến để lưu trữ đối tượng bàn cờ
    const $status = $('#status'); // Element để hiển thị trạng thái
    const $fen = $('#fen');       // Element để hiển thị FEN

    function onDragStart(source, piece, position, orientation) {
        // Chỉ cho phép kéo quân của lượt hiện tại
        // và không cho phép kéo khi game đã kết thúc
        // Cập nhật: chess.isGameOver() -> chess.game_over()
        if (chess.game_over() === true || 
            (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    }

    function onDrop(source, target) {
        // Xem nước đi có hợp lệ không
        let move = chess.move({
            from: source,
            to: target,
            promotion: 'q' // Luôn phong cấp thành Hậu nếu tốt đi tới cuối bàn
        });

        // Nếu nước đi không hợp lệ
        if (move === null) return 'snapback'; // Quân cờ sẽ trở về vị trí cũ

        updateStatus(); // Cập nhật trạng thái game sau mỗi nước đi
    }

    // Cập nhật vị trí các quân cờ khi animation kéo thả hoàn tất
    function onSnapEnd() {
        board.position(chess.fen()); // Đảm bảo bàn cờ trên giao diện khớp với trạng thái game
    }

    function updateStatus() {
        let status = '';
        let moveColor = 'Trắng';
        if (chess.turn() === 'b') {
            moveColor = 'Đen';
        }

        // Kiểm tra chiếu tướng, chiếu bí, hòa cờ
        // Cập nhật: chess.isCheckmate() -> chess.in_checkmate()
        // Cập nhật: chess.isDraw() -> chess.in_draw()
        if (chess.in_checkmate() === true) {
            status = 'GAME OVER! ' + moveColor + ' bị chiếu bí.';
        } else if (chess.in_draw() === true) {
            status = 'GAME OVER! Hòa cờ.';
        } else {
            status = moveColor + ' đi.';
            // Cập nhật: chess.isCheck() -> chess.in_check()
            if (chess.in_check() === true) {
                status += ' ' + moveColor + ' đang bị chiếu!';
            }
        }

        $status.html(status);
        $fen.html(chess.fen()); // Hiển thị trạng thái FEN (Forsyth-Edwards Notation)
    }

    // Cấu hình cho Chessboard.js
    const config = {
        draggable: true, // Cho phép kéo thả quân cờ
        position: 'start', // Vị trí ban đầu của bàn cờ
        onDragStart: onDragStart, // Hàm được gọi khi bắt đầu kéo
        onDrop: onDrop,       // Hàm được gọi khi thả quân cờ
        onSnapEnd: onSnapEnd  // Hàm được gọi sau khi animation hoàn tất
    };

    // Khởi tạo bàn cờ
    board = Chessboard('board', config); 

    // Cập nhật trạng thái lần đầu khi game khởi động
    updateStatus();

    // Nút "Chơi Lại"
    $('#resetBtn').on('click', function() {
        chess.reset(); // Reset trạng thái game trong Chess.js
        board.position('start'); // Đặt lại vị trí ban đầu trên giao diện
        updateStatus(); // Cập nhật trạng thái
    });

    // Nút "Đi lại" (Undo)
    $('#undoBtn').on('click', function() {
        chess.undo(); // Hoàn tác nước đi trong Chess.js
        board.position(chess.fen()); // Cập nhật bàn cờ trên giao diện
        updateStatus(); // Cập nhật trạng thái
    });
});